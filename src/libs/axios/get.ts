import { axiosInstance } from "./axios-instance";
import { IBaseApiResponse } from "./types";

export default async <T>(url: string, query?: Record<string, any>): Promise<IBaseApiResponse<T>> => {
    const response = await axiosInstance.get<IBaseApiResponse<T>>(url, {
        params: query,
    });
    return response.data;
};
