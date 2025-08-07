import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalServiceApis } from "../../infras";
import { UpdateHospitalServiceGroupRequest } from "../../infras/types";
import { HospitalServiceGroup } from "~/pages/hospital-services/types";

export const useMutationUpdateHospitalServiceGroup = () =>
    useMutation<IBaseApiResponse<HospitalServiceGroup>, Error, UpdateHospitalServiceGroupRequest>({
        mutationKey: [QueryKey.HOSPITAL_SERVICE.UPDATE_HOSPITAL_SERVICE_GROUP],
        mutationFn: (data) => hospitalServiceApis.updateHospitalServiceGroup(data),
    });
