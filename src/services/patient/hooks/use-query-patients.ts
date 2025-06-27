import { useQuery } from "@tanstack/react-query";
import { patientApi } from "../infras/patient.api";
import { GetPatientWithPaginationRequest } from "../infras/types";
import { Patient } from "~/entities/person-info.entity";
import { IBaseApiResponse, IPagination } from "~/libs/axios/types";
import { QueryKey } from "~/constants/query-key";
import React from "react";

const transformData = (response: IBaseApiResponse<IPagination<Patient>>) => {
    return response.Data.data.map((item) => ({ ...item })) as Patient[];
};

export const useQueryPatients = ({
    isEnabled,
    query,
}: {
    isEnabled: boolean;
    query: GetPatientWithPaginationRequest;
}) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<Patient>>>({
        queryKey: [QueryKey.PATIENT.GET_LIST_PATIENT_WITH_PAGINATION, query],
        queryFn: async () => {
            const patientApiResponse = await patientApi.getListPatientWithPagination({
                pageIndex: query.pageIndex,
                pageSize: query.pageSize,
                patientCode: query.patientCode.trim(),
                patientName: query.patientName.trim(),
                patientPhoneNumber: query.patientPhoneNumber.trim(),
            });
            return patientApiResponse;
        },
        enabled: isEnabled,
        staleTime: 1000 * 60 * 1,
    });

    const listPatients = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const pageSize = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.pageSize;
    }, [isError, isLoading, response]);

    const pageIndex = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.pageIndex;
    }, [isError, isLoading, response]);

    return {
        data: { listPatients, pageSize, pageIndex },
        isError,
        isLoading,
        refetch,
    };
};
