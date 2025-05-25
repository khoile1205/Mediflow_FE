import axios from "axios";

// reference: https://vapi-vnappmob.readthedocs.io/en/latest/province.html

const VN_PUBLIC_API_BASE_URL = "https://vn-public-apis.fpo.vn";

export const vnPublicApiAxios = axios.create({
    baseURL: VN_PUBLIC_API_BASE_URL,
});
