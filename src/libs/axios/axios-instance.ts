import axios from "axios";
import { appConfig } from "~/configs/config";
import { TokenRefresher } from "./handler/token.refresher";

export const axiosInstance = axios.create({
    baseURL: appConfig.baseUrl,
    withCredentials: true,
});

const tokenRefresher = new TokenRefresher(axiosInstance);
tokenRefresher.setupInterceptor();
