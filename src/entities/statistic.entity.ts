export interface VaccineTraffic {
    vaccineId: number;
    vaccineName: string;
    totalUsed: number;
}

export interface CountData {
    count: number;
}

export interface RevenueData {
    amount: number;
    currency: string;
}

export interface MonthlyPatients {
    month: string;
    totalPatients: number;
}

export interface TotalPatientsByYearMonth {
    year: number;
    monthlyPatients: MonthlyPatients[];
}

export interface MonthlyRevenue {
    month: string;
    totalRevenue: number;
    currency: string;
}

export interface TotalRevenueByYearMonth {
    year: number;
    monthlyRevenues: MonthlyRevenue[];
}

export interface OverviewStats {
    vaccineTraffic: VaccineTraffic[];
    todayPatientCount: CountData;
    todayInjectionCount: CountData;
    todayRevenue: RevenueData;
    processedReceptionsCount: CountData;
    totalPatientsByYearMonth: TotalPatientsByYearMonth[];
    totalRevenueByYearMonth: TotalRevenueByYearMonth[];
}
