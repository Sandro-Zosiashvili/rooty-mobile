import * as SecureStore from "expo-secure-store";

/**
 * ვების ვერსიაში სესია httpOnly cookie-ებში იყო (access_token / refresh_token),
 * და მათ Next.js middleware (src/proxy.ts) კითხულობდა.
 *
 * მობაილს browser-ის cookie jar არ აქვს, ამიტომ token-ებს SecureStore-ში ვინახავთ
 * (iOS Keychain / Android Keystore) და ყოველ მოთხოვნაზე Authorization: Bearer <token>-ით ვგზავნით.
 * ეს ფაილი არის proxy.ts-ის სესიის ლოგიკის მობაილური ეკვივალენტი.
 */

export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";

const EXP_LEEWAY_MS = 5_000;

// JWT-ის payload-ის decode ბიბლიოთეკის გარეშე (jose ვებისთვისაა).
function decodeJwt(token: string): { exp?: number } | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(
            normalized.length + ((4 - (normalized.length % 4)) % 4),
            "="
        );
        // atob RN Hermes-ში ხელმისაწვდომია
        const json = decodeURIComponent(
            atob(padded)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function isTokenExpired(token?: string | null): boolean {
    if (!token) return true;
    const decoded = decodeJwt(token);
    if (!decoded || typeof decoded.exp !== "number") return true;
    return Date.now() >= decoded.exp * 1000 - EXP_LEEWAY_MS;
}

export async function getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN);
}

export async function setTokens(access?: string | null, refresh?: string | null): Promise<void> {
    if (access) await SecureStore.setItemAsync(ACCESS_TOKEN, access);
    if (refresh) await SecureStore.setItemAsync(REFRESH_TOKEN, refresh);
}

export async function clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN);
}

export async function hasSession(): Promise<boolean> {
    const access = await getAccessToken();
    if (!isTokenExpired(access)) return true;
    const refresh = await getRefreshToken();
    return Boolean(refresh);
}

/**
 * login/register პასუხიდან token-ების ამოღება და შენახვა.
 * ბექენდის პასუხის ზუსტი ფორმა უცნობია — ვცდით გავრცელებულ ვარიანტებს.
 * თუ ბექენდი token-ს მხოლოდ Set-Cookie-ში აბრუნებს (და არა body-ში),
 * აქ დასამატებელი იქნება მისი წაკითხვა header-იდან, ან ბექენდზე პატარა ცვლილება.
 */
export async function persistFromResponse(data: unknown): Promise<void> {
    if (!data || typeof data !== "object") return;
    const d = data as Record<string, any>;
    const access =
        d.access_token ?? d.accessToken ?? d.token ?? d.tokens?.access_token ?? d.tokens?.accessToken;
    const refresh =
        d.refresh_token ?? d.refreshToken ?? d.tokens?.refresh_token ?? d.tokens?.refreshToken;
    await setTokens(access, refresh);
}

/**
 * ბექენდი token-ებს Set-Cookie header-ით აბრუნებს (access_token / refresh_token),
 * body-ში კი მხოლოდ user-ია. ბრაუზერი ამ cookie-ებს უხილავად ინახავდა; RN-ს
 * Set-Cookie header-ის წაკითხვა შეუძლია, ამიტომ აქ ვიღებთ token-ებს header-იდან
 * და SecureStore-ში ვდებთ. JWT-ის მნიშვნელობა არ შეიცავს ; , ან space-ს.
 */
function matchCookie(text: string, name: string): string | null {
    const m = text.match(new RegExp(`${name}=([^;,\\s]+)`));
    return m ? m[1] : null;
}

export async function persistFromCookies(setCookie: string | string[]): Promise<void> {
    const text = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie;
    const access = matchCookie(text, ACCESS_TOKEN);
    const refresh = matchCookie(text, REFRESH_TOKEN);
    if (access || refresh) await setTokens(access, refresh);
}

/**
 * proxy.ts-ის refresh ბლოკის ეკვივალენტი. ვებში refresh cookie-ს Next middleware
 * აგზავნიდა; მობაილში SecureStore-ის refresh token-ს ვგზავნით (header + body,
 * რომ ბექენდის ორივე მოლოდინი დაიფაროს) და ახალ token-ებს ვინახავთ.
 */
export async function refreshSession(): Promise<boolean> {
    const refresh = await getRefreshToken();
    if (!refresh) return false;
    try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${REFRESH_TOKEN}=${refresh}`,
            },
            body: JSON.stringify({refresh_token: refresh}),
        });
        if (!res.ok) return false;
        // refresh ახალ access token-ს Set-Cookie-ში აბრუნებს, body-ში მხოლოდ {message}
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) await persistFromCookies(setCookie);
        const data = await res.json().catch(() => null);
        await persistFromResponse(data);
        return true;
    } catch {
        return false;
    }
}
