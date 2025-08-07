import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis, ISearchParam } from "../../infras";
import { ServiceGroup } from "~/entities";
import { PaginationResponse } from "~/pages/hospital-services/types";

interface UseQueryResult {
    data: {
        serviceGroups: ServiceGroup[];
        totalItems: number;
        pageIndex: number;
        pageSize: number;
    };
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

export const useQueryHospitalServiceGroupWithPagination = (
    query: ISearchParam = { searchTerm: "", pageIndex: 1, pageSize: 10 },
): UseQueryResult => {
    const { data, isLoading, isError, refetch } = useQuery<PaginationResponse<ServiceGroup>>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_GROUP_LIST_WITH_PAGINATION, query],
        queryFn: () => hospitalServiceApis.getHospitalServiceGroupListWithPagination(query),
        staleTime: 1000 * 60 * 5,
    });

    return {
        data: {
            serviceGroups: data?.Data ?? [],
            totalItems: data?.TotalItems ?? 0,
            pageIndex: data?.PageIndex ?? query.pageIndex ?? 1,
            pageSize: data?.PageSize ?? query.pageSize ?? 10,
        },
        isLoading,
        isError,
        refetch,
    };
};
