export const publicApiEndpoints = {
    getAllProvinces: "/provinces",
    getDistrictsByProvince: (provinceId: string) => `/districts/${provinceId}`,
    getWardsByDistrict: (districtId: string) => `/wards/${districtId}`,
};
