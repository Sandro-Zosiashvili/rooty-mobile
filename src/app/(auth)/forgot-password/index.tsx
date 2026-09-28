import {ScrollView, StyleSheet} from "react-native";
import ForgotPasswordForm from "@/Components/LandingComponents/molecules/ForgotPasswordForm/ForgotPasswordForm";

export default function ForgotPassword() {
    return (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
            <ForgotPasswordForm/>
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
