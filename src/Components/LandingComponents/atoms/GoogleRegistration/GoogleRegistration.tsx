import {useState} from "react";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {colors} from "@/styles/colors";
import {toast} from "@/Components/LandingComponents/atoms/ToastProvider/registerToast";

/**
 * ვებში Google Identity Services (window.google) გამოიყენებოდა — ეს ბრაუზერის API-ია
 * და მობაილზე არ არსებობს. ნატიური Google ავტორიზაცია expo-auth-session-ს და
 * Google client ID-ებს (iOS/Android/web) მოითხოვს.
 *
 * ღილაკის დიზაინი ვების იდენტურია. onPress-ზე ჯერ placeholder ტოსტია — აქ ჩაჯდება
 * expo-auth-session ნაკადი, რომელიც idToken-ს აიღებს და POST("/auth/google")-ს გამოიძახებს
 * (needsUsername → /register/username, თორემ → /dashboard), ვების ლოგიკის ანალოგიით.
 */
const GoogleRegistration = () => {
    const [loading] = useState(false);

    const handlePress = () => {
        toast.error("Google ავტორიზაცია მობაილზე მალე დაემატება");
    };

    return (
        <View style={styles.wrapper}>
            <Pressable
                style={[styles.googleRegistration, loading && styles.loading]}
                onPress={handlePress}
                disabled={loading}
            >
                <Image source={require("@/assets/icons/google.png")} style={styles.googleIcon} resizeMode="contain"/>
                <Text style={styles.googleTitle}>
                    <Text style={styles.google}>Google</Text> ავტორიზაცია
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },
    googleRegistration: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 56,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(23, 23, 23, 0.10)",
        backgroundColor: "#FFF",
        width: "100%",
        height: 48,
        paddingHorizontal: 24,
    },
    loading: {
        opacity: 0.6,
    },
    googleIcon: {
        width: 18,
        height: 18,
    },
    googleTitle: {
        color: colors.secondary500,
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 24,
    },
    google: {
        fontWeight: "600",
    },
});

export default GoogleRegistration;
