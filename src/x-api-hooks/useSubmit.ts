import {useState} from "react";
import {UseFormSetError, FieldValues} from "react-hook-form";
import {POST, ApiResult} from "@/x-api/api";
import {applyFieldErrors} from "@/x-api-hooks/applyFieldErrors";

export function useSubmit<T extends FieldValues>(
    url: string,
    setError: UseFormSetError<T>
) {
    const [loading, setLoading] = useState(false);

    const submit = async (
        data: T,
        onSuccess?: (res: Extract<ApiResult<unknown>, {ok: true}>) => void
    ) => {
        setLoading(true);
        const res = await POST<T>(url, data);

        if (res.ok) {
            onSuccess?.(res);
            setLoading(false);
            return;
        }

        applyFieldErrors(res.fields, setError);   // ← ერორები აქ მუშავდება
        setLoading(false);
    };

    return {submit, loading};
}
