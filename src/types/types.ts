export type RegisterFormType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
};

export type School = {
    id: number;
    schoolName: string;
    regionName: string;
    districtName: string;
    schoolType: string;
};

export type SchoolsResponse = {
    items: School[];
    total: number;
    page: number;
    hasMore: boolean;
};
