export type TOApiProvinceResponse<T> = {
    code: "success";
    message: null;
    total: 63;
    data: T[];
};

export type TProvince = {
    id: string;
    name: string;
    type: number;
    normalizedName: string;
    typeText: string;
    slug: string;
};

export type TDistrict = {
    id: string;
    name: string;
    provinceId: string;
    normalizedName: string;
    type: number;
    typeText: string;
};

export type TWard = {
    id: string;
    name: string;
    districtId: string;
    normalizedName: string;
    type: number;
    typeText: string;
};
