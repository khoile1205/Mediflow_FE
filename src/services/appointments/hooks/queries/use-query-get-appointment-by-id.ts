import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Appointment } from "~/entities/appointment.entity";
import { IBaseApiResponse } from "~/libs/axios/types";
import { appointmentApis } from "../../infras";

export const useQueryGetAppointmentById = (appointmentId: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<Appointment>>({
        queryKey: [QueryKey.APPOINTMENT.GET_APPOINTMENT_BY_ID, appointmentId],
        queryFn: async () => {
            const response = await appointmentApis.getAppointmentById(appointmentId);
            return response;
        },
        enabled: !!appointmentId,
    });

    const appointment = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return data.Data;
    }, [isError, isLoading, data]);

    return {
        data: { appointment },
        isLoading,
        isError,
        refetch,
    };
};
