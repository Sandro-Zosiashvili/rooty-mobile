import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import LoginRegisterWrapper from "@/Components/LandingComponents/atoms/LoginRegisterWrapper/LoginRegisterWrapper";
import LoginHeader from "@/Components/LandingComponents/molecules/LoginContent/LoginHeader/LoginHeader";
import Input from "@/Components/LandingComponents/atoms/Input/Input";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import {ERRORS} from "@/Validations/errors";
import {RegisterFormType} from "@/types/types";
import {useSubmit} from "@/x-api-hooks/useSubmit";
import {useGeoInput} from "@/Translator/useGeoInput";
import {flowStorage} from "@/Storage/flowStorage";
import {colors} from "@/styles/colors";

const RegisterContent = () => {
    const [remember, setRemember] = useState(false);
    const {control, handleSubmit, getValues, setValue, setError, formState: {errors}} = useForm<RegisterFormType>();
    const {submit, loading} = useSubmit<RegisterFormType>("/auth/register", setError);
    const geoKey = useGeoInput<RegisterFormType>(setValue);

    const onSubmit = (data: RegisterFormType) =>
        submit(data, () => {
            flowStorage.setItem("registerEmail", data.email);
            router.push("/register/verify-email");
        });

    return (
        <LoginRegisterWrapper>
            <LoginHeader/>
            <View style={styles.form}>
                <View style={styles.nameSurname}>
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{required: ERRORS.FIRST_NAME_IS_REQUIRED}}
                        render={({field: {value, onChange, onBlur}}) => (
                            <Input
                                style={styles.half}
                                type="text"
                                placeholder="სახელი"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                onKeyPress={geoKey("firstName")}
                                error={errors.firstName?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{required: ERRORS.LAST_NAME_IS_REQUIRED}}
                        render={({field: {value, onChange, onBlur}}) => (
                            <Input
                                style={styles.half}
                                type="text"
                                placeholder="გვარი"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                onKeyPress={geoKey("lastName")}
                                error={errors.lastName?.message}
                            />
                        )}
                    />
                </View>

                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: ERRORS.EMAIL_IS_REQUIRED,
                        pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: ERRORS.EMAIL_INVALID},
                    }}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            style={styles.input}
                            type="email"
                            placeholder="ელ.ფოსტა"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="username"
                    rules={{required: ERRORS.USERNAME_IS_REQUIRED}}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            style={styles.input}
                            type="text"
                            placeholder="მომხმარებლის სახელი"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.username?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: ERRORS.PASSWORD_IS_REQUIRED,
                        minLength: {value: 8, message: ERRORS.PASSWORD_MIN_LENGTH},
                        maxLength: {value: 72, message: ERRORS.PASSWORD_MAX_LENGTH},
                        pattern: {value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: ERRORS.PASSWORD_PATTERN},
                    }}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            style={styles.input}
                            type="password"
                            placeholder="პაროლი"
                            warning={ERRORS.PASSWORD_WARNING}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.password?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: ERRORS.CONFIRM_PASSWORD_IS_REQUIRED,
                        validate: (v) => v === getValues("password") || ERRORS.PASSWORDS_DONT_MATCH,
                    }}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            style={styles.input}
                            type="password"
                            placeholder="გაიმეორე პაროლი"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.confirmPassword?.message}
                        />
                    )}
                />

                <Pressable style={styles.checkBoxWrapper} onPress={() => setRemember((p) => !p)}>
                    <View style={[styles.checkBox, remember && styles.checkBoxChecked]}>
                        {remember ? <View style={styles.checkBoxInner}/> : null}
                    </View>
                    <Text style={styles.label}>დამიმახსოვრე</Text>
                </Pressable>

                <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={loading} disabled={loading} style={styles.button}>
                    რეგისტრაცია
                </Button>
            </View>
        </LoginRegisterWrapper>
    );
};

const styles = StyleSheet.create({
    form: {
        marginTop: 24,
        gap: 16,
    },
    nameSurname: {
        flexDirection: "row",
        gap: 12,
    },
    half: {
        flex: 1,
    },
    input: {
        width: "100%",
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
    button: {
        width: "100%",
        marginTop: 8,
        paddingVertical: 12,
    },
});

export default RegisterContent;
