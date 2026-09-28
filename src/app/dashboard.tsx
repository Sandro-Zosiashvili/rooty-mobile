import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import Logout from "@/Components/LandingComponents/atoms/Logout/Logout";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

// სატესტო თეთრი dashboard — login/logout ნაკადის შესამოწმებლად.
export default function Dashboard() {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>Dashboard</Text>
            </View>
            <View style={styles.footer}>
                <Logout/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary500,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: colors.secondary500,
        fontSize: 24,
        fontFamily: fonts.futura(),
    },
    footer: {
        padding: 16,
        alignItems: "center",
    },
});
