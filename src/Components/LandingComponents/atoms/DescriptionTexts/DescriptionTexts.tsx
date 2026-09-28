import React from "react";
import {StyleSheet, Text, TextStyle} from "react-native";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

type Props = {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
};

const DescriptionTexts = ({children, style}: Props) => {
    return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
    text: {
        color: colors.secondary300,
        fontSize: 14,
        fontFamily: fonts.mersad(500),
        lineHeight: 24,
    },
});

export default DescriptionTexts;
