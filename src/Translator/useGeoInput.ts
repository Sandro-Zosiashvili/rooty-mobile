import {UseFormSetValue, FieldValues, Path} from "react-hook-form";

/**
 * ვებში ეს hook ლათინურ კლავიშებს ქართულ ასოებად თარგმნიდა (physical keyboard,
 * e.code-ზე დაყრდნობით). მობაილზე ვირტუალური კლავიატურა თავად აწვდის ქართულ
 * სიმბოლოებს, ამიტომ code-ზე დაფუძნებული map აქ არ მუშაობს.
 *
 * არქიტექტურის შესანარჩუნებლად იგივე ხელმოწერა რჩება: useGeoInput(setValue)("field")
 * აბრუნებს onKeyPress-ის handler-ს. ნატიურ input-ზე ის უბრალოდ არაფერს აკეთებს
 * (native keyboard-ს ვენდობით). ფაილი განზრახ დარჩა ვების ვერსიის ანალოგიით.
 */
export const useGeoInput = <T extends FieldValues>(_setValue: UseFormSetValue<T>) => {
    return (_field: Path<T>) =>
        () => {
            // no-op: მობაილის კლავიატურა ქართულს პირდაპირ იძლევა
        };
};
