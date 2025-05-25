import { endpoints } from "~/constants/endpoints";
import { vnPublicApiAxios } from "~/libs/axios/public-api/vn.axios-instance";
import { TVnPublicApiResponse } from "./types";

const getAllProvinces = async () => {
    const response = await vnPublicApiAxios.get<TVnPublicApiResponse>(endpoints.publicEndpoints.getAllProvinces);
    return response.data;
};

const getDistrictsByProvince = async (provinceCode: string) => {
    const response = await vnPublicApiAxios.get<TVnPublicApiResponse>(
        `${endpoints.publicEndpoints.getDistrictsByProvince(provinceCode)}`,
    );
    return response.data;
};

const getWardsByDistrict = async (districtCode: string) => {
    const response = await vnPublicApiAxios.get<TVnPublicApiResponse>(
        `${endpoints.publicEndpoints.getWardsByDistrict(districtCode)}`,
    );
    return response.data;
};

export { getAllProvinces, getDistrictsByProvince, getWardsByDistrict };
