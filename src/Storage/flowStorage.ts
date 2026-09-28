/**
 * ვების auth ნაკადებში ნაბიჯებს შორის მონაცემი (registerEmail, resetEmail,
 * resetOtp, googleToken) sessionStorage-ით გადადიოდა. მობაილს sessionStorage
 * არ აქვს, ამიტომ ეს არის მისი მინიმალური ეკვივალენტი — მეხსიერებაში მცხოვრები
 * ephemeral საცავი, იგივე getItem/setItem/removeItem API-ით, რომ კომპონენტების
 * კოდი ვების ვერსიასთან თითქმის იდენტური დარჩეს.
 */
const store = new Map<string, string>();

export const flowStorage = {
    getItem(key: string): string | null {
        return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string): void {
        store.set(key, value);
    },
    removeItem(key: string): void {
        store.delete(key);
    },
    clear(): void {
        store.clear();
    },
};
