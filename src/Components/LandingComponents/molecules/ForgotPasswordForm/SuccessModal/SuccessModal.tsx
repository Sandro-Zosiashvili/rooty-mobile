import {useEffect, useState} from "react";
import {Animated, Image, Modal, Pressable, StyleSheet, Text} from "react-native";
import {router} from "expo-router";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import DescriptionTexts from "@/Components/LandingComponents/atoms/DescriptionTexts/DescriptionTexts";
import {colors} from "@/styles/colors";

type Props = {
    isOpen: boolean;
    forRegister?: boolean;
    title: string;
    onClose?: () => void;
};

const SuccessModal = ({isOpen, forRegister, title, onClose}: Props) => {
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
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View style={[styles.modal, {opacity: anim, transform: [{scale}]}]}>
                    <Pressable>
                        <Image source={require("@/assets/icons/kentsero-login.png")} style={styles.img} resizeMode="contain"/>
                        <Text style={styles.title}>{title}</Text>
                        {!forRegister ? (
                            <DescriptionTexts style={styles.description}>
                                პაროლი შეცვლილია, შეგიძლია სისტემაში შეხვიდე ახალი პაროლით
                            </DescriptionTexts>
                        ) : null}
                        <Button variant="primary" onClick={() => router.replace("/login")} style={styles.button}>
                            მთავარი გვერდი
                        </Button>
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
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 28,
        textAlign: "center",
        marginTop: 16,
    },
    description: {
        textAlign: "center",
        marginTop: 8,
    },
    button: {
        width: "100%",
        marginTop: 24,
        paddingVertical: 12,
    },
});

export default SuccessModal;
