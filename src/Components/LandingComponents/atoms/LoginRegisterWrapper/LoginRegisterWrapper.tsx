import {ReactNode} from "react";
import {StyleSheet, View, ViewStyle} from "react-native";
import {colors} from "@/styles/colors";

type Props = {
    children: ReactNode;
    style?: ViewStyle | ViewStyle[];
};

const LoginRegisterWrapper = ({children, style}: Props) => {
    return <View style={[styles.section, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    // ვების .section: padding 32/24, mobile-ზე 32 16 48 16, radius 16, თეთრი ფონი, რბილი shadow
    section: {
        flexDirection: "column",
        width: "100%",
        maxWidth: 420,
        alignSelf: "center",
        paddingTop: 32,
        paddingHorizontal: 16,
        paddingBottom: 48,
        borderRadius: 16,
        backgroundColor: colors.primary500,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 6,
    },
});

export default LoginRegisterWrapper;
