import {useCallback, useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {registerToast} from "./registerToast";
import ToastCard, {ToastItem} from "@/Components/LandingComponents/atoms/ToastProvider/ToastProvider";

const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const remove = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        registerToast((message, type) => {
            setToasts((prev) => [...prev, {id: Date.now(), message, type}]);
        });
    }, []);

    return (
        <View style={styles.container} pointerEvents="box-none">
            {toasts.map((t) => (
                <ToastCard key={t.id} toast={t} onRemove={remove}/>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 16,
        left: 12,
        right: 12,
        zIndex: 9999,
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
});

export default ToastContainer;
