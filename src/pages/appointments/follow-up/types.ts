export enum TimeOfDay {
    Morning,
    Afternoon,
    Evening,
}

export interface FilterVaccinationFormValue {
    fromDate?: Date;
    toDate?: Date;
    timeOfDay?: TimeOfDay;
    vaccineId?: number;
}
