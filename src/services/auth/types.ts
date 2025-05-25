export type TLoginRequest = {
    userName: string;
    password: string;
};

export type TLoginResponse = {
    isSuccess: boolean;
    message: string;
};
