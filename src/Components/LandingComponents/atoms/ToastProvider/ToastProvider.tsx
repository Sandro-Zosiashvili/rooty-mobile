import {useEffect, useState} from "react";
import {Animated, Pressable, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

type ToastType = "success" | "error";

export type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

const ToastCard = ({toast, onRemove}: { toast: ToastItem; onRemove: (id: number) => void }) => {
    // gsap-ის ნაცვლად RN Animated
    const [anim] = useState(() => new Animated.Value(0));

    const dismiss = () => {
        Animated.timing(anim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => onRemove(toast.id));
    };

    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(dismiss, 3000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toast.id]);

    const translateY = anim.interpolate({inputRange: [0, 1], outputRange: [-40, 0]});

    return (
        <Animated.View style={{opacity: anim, transform: [{translateY}]}}>
            <Pressable
                onPress={dismiss}
                style={[styles.toast, toast.type === "success" ? styles.success : styles.error]}
            >
                <Ionicons
                    name={toast.type === "success" ? "checkmark-circle" : "alert-circle"}
                    size={22}
                    color={toast.type === "success" ? "#49b83f" : "#ED5656"}
                    style={styles.icon}
                />
                <Text style={styles.message}>{toast.message}</Text>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: colors.primary500,
        borderWidth: 1,
        borderColor: colors.secondary50,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
        width: "100%",
    },
    icon: {
        flexShrink: 0,
    },
    message: {
        flex: 1,
        color: colors.secondary400,
        fontSize: 14,
        fontFamily: fonts.futura(),
        lineHeight: 20,
    },
    success: {
        borderLeftWidth: 4,
        borderLeftColor: "#49b83f",
    },
    error: {
        borderLeftWidth: 4,
        borderLeftColor: "#ED5656",
    },
});

export default ToastCard;
