import { endpoints } from "~/constants/endpoints";
import { Appointment, AppointmentSummary } from "~/entities/appointment.entity";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { IAppointmentFilter } from "./types";

const getUpcomingAppointments = async ({ pageIndex, pageSize, ...filter }: IPaginationRequest & IAppointmentFilter) => {
    return await callApi<IPagination<AppointmentSummary>>({
        url: endpoints.appointment.getUpcomingAppointments,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
            ...filter,
        },
    });
};

const getAppointmentById = async (id: number) => {
    return await callApi<Appointment>({
        url: endpoints.appointment.getAppointmentById(id),
        method: HttpMethod.GET,
    });
};

export const appointmentApis = {
    getUpcomingAppointments,
    getAppointmentById,
};
