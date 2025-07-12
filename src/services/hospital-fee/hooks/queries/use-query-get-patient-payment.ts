import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { GetPatientPaymentsResponse, hospitalFeeApis } from "../../infras";

const transformData = (response: IBaseApiResponse<GetPatientPaymentsResponse>): GetPatientPaymentsResponse => {
    return response.Data || ({} as GetPatientPaymentsResponse);
};

export const useQueryGetPatientPayment = (patientId?: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<GetPatientPaymentsResponse>>({
        queryKey: [QueryKey.HOSPITAL_FEE.GET_PATIENT_PAYMENT_LIST, patientId],
        queryFn: () => hospitalFeeApis.getPatientPayment(patientId),
        enabled: !!patientId,
    });

    const patientPaymentList = React.useMemo(() => {
        if (isError || isLoading || !data) return {} as GetPatientPaymentsResponse;
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: { patientPaymentList }, isLoading, isError, refetch };
};
