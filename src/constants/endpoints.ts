const authEndpointPrefix = "/authentication";

const authEndpoints = {
    login: `${authEndpointPrefix}/login`,
    logout: `${authEndpointPrefix}/logout`,
    currentUser: `${authEndpointPrefix}/current-user`,
    refreshToken: `${authEndpointPrefix}/login/refresh-token`,
};

const publicEndpoints = {
    getAllProvinces: "/provinces/getAll?limit=-1",
    getDistrictsByProvince: (provinceCode: string) => `/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`,
    getWardsByDistrict: (districtCode: string) => `/wards/getByDistrict?districtCode=${districtCode}&limit=-1`,
};

export const endpoints = { authEndpoints, publicEndpoints };
