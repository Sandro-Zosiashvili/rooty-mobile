import {useEffect} from "react";
import {StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import LoginRegisterWrapper from "@/Components/LandingComponents/atoms/LoginRegisterWrapper/LoginRegisterWrapper";
import KentseroLogo from "@/Components/LandingComponents/atoms/KentseroLogo/KentseroLogo";
import DescriptionTexts from "@/Components/LandingComponents/atoms/DescriptionTexts/DescriptionTexts";
import Input from "@/Components/LandingComponents/atoms/Input/Input";
import Button from "@/Components/LandingComponents/atoms/Button/Button";
import {useSubmit} from "@/x-api-hooks/useSubmit";
import {flowStorage} from "@/Storage/flowStorage";
import {colors} from "@/styles/colors";
import {fonts} from "@/fonts/fonts";

type UsernameType = {
    username: string;
    token?: string;
};

const ChooseUsername = () => {
    const {control, handleSubmit, setError, formState: {errors}} = useForm<UsernameType>();
    const {submit, loading} = useSubmit<UsernameType>("/auth/google/complete", setError);

    useEffect(() => {
        const token = flowStorage.getItem("googleToken");
        if (!token) router.replace("/login");
    }, []);

    const onSubmit = (data: UsernameType) => {
        const token = flowStorage.getItem("googleToken");
        if (!token) {
            router.replace("/login");
            return;
        }
        submit({...data, token}, () => {
            flowStorage.removeItem("googleToken");
            router.replace("/dashboard");
        });
    };

    return (
        <LoginRegisterWrapper>
            <KentseroLogo/>
            <Text style={styles.title}>აირჩიე მომხმარებლის სახელი</Text>
            <DescriptionTexts style={styles.description}>შენი უნიკალური სახელი პლატფორმაზე</DescriptionTexts>
            <View style={styles.form}>
                <Controller
                    control={control}
                    name="username"
                    rules={{required: "მომხმარებლის სახელი სავალდებულოა"}}
                    render={({field: {value, onChange, onBlur}}) => (
                        <Input
                            type="text"
                            placeholder="შეიყვანე სახელი"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.username?.message}
                        />
                    )}
                />
                <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={loading} disabled={loading} style={styles.button}>
                    რეგისტრაცია
                </Button>
            </View>
        </LoginRegisterWrapper>
    );
};

const styles = StyleSheet.create({
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
        marginTop: 24,
        gap: 16,
    },
    button: {
        width: "100%",
        paddingVertical: 12,
    },
});

export default ChooseUsername;
