import {useState} from "react";
import {Pressable, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {POST} from "@/x-api/api";
import {clearSession} from "@/auth/session";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";
import LogoutConfirmDialog from "@/Components/LandingComponents/atoms/Logout/LogoutConfirmDialog/LogoutConfirmDialog";

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await POST("/auth/logout");
        } catch {
            // ignore — მაინც ვასუფთავებთ ლოკალურ სესიას
        }
        await clearSession();
        setLoading(false);
        setOpen(false);
        router.replace("/login");
    };

    return (
        <>
            <LogoutConfirmDialog
                isOpen={open}
                loading={loading}
                onClose={() => !loading && setOpen(false)}
                title="ნამდვილად გსურს სისტემიდან გამოსვლა?"
                onLogout={handleLogout}
            />
            <Pressable style={styles.button} onPress={() => setOpen(true)}>
                <Ionicons name="log-out-outline" size={20} color={colors.secondary500}/>
                <Text style={styles.title}>გასვლა</Text>
            </Pressable>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    title: {
        color: colors.secondary500,
        fontSize: 16,
        fontFamily: fonts.futura(),
        lineHeight: 24,
    },
});

export default Logout;
