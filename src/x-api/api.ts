import axios from "axios";
import type {AxiosError} from "axios";
import {ERRORS} from "@/Validations/errors";
import {getAccessToken, persistFromCookies} from "@/auth/session";

const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
    withCredentials: true,
});

// ვებში cookie ავტომატურად მიდიოდა. მობაილში SecureStore-ის token-ს
// ყოველ მოთხოვნაზე Authorization: Bearer header-ად ვამატებთ.
client.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if (token) {
        config.headers.set?.("Authorization", `Bearer ${token}`);
    }
    return config;
});

// ბექენდი token-ებს Set-Cookie-ში აბრუნებს. ბრაუზერი მათ თავად ინახავდა;
// RN-ში ამ interceptor-ს ვთამაშობთ "cookie jar"-ის როლს — Set-Cookie-დან
// access/refresh token-ს ვიღებთ და SecureStore-ში ვდებთ.
client.interceptors.response.use(async (response) => {
    const setCookie = response.headers?.["set-cookie"];
    if (setCookie) await persistFromCookies(setCookie);
    return response;
});

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
