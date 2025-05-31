export type TLoginRequest = {
    userName: string;
    password: string;
};

export type TLoginResponse = {
    isSuccess: boolean;
    message: string;
};

export type RefreshTokenRequest = {
    refreshToken: string;
};

export type RefreshTokenResponse = {
    IsSuccess: boolean;
    Message: string;
};
