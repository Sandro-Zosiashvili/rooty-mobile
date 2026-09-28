import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import Input from "@/Components/LandingComponents/atoms/Input/Input";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import SignupPrompt from "@/Components/LandingComponents/molecules/LoginContent/SignupPrompt/SignupPrompt";
import {ERRORS} from "@/Validations/errors";
import {useSubmit} from "@/x-api-hooks/useSubmit";
import {colors} from "@/styles/colors";

type LoginType = {
    identifier: string;
    password: string;
};

const LoginForm = () => {
    const [remember, setRemember] = useState(false);
    const {control, handleSubmit, setError, formState: {errors}} = useForm<LoginType>();
    const {submit, loading} = useSubmit<LoginType>("/auth/login", setError);

    const onSubmit = (data: LoginType) =>
        submit(data, () => router.replace("/dashboard"));

    return (
        <View style={styles.form}>
            <View style={styles.forms}>
                <Controller
                    control={control}
                    name="identifier"
                    rules={{required: ERRORS.EMAIL_OR_NAME_IS_REQUIRED}}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            type="text"
                            placeholder="ელ.ფოსტა"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.identifier?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    rules={{required: ERRORS.PASSWORD_IS_REQUIRED}}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            type="password"
                            placeholder="პაროლი"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.password?.message}
                        />
                    )}
                />
            </View>

            <View style={styles.description}>
                <Pressable style={styles.checkBoxWrapper} onPress={() => setRemember((p) => !p)}>
                    <View style={[styles.checkBox, remember && styles.checkBoxChecked]}>
                        {remember ? <View style={styles.checkBoxInner}/> : null}
                    </View>
                    <Text style={styles.label}>დამიმახსოვრე</Text>
                </Pressable>
                <Text style={styles.forgotPassword} onPress={() => router.push("/forgot-password")}>
                    დაგავიწყდა პაროლი?
                </Text>
            </View>

            <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={loading} disabled={loading} style={styles.button}>
                ავტორიზაცია
            </Button>

            <SignupPrompt/>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        marginTop: 24,
    },
    forms: {
        flexDirection: "column",
        gap: 16,
    },
    description: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 24,
    },
    checkBoxWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.primary700,
        alignItems: "center",
        justifyContent: "center",
    },
    checkBoxChecked: {
        borderColor: colors.primary800,
    },
    checkBoxInner: {
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: colors.secondary500,
    },
    label: {
        color: colors.primary800,
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 24,
    },
    forgotPassword: {
        color: colors.secondary400,
        textAlign: "right",
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 24,
    },
    button: {
        width: "100%",
        marginTop: 32,
        paddingVertical: 12,
    },
});

export default LoginForm;
