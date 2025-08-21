export type TDateRangeReportRequest = {
    fromDate: string;
    toDate: string;
};

export type TReportReponse<TSummaryType> = {
    fromDate: string;
    toDate: string;
    generatedAt: string;
    generatedBy: string;
    summary: TSummaryType;
};

export type TPatientStatisticResponse = TReportReponse<TPatientStatisticReportSummary> & {
    ageGroupStatistics: TPatientStatisticAgeGroupReportStatistic[];
    locationStatistics: TPatientStatisticLocationReportStatistic[];
};

export type TPatientStatisticReportSummary = {
    totalPatients: number;
};

export type TPatientStatisticAgeGroupReportStatistic = {
    ageGroup: string;
    ageRange: string;
    patientCount: number;
    percentage: number;
};

export type TPatientStatisticLocationReportStatistic = {
    stt: number;
    province: string;
    patientCount: number;
    percentage: number;
};

export type THospitalRevenueReportResponse = TReportReponse<THospitalRevenueReportSummary> & {
    dailyRevenues: THospitalRevenueDailyRevenueStatistic[];
};

export type THospitalRevenueReportSummary = {
    totalExamFeeRevenue: number;
    totalTestFeeRevenue: number;
    totalInjectionRevenue: number;
    totalRevenue: number;
    totalExamCount: number;
    totalTestCount: number;
    totalInjectionCount: number;
    averageDailyRevenue: number;
};

export type THospitalRevenueDailyRevenueStatistic = {
    date: Date;
    examFeeRevenue: number;
    testFeeRevenue: number;
    injectionRevenue: number;
    totalRevenue: number;
    examCount: number;
    testCount: number;
    injectionCount: number;
};

export type TInventoryStatisticReportSummary = {
    totalVaccineTypes: number;
    totalQuantityInStock: number;
    totalInventoryValue: number;
    totalBatches: number;
    batchesNearExpiry: number;
    lowStockVaccines: number;
};

export type TSupplyInventoryResponse = TReportReponse<TSupplyInventoryReportSummary> & {
    transactions: TMedicineReportTransactionStatistic[];
    vaccineStocks: TMedicineReportVaccineStockStatistic[];
};

export type TSupplyInventoryReportSummary = {
    totalVaccineTypes: number;
    totalQuantityInStock: number;
    totalInventoryValue: number;
    totalBatches: number;
    batchesNearExpiry: number;
    lowStockVaccines: number;
};

export type TMedicineReportTransactionStatistic = {
    stt: number;
    transactionDate: string;
    transactionType: string;
    vaccineCode: string;
    vaccineName: string;
    batchNumber: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    description: string;
};

export type TMedicineReportVaccineStockStatistic = {
    stt: number;
    vaccineCode: string;
    vaccineName: string;
    unit: string;
    classification: string;
    totalQuantity: number;
    averageUnitPrice: number;
    totalValue: number;
    batchCount: number;
    nearestExpiry: string;
    status: string;
};

export type TMedicineRevenueResponse = TReportReponse<TMedicineRevenueReportSummary> & {
    batchDetails: TMedicineRevenueBatchDetail[];
    dailyStatistics: TMedicineRevenueDailyStatistic[];
    categoryStatistics: TMedicineRevenueCategoryStatistic[];
    medicineDetails: TMedicineRevenueMedicineDetail[];
};

export type TMedicineRevenueReportSummary = {
    totalRevenue: number;
    totalQuantityUsed: number;
    totalMedicineTypes: number;
    totalBatchesUsed: number;
    averageUnitPrice: number;
    estimatedProfit: number;
};

export type TMedicineRevenueBatchDetail = {
    medicineName: string;
    medicineCode: string;
    batchNumber: string;
    expiryDate: string;
    quantityUsed: number;
    importPrice: number;
    sellingPrice: number;
    revenue: number;
    profit: number;
};

export type TMedicineRevenueDailyStatistic = {
    date: string;
    quantityUsed: number;
    revenue: number;
    medicineTypeCount: number;
};

export type TMedicineRevenueCategoryStatistic = {
    category: string;
    quantity: number;
    revenue: number;
    percentage: number;
    estimatedProfit: number;
    profitMargin: number;
};

export type TMedicineRevenueMedicineDetail = {
    stt: number;
    medicineCode: string;
    medicineName: string;
    unit: string;
    classification: string;
    quantityUsed: number;
    averageUnitPrice: number;
    totalRevenue: number;
    averageCostPrice: number;
    supplierName: string;
    estimatedProfit: number;
    profitMargin: number;
};

export type TReportFile = {
    blob: Blob;
};
