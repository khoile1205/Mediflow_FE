export enum TimeOfDay {
    All_Day,
    Morning,
    Afternoon,
}

export interface FilterVaccinationFormValue {
    fromDate?: Date;
    toDate?: Date;
    timeOfDay?: TimeOfDay;
    vaccineId?: number;
}
