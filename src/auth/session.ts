import * as SecureStore from "expo-secure-store";
import {BACKEND_URL} from "@/x-api/env";

/**
 * ვების ვერსიაში სესია httpOnly cookie-ებში იყო (access_token / refresh_token),
 * და მათ Next.js middleware (src/proxy.ts) კითხულობდა.
 *
 * მობაილზე ბექენდი იმავე httpOnly cookie-ებს აბრუნებს Set-Cookie header-ით, ხოლო
 * RN-ის ნატიური ქსელი მათ თავად ინახავს (native cookie jar) და ავტომატურად აგზავნის
 * ყოველ მოთხოვნაზე (withCredentials). ესეიგი რეალურ auth-ს cookie აკეთებს.
 *
 * თუ Set-Cookie header წაკითხვადია (ხშირად Android-ზე), token-ებს SecureStore-შიც
 * ვინახავთ და Bearer-ადაც ვგზავნით (bonus). iOS-ზე header შეიძლება არ ჩანდეს — ამიტომ
 * "ვართ თუ არა შესული" აღინიშნება მსუბუქი SESSION_FLAG-ით, რომელიც login-ის წარმატებაზე
 * ისმება (backend 200 + user) და logout-ზე იშლება. guard სწორედ ამას ამოწმებს.
 */

export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
const SESSION_FLAG = "session_active";

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

export async function setSession(): Promise<void> {
    await SecureStore.setItemAsync(SESSION_FLAG, "1");
}

export async function clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_FLAG);
    await clearTokens();
}

export async function hasSession(): Promise<boolean> {
    if ((await SecureStore.getItemAsync(SESSION_FLAG)) === "1") return true;
    if (!isTokenExpired(await getAccessToken())) return true;
    return Boolean(await getRefreshToken());
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
 * proxy.ts-ის refresh ბლოკის ეკვივალენტი. refresh token-ს ნატიური cookie jar თავად
 * აგზავნის; SecureStore-ის refresh token-საც ვურთავთ header-ად, თუ გვაქვს.
 */
export async function refreshSession(): Promise<boolean> {
    try {
        const refresh = await getRefreshToken();
        const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: refresh ? {Cookie: `${REFRESH_TOKEN}=${refresh}`} : undefined,
        });
        if (!res.ok) return false;
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) await persistFromCookies(setCookie);
        return true;
    } catch {
        return false;
    }
}
