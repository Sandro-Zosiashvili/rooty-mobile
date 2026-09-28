import {Image, StyleSheet, Text, View} from "react-native";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

const KentseroLogo = () => {
    return (
        <View style={styles.header}>
            <Image
                source={require("@/assets/icons/logo-for-login.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>ROOTY</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        gap: 6,
    },
    logo: {
        width: 32,
        height: 32,
    },
    title: {
        color: colors.secondary500,
        fontSize: 20,
        fontFamily: fonts.mina(400),
        lineHeight: 24,
        letterSpacing: 1.6,
        alignSelf: "flex-end",
    },
});

export default KentseroLogo;
