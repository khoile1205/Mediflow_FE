export interface VaccinationIndicateReceptionFormValues {
    id?: number;
    vaccineId: number;
    vaccineName?: string;
    quantity: number;
    isReadyToUse: boolean;
    scheduledDate?: Date;
    appointmentDate: Date;
    note?: string;
}
