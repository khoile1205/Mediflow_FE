import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalFeeApis, HospitalServiceType, HospitalUnpaidServicesResponse } from "../../infras";
import { HospitalServiceItem } from "~/pages/hospital-fee/types";

const transformData = (response: IBaseApiResponse<HospitalUnpaidServicesResponse>): HospitalServiceItem[] => {
    const { services, vaccinations } = response.Data;

    const hospitalService: HospitalServiceItem[] = services.map((service) => ({
        id: service.id,
        requestNumber: service.requestNumber,
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        quantity: service.quantity,
        unitPrice: service.unitPrice,
        createdAt: service.createdAt,
        serviceType: HospitalServiceType.SERVICE,
    }));

    const hospitalVaccination: HospitalServiceItem[] = vaccinations.map((vaccine) => ({
        id: vaccine.id,
        requestNumber: vaccine.requestNumber,
        vaccineId: vaccine.vaccineId,
        serviceName: vaccine.vaccineName,
        quantity: vaccine.quantity,
        unitPrice: vaccine.unitPrice,
        createdAt: vaccine.createdAt,
        serviceType: HospitalServiceType.VACCINATION,
    }));

    return [...hospitalService, ...hospitalVaccination].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const useQueryGetUnpaidServiceByPatientId = (patientId?: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<HospitalUnpaidServicesResponse>>({
        queryKey: [QueryKey.HOSPITAL_FEE.GET_UNPAID_SERVICE_BY_PATIENT_ID, patientId],
        queryFn: () => hospitalFeeApis.getUnpaidServiceByPatientId(patientId),
        enabled: !!patientId,
        staleTime: 0,
    });

    const patientPaymentList = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: { patientPaymentList }, isLoading, isError, refetch };
};
