import {ScrollView, StyleSheet} from "react-native";
import EmailVerify from "@/Components/LandingComponents/molecules/ForgotPasswordForm/EmailVerify/EmailVerify";

export default function VerifyEmailPage() {
    return (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
            <EmailVerify/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 120,
    },
});
