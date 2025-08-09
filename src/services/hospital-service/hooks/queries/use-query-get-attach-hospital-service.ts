import { useQuery } from "@tanstack/react-query";
import React from "react";
import { HospitalServiceType } from "~/constants/enums";
import { QueryKey } from "~/constants/query-key";
import { Service } from "~/entities";
import { hospitalServiceApis } from "../../infras";

const transformData = (response: Service[]): Service[] => {
    return response || [];
};

export const useQueryGetAttachHospitalService = () => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<Service[]>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_LIST],
        queryFn: async () => {
            const examApiResponse = await hospitalServiceApis.getAllHospitalServices({
                serviceType: HospitalServiceType.Exam,
            });
            const injectApiResponse = await hospitalServiceApis.getAllHospitalServices({
                serviceType: HospitalServiceType.Injection,
            });
            return [...examApiResponse.Data, ...injectApiResponse.Data];
        },
        staleTime: 1000 * 60 * 5,
    });

    const attachHospitalServices = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: { attachHospitalServices },
        isError,
        isLoading,
        refetch,
    };
};
