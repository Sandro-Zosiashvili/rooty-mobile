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
import {flowStorage} from "@/Storage/flowStorage";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

const OtpForm = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const email = flowStorage.getItem("resetEmail");
        if (!email) router.replace("/forgot-password");
    }, []);

    const handleSubmit = async () => {
        if (loading) return;
        setError("");
        const email = flowStorage.getItem("resetEmail");
        if (!email) {
            router.replace("/forgot-password");
            return;
        }

        setLoading(true);
        const res = await POST("/auth/verify-otp", {email, otp: code});
        if (res.ok) {
            flowStorage.setItem("resetOtp", code);
            router.push("/forgot-password/reset-password");
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
        const email = flowStorage.getItem("resetEmail");
        if (!email) return;
        setError("");
        const res = await POST("/auth/forgot-password", {email});
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
                <View style={styles.linesWrapper}>
                    <View style={styles.line}/>
                    <View style={styles.activeLine}/>
                    <View style={styles.line}/>
                </View>
            </View>
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
        fontFamily: fonts.futura(),
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
        fontFamily: fonts.mersad(700),
        lineHeight: 24,
        textAlign: "center",
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

export default OtpForm;
