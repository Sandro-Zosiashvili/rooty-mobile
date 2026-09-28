import {ScrollView, StyleSheet} from "react-native";
import ChooseUsername from "@/Components/LandingComponents/molecules/RegisterContent/ChooseUsername/ChooseUsername";

export default function UsernamePage() {
    return (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
            <ChooseUsername/>
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
