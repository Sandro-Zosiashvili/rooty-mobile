import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Controller, useForm} from "react-hook-form";
import LoginRegisterWrapper from "@/Components/LandingComponents/atoms/LoginRegisterWrapper/LoginRegisterWrapper";
import KentseroLogo from "@/Components/LandingComponents/atoms/KentseroLogo/KentseroLogo";
import DescriptionTexts from "@/Components/LandingComponents/atoms/DescriptionTexts/DescriptionTexts";
import Input from "@/Components/LandingComponents/atoms/Input/Input";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import {ERRORS} from "@/Validations/errors";
import {POST} from "@/x-api/api";
import SuccessModal from "@/Components/LandingComponents/molecules/ForgotPasswordForm/SuccessModal/SuccessModal";
import {flowStorage} from "@/Storage/flowStorage";
import {colors} from "@/styles/colors";

type ResetFormType = {
    newPassword: string;
    confirmPassword: string;
};

const ResetPassword = () => {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const {control, handleSubmit, getValues, setError, formState: {errors}} = useForm<ResetFormType>();

    const onSubmit = async (data: ResetFormType) => {
        const email = flowStorage.getItem("resetEmail");
        const otp = flowStorage.getItem("resetOtp");

        setLoading(true);
        const res = await POST("/auth/reset-password", {email, otp, newPassword: data.newPassword});

        if (res.ok) {
            setSuccess(true);
            return;
        }
        if (res.fields) {
            Object.entries(res.fields).forEach(([field, message]) => {
                setError(field as keyof ResetFormType, {message});
            });
        } else {
            setError("newPassword", {message: res.message});
        }
        setLoading(false);
    };

    return (
        <LoginRegisterWrapper>
            <View style={styles.inner}>
                <KentseroLogo/>
                <Text style={styles.title}>პაროლის განახლება</Text>
                <DescriptionTexts style={styles.description}>შეიყვანე ახალი პაროლი</DescriptionTexts>
                <View style={styles.form}>
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name="newPassword"
                            rules={{
                                required: ERRORS.PASSWORD_IS_REQUIRED,
                                minLength: {value: 8, message: ERRORS.PASSWORD_MIN_LENGTH},
                                maxLength: {value: 72, message: ERRORS.PASSWORD_MAX_LENGTH},
                                pattern: {value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: ERRORS.PASSWORD_PATTERN},
                            }}
                            render={({field: {value, onChange, onBlur}}) => (
                                <Input
                                    type="password"
                                    placeholder="ახალი პაროლი"
                                    warning={ERRORS.PASSWORD_WARNING}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.newPassword?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: ERRORS.CONFIRM_PASSWORD_IS_REQUIRED,
                                validate: (v) => v === getValues("newPassword") || ERRORS.PASSWORDS_DONT_MATCH,
                            }}
                            render={({field: {value, onChange, onBlur}}) => (
                                <Input
                                    type="password"
                                    placeholder="გაიმეორე პაროლი"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.confirmPassword?.message}
                                />
                            )}
                        />
                    </View>
                    <Pressable style={styles.checkBoxWrapper} onPress={() => setRemember((p) => !p)}>
                        <View style={[styles.checkBox, remember && styles.checkBoxChecked]}>
                            {remember ? <View style={styles.checkBoxInner}/> : null}
                        </View>
                        <Text style={styles.label}>დამიმახსოვრე</Text>
                    </Pressable>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={loading} disabled={loading} style={styles.button}>
                        გაგრძელება
                    </Button>
                </View>
                <View style={styles.linesWrapper}>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                    <View style={styles.activeLine}/>
                </View>
            </View>

            <SuccessModal isOpen={success} title="პაროლი განახლდა წარმატებით" forRegister={false}/>
        </LoginRegisterWrapper>
    );
};

const styles = StyleSheet.create({
    inner: {
        alignItems: "center",
    },
    title: {
        color: colors.secondary500,
        fontSize: 24,
        fontWeight: "500",
        lineHeight: 32,
        textAlign: "center",
        marginTop: 24,
    },
    description: {
        textAlign: "center",
        marginTop: 8,
    },
    form: {
        width: "100%",
        marginTop: 24,
        gap: 16,
    },
    inputWrapper: {
        gap: 16,
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

export default ResetPassword;
