import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { postVaccinationApis } from "../../infras/post-vaccination.api";
import { PostVaccinationMedicine } from "../../infras/types";

const transformData = (response: IBaseApiResponse<PostVaccinationMedicine[]>): PostVaccinationMedicine[] => {
    return response.Data;
};

export const useQueryPostVaccinationMedicines = (vaccinationId?: number) => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<PostVaccinationMedicine[]>>({
        queryKey: [QueryKey.POST_VACCINATION.GET_MEDICINE_LIST, vaccinationId],
        queryFn: () => postVaccinationApis.getPostVaccinationMedicines(vaccinationId!),
        enabled: !!vaccinationId,
    });

    const medicines = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return {
        medicines,
        isLoading,
        isError,
    };
};
