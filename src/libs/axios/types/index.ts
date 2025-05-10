import { HttpMethod } from "../../../constants/enums";

export type TApiMethod = HttpMethod.GET | HttpMethod.POST | HttpMethod.PUT | HttpMethod.DELETE | HttpMethod.PATCH;

export interface IBaseApiRequest {
    url: string;
    method: TApiMethod;
}

export interface IApiRequestWithBody extends IBaseApiRequest {
    method: HttpMethod.POST | HttpMethod.PUT | HttpMethod.PATCH;
    data: IApiRequestBody;
}

export interface IApiRequestWithoutBody extends IBaseApiRequest {
    method: HttpMethod.GET | HttpMethod.DELETE;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>;
}

export type TApiRequest = IApiRequestWithBody | IApiRequestWithoutBody;

export interface IBaseApiResponse<T> {
    statusCode: number;
    message: string | string[];
    data: T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
export interface IApiRequestBody extends Record<string, any> {}
