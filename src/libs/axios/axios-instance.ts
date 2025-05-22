import axios from "axios";
import { appConfig } from "~/configs/config";

export const axiosInstance = axios.create({
    baseURL: appConfig.baseUrl,
});

axiosInstance.interceptors.request.use(async (config) => {
    // config.withCredentials = true;
    return config;
});
