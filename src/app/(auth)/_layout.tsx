import {Image, KeyboardAvoidingView, Platform, StyleSheet, View} from "react-native";
import {Stack} from "expo-router";
import ToastContainer from "@/Components/LandingComponents/atoms/ToastProvider/ToastContainer";
import {colors} from "@/styles/colors";

// ვების app/(auth)/layout.tsx: authWrapper + ToastContainer.
// დეკორატიული ფონი (ვებში login SVG-ები) ყველა auth გვერდისთვის ერთია, ამიტომ აქ, group layout-შია.
export default function AuthLayout() {
    return (
        <View style={styles.authWrapper}>
            <Image
                source={require("@/assets/icons/login66.png")}
                style={styles.banner}
                resizeMode="cover"
            />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Stack screenOptions={{headerShown: false, contentStyle: {backgroundColor: "transparent"}}}/>
            </KeyboardAvoidingView>
            <ToastContainer/>
        </View>
    );
}

const styles = StyleSheet.create({
    authWrapper: {
        flex: 1,
        backgroundColor: colors.pageBackground,
    },
    banner: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: 359,
    },
    flex: {
        flex: 1,
    },
});
