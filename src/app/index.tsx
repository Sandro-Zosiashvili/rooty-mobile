import {useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {Redirect} from "expo-router";
import {hasSession} from "@/auth/session";
import {colors} from "@/styles/colors";

// ვების proxy.ts-ში "/" → hasSession ? "/dashboard" : "/login"
export default function Index() {
    const [target, setTarget] = useState<"/dashboard" | "/login" | null>(null);

    useEffect(() => {
        hasSession().then((ok) => setTarget(ok ? "/dashboard" : "/login"));
    }, []);

    if (!target) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color={colors.secondary500}/>
            </View>
        );
    }

    return <Redirect href={target}/>;
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.pageBackground,
    },
});
