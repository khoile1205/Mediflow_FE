import { Role } from "~/constants/roles";
import { Report, ReportKey } from "./types";
import i18n from "~/configs/i18n";

export const reportsDef: Report[] = [
    {
        key: ReportKey.HospitalRevenue,
        name: i18n.translationKey.hospitalRevenueReport,
        code: "RPT_Revenue",
        procedure: "SP_Hospital_Revenue",
    },
    {
        key: ReportKey.PatientStatistic,
        name: i18n.translationKey.patientStatisticsReport,
        code: "RPT_Patient",
        procedure: "SP_Patient_Statistic",
    },
    {
        key: ReportKey.SupplyInventories,
        name: i18n.translationKey.inventoryStatisticsReport,
        code: "RPT_Supply",
        procedure: "SP_Supply_Inventory",
    },
    {
        key: ReportKey.MedicineRevenue,
        name: i18n.translationKey.medicineRevenueReport,
        code: "RPT_Medicine",
        procedure: "SP_Medicine_Revenue",
    },
];

const roleBasedReports: Partial<Record<Role, ReportKey[]>> = {
    Administrator: [
        ReportKey.HospitalRevenue,
        ReportKey.PatientStatistic,
        ReportKey.SupplyInventories,
        ReportKey.MedicineRevenue,
    ],
    Accountant: [ReportKey.SupplyInventories],
};

export const getAccessibleReportKeys = (roles: Role[], departments: string[]): string[] => {
    const keys = new Set<string>();

    roles?.forEach((role) => {
        if (roleBasedReports[role]) {
            roleBasedReports[role].forEach((k) => keys.add(k));
        }
    });

    if (roles?.some((r) => r === Role.HeadOfDepartment)) {
        if (departments.some((d) => d.toLowerCase() === "inventory")) {
            keys.add("supply-inventories");
        }
        if (departments.some((d) => d.toLowerCase() === "vaccination")) {
            keys.add("patient-statistic");
        }
    }

    return Array.from(keys);
};
