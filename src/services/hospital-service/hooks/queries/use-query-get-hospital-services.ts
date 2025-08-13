import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";

export const useQueryGetHospitalServices = () => {
    return useQuery({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_LIST],
        queryFn: () => hospitalServiceApis.getAllHospitalServices(),
        enabled: true,
    });
};
