import {ScrollView, StyleSheet} from "react-native";
import LoginContent from "@/Components/LandingComponents/molecules/LoginContent/LoginContent";

export default function Login() {
    return (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
            <LoginContent/>
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
