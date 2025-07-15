export interface StaffFormValues {
    id?: number;
    code: string;
    name: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    address: string;
    profilePictureUrl?: string;
    roleNames: string[];
    departmentIds: number[];
    isSuspended: boolean;
}
