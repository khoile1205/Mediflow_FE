import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";
import { IBaseApiResponse } from "~/libs/axios/types";
import { Service } from "~/entities";

export const useQueryServicesByIds = (ids: number[]) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<Service[]>>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_SERVICES_BY_IDS, ids],
        queryFn: () => hospitalServiceApis.getServicesByIds(ids),
        staleTime: 1000 * 60 * 5,
        enabled: ids.length > 0,
    });

    const services = response?.Data ?? [];

    return {
        data: { services },
        isLoading,
        isError,
        refetch,
    };
};
