export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    examYear: number;
    isBlocked: boolean;
    subject: "HISTORY" | "MATH";
    studyPace: "STANDARD" | "INTENSIVE" | "RELAXED";
    schoolId: number;
    schoolNameRaw: string | null;
    onboardingCompleted: boolean;
    isEmailVerified: boolean;
}
