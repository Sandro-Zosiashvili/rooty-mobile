import {useEffect, useState} from "react";
import {Animated, Image, Modal, Pressable, StyleSheet, Text, View, ViewStyle} from "react-native";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import DescriptionTexts from "@/Components/LandingComponents/atoms/DescriptionTexts/DescriptionTexts";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

type Props = {
    isOpen: boolean;
    title: string;
    description?: string;
    hideCancel?: boolean;
    overlayStyle?: ViewStyle;
    onClose?: () => void;
    onLogout?: () => void;
    loading?: boolean;
};

const LogoutConfirmDialog = ({
                                 isOpen,
                                 overlayStyle,
                                 hideCancel,
                                 onLogout,
                                 description,
                                 title,
                                 onClose,
                                 loading,
                             }: Props) => {
    const [anim] = useState(() => new Animated.Value(0));

    useEffect(() => {
        if (!isOpen) return;
        anim.setValue(0);
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 6,
            tension: 80,
        }).start();
    }, [isOpen, anim]);

    const scale = anim.interpolate({inputRange: [0, 1], outputRange: [0.85, 1]});

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                style={[styles.overlay, overlayStyle]}
                onPress={() => !loading && onClose?.()}
            >
                <Animated.View style={[styles.modal, {opacity: anim, transform: [{scale}]}]}>
                    <Pressable>
                        <Image
                            source={require("@/assets/icons/kentsero-login.png")}
                            style={styles.img}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>{title}</Text>
                        <DescriptionTexts style={styles.description}>
                            {description ?? "შენი პროგრესი შენახულია. ნებისმიერ დროს შეძლებ დაბრუნებას."}
                        </DescriptionTexts>
                        <View style={styles.buttons}>
                            {!hideCancel ? (
                                <Button variant="tertiary" style={styles.secondButton} onClick={onClose} disabled={loading}>
                                    უკან
                                </Button>
                            ) : null}
                            <Button variant="primary" style={styles.button} onClick={onLogout} loading={loading} disabled={loading}>
                                გამოსვლა
                            </Button>
                        </View>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    modal: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: colors.primary500,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
    },
    img: {
        width: 52,
        height: 52,
        alignSelf: "center",
    },
    title: {
        color: colors.secondary500,
        fontSize: 24,
        fontFamily: fonts.futura(),
        lineHeight: 32,
        textAlign: "center",
        marginTop: 16,
    },
    description: {
        textAlign: "center",
        marginTop: 8,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        marginTop: 24,
    },
    secondButton: {
        flex: 1,
    },
    button: {
        flex: 1,
    },
});

export default LogoutConfirmDialog;
