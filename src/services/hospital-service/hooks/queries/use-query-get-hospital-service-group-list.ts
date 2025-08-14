import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";

interface GetHospitalServiceGroupListParams {
    pageIndex: number;
    pageSize: number;
    searchTerm?: string;
}

export const useQueryGetHospitalServiceGroupList = (params: GetHospitalServiceGroupListParams) => {
    return useQuery({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_GROUP_LIST_WITH_PAGINATION, params],
        queryFn: () => hospitalServiceApis.getHospitalServiceGroupListWithPagination(params),
        enabled: !!params,
    });
};
