import {useRef, useState} from "react";
import {
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    View,
    ViewStyle,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {fonts} from "@/fonts/fonts";

type Props = {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    style?: ViewStyle | ViewStyle[];
};

const CodeInput = ({length = 6, value, onChange, error, style}: Props) => {
    const inputsRef = useRef<(TextInput | null)[]>([]);
    const [internal, setInternal] = useState("");

    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const digits = current.split("").slice(0, length);

    const emit = (next: string[]) => {
        const joined = next.join("").slice(0, length);
        if (!isControlled) setInternal(joined);
        onChange?.(joined);
    };

    const handleChange = (index: number, raw: string) => {
        // paste-ის შემთხვევაში შესაძლოა ერთზე მეტი ციფრი მოვიდეს
        const clean = raw.replace(/\D/g, "");
        if (clean.length > 1) {
            const next = clean.slice(0, length).split("");
            emit(next);
            const nextIndex = Math.min(clean.length, length - 1);
            inputsRef.current[nextIndex]?.focus();
            return;
        }
        const digit = clean.slice(-1);
        const next = [...digits];
        next[index] = digit;
        emit(next);
        if (digit && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        index: number,
        e: NativeSyntheticEvent<TextInputKeyPressEventData>
    ) => {
        if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.wrapper}>
                {Array.from({length}).map((_, index) => {
                    const filled = Boolean(digits[index]);
                    return (
                        <TextInput
                            key={index}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            style={[
                                styles.box,
                                filled && styles.filled,
                                error && styles.error,
                            ]}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digits[index] ?? ""}
                            onChangeText={(text) => handleChange(index, text)}
                            onKeyPress={(e) => handleKeyPress(index, e)}
                            textAlign="center"
                        />
                    );
                })}
            </View>

            {error ? (
                <View style={styles.errorMessage}>
                    <Ionicons name="alert-circle" size={16} color="#ED5656"/>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        width: "100%",
    },
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 8,
    },
    box: {
        flex: 1,
        maxWidth: 56,
        aspectRatio: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d9d9d9",
        textAlign: "center",
        color: "#171717",
        fontSize: 30,
        fontFamily: fonts.firago(500),
    },
    filled: {
        borderColor: "#49b83f",
    },
    error: {
        borderColor: "#e05a5a",
    },
    errorMessage: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
        alignSelf: "flex-start",
    },
    errorText: {
        color: "#ED5656",
        fontSize: 14,
        fontFamily: fonts.mersad(600),
        lineHeight: 24,
    },
});

export default CodeInput;
