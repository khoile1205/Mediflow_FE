import { TimeOfDay } from "~/pages/appointments/follow-up/types";

export type IAppointmentFilter = {
    fromDate?: Date;
    toDate?: Date;
    timeOfDay?: TimeOfDay;
    vaccineId?: number;
};
