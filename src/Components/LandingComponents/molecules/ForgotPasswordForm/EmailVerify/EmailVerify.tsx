import {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import LoginRegisterWrapper from "@/Components/LandingComponents/atoms/LoginRegisterWrapper/LoginRegisterWrapper";
import KentseroLogo from "@/Components/LandingComponents/atoms/KentseroLogo/KentseroLogo";
import DescriptionTexts from "@/Components/LandingComponents/atoms/DescriptionTexts/DescriptionTexts";
import CodeInput from "@/Components/LandingComponents/atoms/CodeInput/CodeInput";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import {POST} from "@/x-api/api";
import {toast} from "@/Components/LandingComponents/atoms/ToastProvider/registerToast";
import SuccessModal from "@/Components/LandingComponents/molecules/ForgotPasswordForm/SuccessModal/SuccessModal";
import {flowStorage} from "@/Storage/flowStorage";
import {colors} from "@/styles/colors";

const EmailVerify = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const email = flowStorage.getItem("registerEmail");
        if (!email) router.replace("/register");
    }, []);

    const handleSubmit = async () => {
        if (loading) return;
        setError("");
        const email = flowStorage.getItem("registerEmail");
        if (!email) {
            router.replace("/register");
            return;
        }

        setLoading(true);
        const res = await POST("/auth/verify-registration", {email, otp: code});
        if (res.ok) {
            flowStorage.removeItem("registerEmail");
            setSuccess(true);
            setLoading(false);
            return;
        }
        if (res.fields) {
            setError(Object.values(res.fields)[0] ?? res.message);
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    const handleResend = async () => {
        const email = flowStorage.getItem("registerEmail");
        if (!email) return;
        setError("");
        const res = await POST("/auth/resend-registration-otp", {email});
        if (res.ok) {
            toast.success("კოდი გამოგზავნილია!");
            return;
        }
        if (res.fields?.identifier) {
            toast.error("ბევრი მოთხოვნა, სცადეთ 1 წუთში");
            return;
        }
        toast.error(res.message);
    };

    return (
        <>
            <LoginRegisterWrapper>
                <View style={styles.inner}>
                    <KentseroLogo/>
                    <Text style={styles.title}>შეიყვანე ვერიფიკაციის კოდი</Text>
                    <DescriptionTexts style={styles.description}>
                        შეიყვანე მითითებულ ელ.ფოსტაზე გამოგზავნილი კოდი
                    </DescriptionTexts>
                    <View style={styles.form}>
                        <CodeInput value={code} onChange={setCode} error={error}/>
                        <Text style={styles.codeRefresh} onPress={handleResend}>
                            კოდის თავიდან გამოგზავნა
                        </Text>
                        <Button variant="primary" onClick={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
                            გაგრძელება
                        </Button>
                    </View>
                </View>
            </LoginRegisterWrapper>

            <SuccessModal
                isOpen={success}
                forRegister
                title="დაწყება"
                onClose={() => router.replace("/login")}
            />
        </>
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
    codeRefresh: {
        color: colors.secondary400,
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 24,
        textAlign: "center",
    },
    button: {
        width: "100%",
        paddingVertical: 12,
    },
});

export default EmailVerify;
