import { endpoints } from "~/constants/endpoints";
import { vnPublicApiAxios } from "~/libs/axios/public-api/vn.axios-instance";
import { TDistrict, TOApiProvinceResponse, TProvince, TWard } from "./types";

const queryParams = {
    page: 0,
    size: 999,
};

const getAllProvinces = async () => {
    const response = await vnPublicApiAxios.get<TOApiProvinceResponse<TProvince>>(endpoints.publicApi.getAllProvinces, {
        params: queryParams,
    });

    const provinces =
        response.data?.data.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            normalizedName: `${item.typeText} ${item.name}`,
            typeText: item.typeText,
            slug: item.slug,
        })) || [];

    return provinces;
};

const getDistrictsByProvince = async (provinceId: string): Promise<TDistrict[]> => {
    const response = await vnPublicApiAxios.get<TOApiProvinceResponse<TDistrict>>(
        `${endpoints.publicApi.getDistrictsByProvince(provinceId)}`,
    );

    return (
        response.data?.data.map((item) => ({
            ...item,
            normalizedName: `${item.typeText} ${item.name}`,
        })) || []
    );
};

const getWardsByDistrict = async (districtId: string): Promise<TWard[]> => {
    const response = await vnPublicApiAxios.get<TOApiProvinceResponse<TWard>>(
        `${endpoints.publicApi.getWardsByDistrict(districtId)}`,
    );

    return (
        response.data?.data.map((item) => ({
            ...item,
            normalizedName: `${item.typeText} ${item.name}`,
        })) || []
    );
};

export { getAllProvinces, getDistrictsByProvince, getWardsByDistrict };
