import {ScrollView, StyleSheet} from "react-native";
import RegisterContent from "@/Components/LandingComponents/molecules/RegisterContent/RegisterContent";

export default function Register() {
    return (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
            <RegisterContent/>
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
