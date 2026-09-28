import {useEffect} from "react";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {useAppFonts} from "@/fonts/fonts";
import {useProxy} from "@/proxy";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useAppFonts();
    useProxy();

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <>
            <StatusBar style="dark"/>
            <Stack screenOptions={{headerShown: false}}/>
        </>
    );
}
