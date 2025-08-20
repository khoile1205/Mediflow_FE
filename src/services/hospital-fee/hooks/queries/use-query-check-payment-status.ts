import { useQuery } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import React from "react";
import { PaymentStatus } from "~/constants/enums";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { CheckPaymentStatusRequest, hospitalFeeApis } from "../../infras";

const transformData = (response: IBaseApiResponse<PaymentStatus>): PaymentStatus => {
    return response.Data;
};

export const useQueryCheckPaymentStatus = (params: CheckPaymentStatusRequest) => {
    const startTimeRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        startTimeRef.current = null;
    }, [params.paymentId, params.paymentContractId]);

    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<PaymentStatus>>({
        queryKey: [QueryKey.HOSPITAL_FEE.CHECK_PAYMENT_STATUS, params],
        queryFn: () => hospitalFeeApis.checkPaymentStatus(params),
        refetchInterval: (query) => {
            const now = Date.now();
            if (!startTimeRef.current) startTimeRef.current = now;

            const elapsed = now - startTimeRef.current;
            if (elapsed >= 120_000) {
                return false;
            }

            const lastData = query.state.data;
            if (!lastData) return false;

            const isHttpOk = lastData.StatusCode === HttpStatusCode.Ok;
            const isCompleted = lastData.Data === PaymentStatus.COMPLETED;
            if (isHttpOk && isCompleted) {
                return false;
            }

            return 5000; // retry every 5s otherwise
        },
        enabled: !!params.paymentId || !!params.paymentContractId,
        gcTime: 0,
        refetchIntervalInBackground: true,
    });

    const paymentStatus = React.useMemo(() => {
        if (isError || isLoading || !data) return PaymentStatus.PENDING;
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: paymentStatus, isLoading, isError, refetch };
};
