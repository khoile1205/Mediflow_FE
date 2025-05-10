// libs/axios/request.ts
import { get, post, patch, put, delete as delete_ } from "../axios";
import { IBaseApiResponse, TApiRequest } from "../axios/types";

export const callApi = async <T>(props: TApiRequest): Promise<IBaseApiResponse<T>> => {
    const { method, url } = props;

    switch (method) {
        case "get":
            return await get<T>(url, props.params);
        case "post":
            return await post<T>(url, props.data);
        case "patch":
            return await patch<T>(url, props.data);
        case "put":
            return await put<T>(url, props.data);
        case "delete":
            return await delete_<T>(url, props.params);
        default:
            throw new Error("Unsupported HTTP method");
    }
};
