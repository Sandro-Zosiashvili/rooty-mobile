import {StyleSheet, Text, View, ViewStyle} from "react-native";
import {router} from "expo-router";
import {colors} from "@/styles/colors";

type Props = {
    style?: ViewStyle | ViewStyle[];
};

const SignupPrompt = ({style}: Props) => {
    return (
        <View style={[styles.signupPrompt, style]}>
            <Text style={styles.registerQuestion}>არ გაქვს ანგარიში?</Text>
            <Text onPress={() => router.push("/register")} style={styles.register}>
                დარეგისტრირდი
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    signupPrompt: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginTop: 24,
    },
    registerQuestion: {
        color: colors.primary800,
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 24,
    },
    register: {
        color: colors.secondary500,
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 24,
    },
});

export default SignupPrompt;
