export const publicApiEndpoints = {
    getAllProvinces: "/provinces/getAll?limit=-1",
    getDistrictsByProvince: (provinceCode: string) => `/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`,
    getWardsByDistrict: (districtCode: string) => `/wards/getByDistrict?districtCode=${districtCode}&limit=-1`,
};
