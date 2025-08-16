import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";
import { HospitalServiceType } from "~/constants/enums";

export const useQueryGetServiceTestParametersByExaminationId = (
    examinationId: number,
    serviceType: HospitalServiceType,
    enabled = true,
) => {
    return useQuery({
        queryKey: [
            QueryKey.EXAMINATION.GET_SERVICE_TEST_PARAMETERS_OF_EXAMINATION_BY_EXAMINATION_ID,
            examinationId,
            serviceType,
        ],
        queryFn: () =>
            hospitalServiceApis.getServiceTestParametersByExaminationId(examinationId, serviceType.toString()),
        enabled: !!examinationId && enabled,
    });
};
