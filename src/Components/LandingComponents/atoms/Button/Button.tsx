import React from "react";
import {ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle} from "react-native";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

type Props = {
    variant: "primary" | "secondary" | "tertiary";
    children?: React.ReactNode;
    onClick?: () => void;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle;
    icon?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
};

const Button = ({variant, children, onClick, style, textStyle, icon, disabled = false, loading = false}: Props) => {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onClick}
            disabled={isDisabled}
            style={({pressed}) => [
                styles.base,
                styles[variant],
                isDisabled && variant === "primary" && styles.primaryDisabled,
                pressed && !isDisabled && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === "primary" ? colors.primary500 : colors.secondary500}/>
            ) : (
                <>
                    <Text
                        style={[
                            styles.text,
                            variant === "primary" ? styles.textPrimary : styles.textDark,
                            textStyle,
                        ]}
                    >
                        {children}
                    </Text>
                    {icon}
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        borderRadius: 32,
    },
    primary: {
        paddingVertical: 10,
        paddingHorizontal: 32,
        backgroundColor: colors.secondary500,
    },
    primaryDisabled: {
        backgroundColor: colors.secondary900,
    },
    secondary: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "transparent",
    },
    tertiary: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        backgroundColor: colors.primary500,
    },
    pressed: {
        opacity: 0.85,
    },
    text: {
        textAlign: "center",
        fontSize: 14,
        fontFamily: fonts.mersad(600),
        lineHeight: 24,
    },
    textPrimary: {
        color: colors.primary500,
    },
    textDark: {
        color: colors.secondary500,
    },
});

export default Button;
