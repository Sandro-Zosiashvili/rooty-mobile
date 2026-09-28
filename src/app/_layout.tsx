import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useProxy} from "@/proxy";

export default function RootLayout() {
    useProxy();
    return (
        <>
            <StatusBar style="dark"/>
            <Stack screenOptions={{headerShown: false}}/>
        </>
    );
}
