import {Platform} from "react-native";

/**
 * ბექენდის მისამართი. თუ EXPO_PUBLIC_BACKEND_URL გაწერილია — ის იგებს;
 * თუ არა (მაგ. .env აკლია ან არასწორი პრეფიქსით წერია), dev default-ზე ვვარდებით.
 *
 * მობაილზე "localhost" თვითონ მოწყობილობაა, არა შენი Mac:
 *   iOS Simulator      → localhost მუშაობს
 *   Android Emulator   → 10.0.2.2 = host-ის localhost
 * ფიზიკურ ტელეფონზე Mac-ის LAN IP დაგჭირდება — EXPO_PUBLIC_BACKEND_URL-ით.
 */
const DEV_DEFAULT =
    Platform.OS === "android" ? "http://10.0.2.2:3000/api" : "http://localhost:3000/api";

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? DEV_DEFAULT;
