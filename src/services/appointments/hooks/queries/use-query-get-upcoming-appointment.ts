import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { AppointmentSummary } from "~/entities/appointment.entity";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { appointmentApis, IAppointmentFilter } from "../../infras";

const transformData = (response: IBaseApiResponse<IPagination<AppointmentSummary>>) => {
    return response.Data.data.map((item) => ({ ...item })) as AppointmentSummary[];
};

export const useQueryGetUpcomingAppointments = (params: IPaginationRequest & IAppointmentFilter) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<AppointmentSummary>>>({
        queryKey: [QueryKey.APPOINTMENT.GET_UPCOMING_APPOINTMENTS, params],
        queryFn: async () => {
            const response = await appointmentApis.getUpcomingAppointments({
                ...params,
                timeOfDay: params.timeOfDay != null ? params.timeOfDay : undefined,
            });
            return response;
        },
        enabled: true,
    });

    const listAppointments = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { listAppointments, totalItems },
        isError,
        isLoading,
        refetch,
    };
};
