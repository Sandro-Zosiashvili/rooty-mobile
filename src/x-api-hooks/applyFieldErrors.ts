import {UseFormSetError, FieldValues, Path} from "react-hook-form";

export function applyFieldErrors<T extends FieldValues>(
    fields: Record<string, string> | undefined,
    setError: UseFormSetError<T>
) {
    if (!fields) return;
    Object.entries(fields).forEach(([field, message]) => {
        setError(field as Path<T>, {message});
    });
}
