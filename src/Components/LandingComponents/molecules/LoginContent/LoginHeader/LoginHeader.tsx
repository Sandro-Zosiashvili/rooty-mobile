import {StyleSheet, Text, View} from "react-native";
import KentseroLogo from "@/Components/LandingComponents/atoms/KentseroLogo/KentseroLogo";
import GoogleRegistration from "@/Components/LandingComponents/atoms/GoogleRegistration/GoogleRegistration";
import {colors} from "@/styles/colors";

const LoginHeader = () => {
    return (
        <>
            <KentseroLogo/>
            <GoogleRegistration/>
            <View style={styles.or}>
                <View style={styles.line}/>
                <Text style={styles.orTitle}>ან</Text>
                <View style={styles.line}/>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    or: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        width: "100%",
        marginTop: 24,
    },
    line: {
        flex: 1,
        backgroundColor: colors.secondary50,
        height: 1,
    },
    orTitle: {
        color: "#949494",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 24,
    },
});

export default LoginHeader;
