import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";

export const useQueryGetServiceTestParametersByExaminationId = (examinationId: number, enabled = true) => {
    return useQuery({
        queryKey: [QueryKey.EXAMINATION.GET_SERVICE_TEST_PARAMETERS_OF_EXAMINATION_BY_EXAMINATION_ID, examinationId],
        queryFn: () => hospitalServiceApis.getServiceTestParametersByExaminationId(examinationId),
        enabled: !!examinationId && enabled,
    });
};
