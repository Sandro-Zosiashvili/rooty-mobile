import axios from "axios";
import type {AxiosError, InternalAxiosRequestConfig} from "axios";
import {ERRORS} from "@/Validations/errors";
import {clearSession, getAccessToken, persistFromCookies, refreshSession, setSession} from "@/auth/session";
import {BACKEND_URL} from "@/x-api/env";

const client = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

// login-ის წარმატებაზე ბექენდი cookie-ს დებს და user-ს აბრუნებს — ეს URL-ები სესიას ხსნიან.
const SESSION_URLS = ["/auth/login", "/auth/verify-registration", "/auth/google/complete"];

// მოთხოვნას ვურთავთ Bearer-ს, თუ SecureStore-ში token გვაქვს (Android-ის ბონუსი).
client.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if (token) config.headers.set?.("Authorization", `Bearer ${token}`);
    return config;
});

// ბრაუზერის cookie jar-ის ნაცვლად: Set-Cookie-დან token-ს ვინახავთ, სესიის flag-ს ვდებთ/ვშლით.
client.interceptors.response.use(
    async (response) => {
        const setCookie = response.headers?.["set-cookie"];
        if (setCookie) await persistFromCookies(setCookie);

        const url = response.config.url ?? "";
        const googleLoggedIn = url.includes("/auth/google") && !(response.data as {needsUsername?: boolean})?.needsUsername;
        if (SESSION_URLS.some((u) => url.includes(u)) || googleLoggedIn) await setSession();
        if (url.includes("/auth/logout")) await clearSession();

        return response;
    },
    async (error: AxiosError) => {
        const original = error.config as (InternalAxiosRequestConfig & {_retry?: boolean}) | undefined;
        const isAuthCall = original?.url?.includes("/auth/");
        if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
            original._retry = true;
            if (await refreshSession()) return client(original);
            await clearSession();
        }
        return Promise.reject(error);
    }
);

export type ApiResult<T> =
    | { ok: true; data: T; message: string }
    | {
    ok: false;
    message: string;
    fields?: Record<string, string>;
    blocked?: boolean;
    onboardingCompleted?: boolean;
};

type ErrorBody = {
    message?: string | string[];
    fields?: Record<string, string> | undefined;
};

const toMessage = (raw: ErrorBody["message"], fallback = ERRORS.DEFAULT_ERROR): string =>
    Array.isArray(raw) ? raw.join(", ") : raw ?? fallback;

export const GET = async <T>(
    url: string,
    params?: Record<string, unknown>,
): Promise<ApiResult<T>> => {
    try {
        const {data} = await client.get<T>(url, {params});
        return {
            ok: true,
            data,
            message: (data as { message?: string })?.message ?? "წარმატება",
        };
    } catch (err) {
        const {response} = err as AxiosError<ErrorBody>;
        if (!response) {
            return {ok: false, message: ERRORS.NETWORK_ERROR};
        }
        if (response.data?.message || response.data?.fields) {
            return {
                ok: false,
                message: toMessage(response.data.message),
                fields: response.data.fields,
            };
        }
        return {ok: false, message: ERRORS.UNKNOWN_ERROR};
    }
};

export const POST = async <T>(url: string, body?: unknown): Promise<ApiResult<T>> => {
    try {
        const {data} = await client.post<T>(url, body);
        return {
            ok: true,
            data,
            message: (data as { message?: string })?.message ?? "წარმატება",
        };
    } catch (err) {
        const {response} = err as AxiosError<ErrorBody>;
        if (!response) {
            return {ok: false, message: ERRORS.NETWORK_ERROR};
        }
        if (response.data?.message || response.data?.fields) {
            return {
                ok: false,
                message: toMessage(response.data.message),
                fields: response.data.fields,
            };
        }
        return {ok: false, message: ERRORS.UNKNOWN_ERROR};
    }
};

export const PATCH = async <T>(url: string, body?: unknown): Promise<ApiResult<T>> => {
    try {
        const {data} = await client.patch<T>(url, body);
        return {
            ok: true,
            data,
            message: (data as { message?: string })?.message ?? "წარმატება",
        };
    } catch (err) {
        const {response} = err as AxiosError<ErrorBody>;
        if (!response) {
            return {ok: false, message: ERRORS.NETWORK_ERROR};
        }
        if (response.data?.message || response.data?.fields) {
            return {
                ok: false,
                message: toMessage(response.data.message),
                fields: response.data.fields,
            };
        }
        return {ok: false, message: ERRORS.UNKNOWN_ERROR};
    }
};

export const DELETE = async <T>(url: string): Promise<ApiResult<T>> => {
    try {
        const {data} = await client.delete<T>(url);
        return {
            ok: true,
            data,
            message: (data as { message?: string })?.message ?? "წარმატება",
        };
    } catch (err) {
        const {response} = err as AxiosError<ErrorBody>;
        if (!response) {
            return {ok: false, message: ERRORS.NETWORK_ERROR};
        }
        if (response.data?.message || response.data?.fields) {
            return {
                ok: false,
                message: toMessage(response.data.message),
                fields: response.data.fields,
            };
        }
        return {ok: false, message: ERRORS.UNKNOWN_ERROR};
    }
};
