import { ColDef } from "ag-grid-community";
import { TFunction } from "i18next";
import { formatDate } from "~/utils/date-time";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import i18n from "~/configs/i18n";
import { VaccinationHistoryItem } from "../../types";

interface VaccinationHistoryColumnOptions {
    includePatientInfo?: boolean;
    includeSelection?: boolean;
}

export const createVaccinationHistoryColumns = (
    t: TFunction,
    options: VaccinationHistoryColumnOptions = {},
): ColDef<VaccinationHistoryItem>[] => {
    const { includePatientInfo = false, includeSelection = true } = options;

    const baseHeaderStyle = {
        textAlign: "center",
        fontWeight: "bold",
        backgroundColor: "#98d2c0",
        borderColor: "#98d2c0",
    };

    const columns: ColDef<VaccinationHistoryItem>[] = [];

    // Selection column
    if (includeSelection) {
        columns.push({
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
            resizable: false,
        });
    }

    // Patient info columns (only for general vaccination history)
    if (includePatientInfo) {
        columns.push(
            {
                field: "patientName",
                headerName: t(i18n.translationKey.patientName),
                headerStyle: baseHeaderStyle,
                width: 200,
                pinned: "left",
            },
            {
                field: "patientCode",
                headerName: t(i18n.translationKey.medicalCode),
                headerStyle: baseHeaderStyle,
                width: 200,
            },
        );
    }

    // Common columns for both screens
    columns.push(
        {
            field: "medicineName",
            headerName: t(i18n.translationKey.vaccineSerumName),
            headerStyle: baseHeaderStyle,
            width: 200,
            pinned: includePatientInfo ? false : "left",
        },
        {
            field: "doseNumber",
            headerName: t(i18n.translationKey.doseNumber),
            headerStyle: baseHeaderStyle,
            cellClass: "ag-cell-center",
            width: 100,
        },
        {
            field: "vaccinationTestDate",
            headerName: t(i18n.translationKey.testDate),
            headerStyle: baseHeaderStyle,
            cellClass: "ag-cell-center",
            width: 120,
            cellRenderer: (param: { value: Date }) => {
                const date = param.value as Date;
                return date ? formatDate(date, DATE_TIME_FORMAT["dd/MM/yyyy"]) : "";
            },
        },
        {
            field: "vaccinationDate",
            headerName: t(i18n.translationKey.injectionDate),
            headerStyle: baseHeaderStyle,
            cellClass: "ag-cell-center",
            width: 120,
            cellRenderer: (param: { value: Date }) => {
                const date = param.value as Date;
                return date ? formatDate(date, DATE_TIME_FORMAT["dd/MM/yyyy"]) : "";
            },
        },
        {
            field: "vaccinationConfirmation",
            headerName: t(i18n.translationKey.vaccinationConfirmation),
            headerStyle: baseHeaderStyle,
            cellClass: "ag-cell-center",
            width: 150,
            cellRenderer: (param: { value: boolean }) => {
                return param.value ? t(i18n.translationKey.isInjected) : t(i18n.translationKey.notInjected);
            },
        },
        {
            field: "doctorName",
            headerName: t(i18n.translationKey.instructedDoctor),
            headerStyle: baseHeaderStyle,
            width: 200,
        },
        {
            field: "hasIssue",
            headerName: t(i18n.translationKey.hasIssue),
            headerStyle: baseHeaderStyle,
            cellClass: "ag-cell-center",
            width: 150,
            cellRenderer: (param: { value: boolean }) => {
                return param.value ? t(i18n.translationKey.hasIssue) : t(i18n.translationKey.noIssue);
            },
        },
        {
            field: "issueNote",
            headerName: t(i18n.translationKey.issueNote),
            headerStyle: baseHeaderStyle,
            width: includePatientInfo ? 200 : 300,
        },
        {
            field: "issueDate",
            headerName: t(i18n.translationKey.issueDate),
            headerStyle: baseHeaderStyle,
            cellClass: "ag-cell-center",
            width: 120,
            cellRenderer: (param: { value: Date }) => {
                const date = param.value as Date;
                return date ? formatDate(date, DATE_TIME_FORMAT["dd/MM/yyyy"]) : "";
            },
        },
    );

    return columns;
};
