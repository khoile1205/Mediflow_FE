import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import {
    GetMedicineListForVaccinationByReceptionIdResponse,
    MedicineVaccinationInformation,
    vaccinationApis,
} from "../../infras";

const getDoctorPrescribedVaccines = (
    response: IBaseApiResponse<GetMedicineListForVaccinationByReceptionIdResponse>,
): MedicineVaccinationInformation[] => {
    return response.Data.doctorPrescribedVaccines || [];
};

const getCustomerWarehouseVaccines = (
    response: IBaseApiResponse<GetMedicineListForVaccinationByReceptionIdResponse>,
): MedicineVaccinationInformation[] => {
    return response.Data.customerWarehouseVaccines || [];
};

export const useQueryGetMedicineVaccinationByReceptionId = (receptionId?: number) => {
    const { data, isLoading, isError, refetch } = useQuery<
        IBaseApiResponse<GetMedicineListForVaccinationByReceptionIdResponse>
    >({
        queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID, receptionId],
        queryFn: () => vaccinationApis.getMedicineVaccinationByReceptionId(receptionId),
        enabled: !!receptionId,
    });

    const doctorPrescribedVaccines = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return getDoctorPrescribedVaccines(data);
    }, [isError, isLoading, data]);

    const customerWarehouseVaccines = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return getCustomerWarehouseVaccines(data);
    }, [isError, isLoading, data]);

    return { data: { doctorPrescribedVaccines, customerWarehouseVaccines }, isLoading, isError, refetch };
};
