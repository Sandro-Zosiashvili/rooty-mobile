import {ScrollView, StyleSheet} from "react-native";
import OtpForm from "@/Components/LandingComponents/molecules/ForgotPasswordForm/OtpForm/OtpForm";

export default function VerifyPage() {
    return (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
            <OtpForm/>
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
