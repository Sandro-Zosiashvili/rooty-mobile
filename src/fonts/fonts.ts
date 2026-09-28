import {useFonts} from "expo-font";

/**
 * ვების src/fonts/fonts.ts-ის ანალოგი. ვებში localFont ერთი --font-* ცვლადით
 * ყველა weight-ს აერთიანებდა და CSS font-weight ირჩევდა სწორ ფაილს.
 *
 * RN-ში font-weight ფაილს არ ირჩევს — თითო weight ცალკე ოჯახად უნდა ჩაიტვირთოს.
 * ამიტომ თითო weight დარეგისტრირებულია ცალკე სახელით, ხოლო `fonts.<family>(weight)`
 * აბრუნებს შესაბამის fontFamily-ს, რომ StyleSheet-ებში ვების იდენტური იერი მივიღოთ.
 */

export const fontAssets = {
    "Futura-Book": require("@/assets/fonts/futura/Futura-Book.ttf"),

    "Mina-Regular": require("@/assets/fonts/mina/Mina-Regular.ttf"),
    "Mina-Bold": require("@/assets/fonts/mina/Mina-Bold.ttf"),

    "Mersad-Thin": require("@/assets/fonts/mersad/Mersad-Thin.otf"),
    "Mersad-ExtraLight": require("@/assets/fonts/mersad/Mersad-ExtraLight.otf"),
    "Mersad-Light": require("@/assets/fonts/mersad/Mersad-Light.otf"),
    "Mersad-Regular": require("@/assets/fonts/mersad/Mersad-Regular.otf"),
    "Mersad-Medium": require("@/assets/fonts/mersad/Mersad-Medium.otf"),
    "Mersad-SemiBold": require("@/assets/fonts/mersad/Mersad-SemiBold.otf"),
    "Mersad-Bold": require("@/assets/fonts/mersad/Mersad-Bold.otf"),
    "Mersad-ExtraBold": require("@/assets/fonts/mersad/Mersad-ExtraBold.otf"),
    "Mersad-Black": require("@/assets/fonts/mersad/Mersad-Black.otf"),

    "FiraGO-100": require("@/assets/fonts/firago/FiraGO-100.ttf"),
    "FiraGO-200": require("@/assets/fonts/firago/FiraGO-200.ttf"),
    "FiraGO-300": require("@/assets/fonts/firago/FiraGO-300.ttf"),
    "FiraGO-400": require("@/assets/fonts/firago/FiraGO-400.ttf"),
    "FiraGO-500": require("@/assets/fonts/firago/FiraGO-500.ttf"),
    "FiraGO-600": require("@/assets/fonts/firago/FiraGO-600.ttf"),
    "FiraGO-700": require("@/assets/fonts/firago/FiraGO-700.ttf"),
    "FiraGO-800": require("@/assets/fonts/firago/FiraGO-800.ttf"),
    "FiraGO-900": require("@/assets/fonts/firago/FiraGO-900.ttf"),

    "Inter-Regular": require("@/assets/fonts/inter/Inter-Regular.ttf"),
    "Inter-Medium": require("@/assets/fonts/inter/Inter-Medium.ttf"),
    "Inter-SemiBold": require("@/assets/fonts/inter/Inter-SemiBold.ttf"),
    "Inter-Bold": require("@/assets/fonts/inter/Inter-Bold.ttf"),
};

export function useAppFonts() {
    return useFonts(fontAssets);
}

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

const MERSAD: Record<Weight, string> = {
    100: "Mersad-Thin",
    200: "Mersad-ExtraLight",
    300: "Mersad-Light",
    400: "Mersad-Regular",
    500: "Mersad-Medium",
    600: "Mersad-SemiBold",
    700: "Mersad-Bold",
    800: "Mersad-ExtraBold",
    900: "Mersad-Black",
};

const INTER: Partial<Record<Weight, string>> = {
    400: "Inter-Regular",
    500: "Inter-Medium",
    600: "Inter-SemiBold",
    700: "Inter-Bold",
};

export const fonts = {
    futura: () => "Futura-Book",
    mina: (w: Weight = 400) => (w >= 700 ? "Mina-Bold" : "Mina-Regular"),
    mersad: (w: Weight = 400) => MERSAD[w],
    firago: (w: Weight = 400) => `FiraGO-${w}`,
    inter: (w: Weight = 600) => INTER[w] ?? "Inter-SemiBold",
};
