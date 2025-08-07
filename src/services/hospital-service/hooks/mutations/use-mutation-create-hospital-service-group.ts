import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalServiceApis } from "../../infras";
import { CreateHospitalServiceGroupRequest } from "../../infras/types";
import { HospitalServiceGroup } from "~/pages/hospital-services/types";

export const useMutationCreateHospitalServiceGroup = () =>
    useMutation<IBaseApiResponse<HospitalServiceGroup>, Error, CreateHospitalServiceGroupRequest>({
        mutationKey: [QueryKey.HOSPITAL_SERVICE.CREATE_HOSPITAL_SERVICE_GROUP],
        mutationFn: (data) => hospitalServiceApis.createHospitalServiceGroup(data),
    });
