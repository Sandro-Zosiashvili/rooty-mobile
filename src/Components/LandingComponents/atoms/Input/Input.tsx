import {useState} from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

type Props = Omit<TextInputProps, "style"> & {
    type?: "text" | "password" | "email";
    error?: string;
    warning?: string;
    label?: string;
    style?: ViewStyle | ViewStyle[];
    multiline?: boolean;
    maxLength?: number;
    showCounter?: boolean;
};

const Input = (props: Props) => {
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);
    const [count, setCount] = useState(0);

    const {
        type = "text",
        placeholder = "ტექსტი",
        error,
        warning,
        label,
        style,
        multiline = false,
        maxLength,
        showCounter,
        onChangeText,
        onFocus,
        onBlur,
        value,
        ...rest
    } = props;

    const isPassword = type === "password";
    const secure = isPassword && !show;

    const showCount = showCounter && typeof maxLength === "number";

    const handleChangeText = (text: string) => {
        setCount(text.length);
        onChangeText?.(text);
    };

    return (
        <View style={[styles.wrapper, style]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <View style={styles.inputBox}>
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.textarea,
                        focused && styles.inputFocused,
                        error && styles.inputError,
                        secure && styles.password,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.primary700}
                    secureTextEntry={secure}
                    keyboardType={type === "email" ? "email-address" : "default"}
                    autoCapitalize={type === "email" || isPassword ? "none" : "sentences"}
                    multiline={multiline}
                    maxLength={maxLength}
                    value={value}
                    onChangeText={handleChangeText}
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    {...rest}
                />

                {showCount ? (
                    <Text style={styles.counter}>
                        {count} / {maxLength}
                    </Text>
                ) : null}

                {isPassword && !multiline ? (
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShow((prev) => !prev)}
                        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                    >
                        <Ionicons
                            name={show ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color={colors.primary800}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>

            {error ? (
                <View style={[styles.message, styles.errorMessage]}>
                    <Ionicons name="alert-circle" size={16} color={colors.red500}/>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            {warning && !error ? (
                <View style={[styles.message, styles.warningMessage]}>
                    <Ionicons name="warning-outline" size={16} color={colors.accent600}/>
                    <Text style={styles.warningText}>{warning}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
        width: "100%",
    },
    inputBox: {
        position: "relative",
        justifyContent: "center",
    },
    input: {
        paddingLeft: 16,
        paddingRight: 48,
        height: 56,
        fontSize: 16,
        width: "100%",
        color: colors.secondary500,
        fontFamily: fonts.mersad(400),
        lineHeight: 24,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.secondary50,
        backgroundColor: colors.primary500,
    },
    inputFocused: {
        borderWidth: 1.5,
        borderColor: colors.secondary500,
    },
    inputError: {
        borderWidth: 1.5,
        borderColor: colors.red500,
    },
    password: {
        letterSpacing: 4,
        fontSize: 18,
    },
    textarea: {
        minHeight: 80,
        height: "auto",
        paddingTop: 16,
        textAlignVertical: "top",
    },
    message: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    errorMessage: {
        marginTop: 8,
    },
    errorText: {
        color: colors.red500,
        fontSize: 12,
        lineHeight: 20,
        fontFamily: fonts.mersad(500),
        flex: 1,
    },
    warningMessage: {
        marginTop: 16,
    },
    warningText: {
        color: colors.accent600,
        fontSize: 12,
        lineHeight: 20,
        fontFamily: fonts.mersad(500),
        flex: 1,
    },
    label: {
        color: colors.secondary500,
        fontSize: 12,
        lineHeight: 24,
        fontFamily: fonts.mersad(400),
        marginBottom: 4,
    },
    eyeButton: {
        position: "absolute",
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    counter: {
        position: "absolute",
        right: 16,
        bottom: 12,
        fontSize: 14,
        color: colors.primary800,
        fontFamily: fonts.firago(400),
        lineHeight: 24,
    },
});

export default Input;
