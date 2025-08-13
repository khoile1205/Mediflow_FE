import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";
import { HospitalServiceType } from "~/constants/enums";

export const useQueryGetHospitalServices = (params: { serviceType?: HospitalServiceType }) => {
    return useQuery({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_LIST, params],
        queryFn: () => hospitalServiceApis.getAllHospitalServices(params),
        enabled: true,
    });
};
