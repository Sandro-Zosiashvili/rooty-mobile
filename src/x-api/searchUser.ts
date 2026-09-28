import {GET} from "@/x-api/api";

export interface PublicUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    subject: "HISTORY" | "MATH" | null;
    school: string | null;
}

export const searchUser = async (username: string): Promise<PublicUser | null> => {
    const res = await GET<PublicUser | null>("/users/search", {username});
    if (!res.ok || !res.data?.id) return null;
    return res.data;
};
