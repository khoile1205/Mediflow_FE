import axios, { AxiosError } from "axios";
import { IBaseApiResponse } from "../types";
import i18n from "~/configs/i18n";

export const getAxiosErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<IBaseApiResponse<unknown>>;
        if (!axiosError.response) {
            return i18n.translationKey.somethingWentWrong;
        }
        return axiosError.response.data.Message;
    }
    return (error as Error).message;
};
