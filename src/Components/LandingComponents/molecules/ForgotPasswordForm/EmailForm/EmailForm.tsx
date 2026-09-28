import {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import KentseroLogo from "@/Components/LandingComponents/atoms/KentseroLogo/KentseroLogo";
import DescriptionTexts from "@/Components/LandingComponents/atoms/DescriptionTexts/DescriptionTexts";
import Input from "@/Components/LandingComponents/atoms/Input/Input";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import {POST} from "@/x-api/api";
import {ERRORS} from "@/Validations/errors";
import {flowStorage} from "@/Storage/flowStorage";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

type EmailFormData = {
    email: string;
};

const EmailForm = () => {
    const [loading, setLoading] = useState(false);
    const {control, handleSubmit, setError, formState: {errors}} = useForm<EmailFormData>();

    const onSubmit = async (data: EmailFormData) => {
        setLoading(true);
        const res = await POST("/auth/forgot-password", {email: data.email});
        if (res.ok) {
            flowStorage.setItem("resetEmail", data.email);
            router.push("/forgot-password/verify");
            return;
        }
        if (res.fields) {
            Object.entries(res.fields).forEach(([, message]) => {
                setError("email", {message});
            });
        } else {
            setError("email", {message: res.message});
        }
        setLoading(false);
    };

    return (
        <View style={styles.emailForm}>
            <KentseroLogo/>
            <Text style={styles.title}>დაგავიწყდა პაროლი?</Text>
            <DescriptionTexts style={styles.description}>
                შეიყვანე შენი ელ.ფოსტა და ჩვენ გამოგიგზავნით ვერიფიკაციის კოდს
            </DescriptionTexts>
            <View style={styles.container}>
                <Controller
                    control={control}
                    name="email"
                    rules={{required: ERRORS.EMAIL_IS_REQUIRED}}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            type="email"
                            placeholder="ელ.ფოსტა"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.email?.message}
                        />
                    )}
                />
                <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={loading} disabled={loading} style={styles.button}>
                    გაგრძელება
                </Button>
            </View>
            <View style={styles.linesWrapper}>
                <View style={styles.activeLine}/>
                <View style={styles.line}/>
                <View style={styles.line}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    emailForm: {
        alignItems: "center",
    },
    title: {
        color: colors.secondary500,
        fontSize: 24,
        fontFamily: fonts.futura(),
        lineHeight: 32,
        textAlign: "center",
        marginTop: 24,
    },
    description: {
        textAlign: "center",
        marginTop: 8,
    },
    container: {
        width: "100%",
        marginTop: 24,
        gap: 16,
    },
    button: {
        width: "100%",
        paddingVertical: 12,
    },
    linesWrapper: {
        flexDirection: "row",
        gap: 8,
        marginTop: 24,
    },
    line: {
        width: 32,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.secondary50,
    },
    activeLine: {
        width: 32,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.secondary500,
    },
});

export default EmailForm;
