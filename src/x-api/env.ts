import {Platform} from "react-native";
import Constants from "expo-constants";

/**
 * ბექენდის მისამართი.
 * პრიორიტეტი:
 *   1. EXPO_PUBLIC_BACKEND_URL — ცხადი override (მაგ. prod).
 *   2. Metro-ს host-ი — dev-ში ტელეფონი/ემულატორი იმ მანქანას მიაკითხავს, სადაც
 *      Metro-ა გაშვებული (იგივე Mac, სადაც backend-ია). ასე localhost-ის პრობლემა იხსნება.
 *   3. პლატფორმის default.
 *
 * dev-ში backend პორტია 3000, prefix — /api.
 */
const DEV_PORT = 3000;
const API_PREFIX = "/api";

const platformDefault =
    Platform.OS === "android"
        ? `http://10.0.2.2:${DEV_PORT}${API_PREFIX}`
        : `http://localhost:${DEV_PORT}${API_PREFIX}`;

function fromMetroHost(): string | null {
    // მაგ. "192.168.1.3:8081" → აქედან მხოლოდ host-ს ვიღებთ
    const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
    const host = hostUri?.split(":")[0];
    if (!host || host === "localhost" || host === "127.0.0.1") return null;
    return `http://${host}:${DEV_PORT}${API_PREFIX}`;
}

export const BACKEND_URL =
    process.env.EXPO_PUBLIC_BACKEND_URL ?? fromMetroHost() ?? platformDefault;
