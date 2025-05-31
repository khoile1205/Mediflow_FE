import { AxiosError, AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from "axios";
import { APP_STRING } from "~/constants/app.string";
import { endpoints } from "~/constants/endpoints";
import { authService } from "~/services/auth";
import { showToast } from "~/utils";
import { IBaseApiResponse } from "../types";

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface QueuedRequest<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
}

export class TokenRefresher {
    private readonly axiosInstance: AxiosInstance;
    private isRefreshing = false;
    private failedRequestsQueue: QueuedRequest<unknown>[] = [];

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    public setupInterceptor(): void {
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as RetryableAxiosRequestConfig;
                const isUnauthorizedResponse = error.response?.status === HttpStatusCode.Unauthorized;
                const isRetryable =
                    originalRequest &&
                    originalRequest._retry &&
                    error.config?.url !== endpoints.authEndpoints.refreshToken;

                if (isUnauthorizedResponse && isRetryable) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedRequestsQueue.push({ resolve, reject });
                        }).then(() => this.axiosInstance(originalRequest));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        await authService.refreshToken();
                        this.processQueue(null);
                        return this.axiosInstance(originalRequest);
                    } catch (error) {
                        const refreshError = error as AxiosError<IBaseApiResponse<unknown>>;
                        const message = refreshError.response.data.Message || APP_STRING.TOKEN_EXPIRED;

                        this.processQueue(refreshError);
                        this.redirectToLoginPage();
                        showToast.error(message);

                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            },
        );
    }

    public addFailedRequest(request: QueuedRequest<unknown>): void {
        this.failedRequestsQueue.push(request);
    }

    public processQueue(error: unknown): void {
        this.failedRequestsQueue.forEach((request) => {
            if (error) {
                request.reject(error);
            } else {
                request.resolve(null);
            }
        });
        this.failedRequestsQueue = [];
    }

    private redirectToLoginPage(): void {
        const LOGIN_PAGE_URL = "/login";
        window.location.href = LOGIN_PAGE_URL;
    }
}
