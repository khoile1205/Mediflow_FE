import { TimeOfDay } from "~/pages/appointments/follow-up/types";

export type IAppointmentFilter = {
    fromDate?: string;
    toDate?: string;
    timeOfDay?: TimeOfDay;
    vaccineId?: number;
};
