import {ScrollView, StyleSheet} from "react-native";
import ResetPassword from "@/Components/LandingComponents/molecules/ForgotPasswordForm/ResetPassword/ResetPassword";

export default function ResetPasswordPage() {
    return (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
            <ResetPassword/>
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
