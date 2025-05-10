import { axiosInstance } from "./axios-instance";
import { IBaseApiResponse, IApiRequestBody } from "./types";

export default async <T>(url: string, body?: IApiRequestBody): Promise<IBaseApiResponse<T>> => {
    const response = await axiosInstance.delete<IBaseApiResponse<T>>(url, body);
    return response.data;
};
