export type Report = {
    key: ReportKey;
    name: string;
    code: string;
    procedure: string;
};

export type TDateRangeFormValue = {
    fromDate?: Date;
    toDate?: Date;
};

export enum ReportKey {
    PatientStatistic = "patient-statistic",
    HospitalRevenue = "hospital-revenue",
    SupplyInventories = "supply-inventories",
    MedicineRevenue = "medicine-revenue",
}
