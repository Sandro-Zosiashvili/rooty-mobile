type ToastType = "success" | "error";

let addToast: ((message: string, type: ToastType) => void) | null = null;

export const registerToast = (fn: (message: string, type: ToastType) => void) => {
    addToast = fn;
};

export const toast = {
    success: (message: string) => addToast?.(message, "success"),
    error: (message: string) => addToast?.(message, "error"),
};
