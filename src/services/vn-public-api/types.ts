export type TVnPublicApiResponse = {
    data: {
        nItems: number;
        data: TAdministrativeUnit[];
        nPages: number;
    };
    exitcode: number;
    message: string;
};

export type TAdministrativeUnit = {
    name: string;
    code: string;
    name_with_type: string;
};
