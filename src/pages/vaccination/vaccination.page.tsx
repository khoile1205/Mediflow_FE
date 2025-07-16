import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { ColDef, RowClickedEvent, RowSelectedEvent } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { TestResultStatus } from "~/constants/enums";
import { useMutationAddVaccineToPreExamination } from "~/services/pre-examination/hooks/mutations";
import {
    useQueryGetMedicineVaccinationByReceptionId,
    useQueryGetNearestExpiryMedicineBatch,
    useQueryGetWaitingPatientVaccination,
} from "~/services/vaccination/hooks/queries";
import {
    MedicineVaccinationInformation,
    NearestExpiryMedicineBatch,
    WaitingPatientVaccination,
} from "~/services/vaccination/infras";
import { showToast } from "~/utils";
import { formatDate } from "~/utils/date-time";
import PreExaminationTestingPage from "../pre-examination-testing";
import { useCreateVaccinationForm } from "./hooks/use-create-vaccination-form";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";

const VaccinationPage: React.FC = () => {
    const { t } = useTranslation();
    const { patientForm, vaccinationForm } = useCreateVaccinationForm();

    const patientAgGrid = useAgGrid<WaitingPatientVaccination>({});
    const vaccineAgGrid = useAgGrid<MedicineVaccinationInformation>({});

    const queryClient = useQueryClient();

    const [selectedVaccinationMedicineCount, setSelectedVaccinationMedicineCount] = React.useState<number>(0);
    const [searchWaitingPatientTerm, setSearchWaitingPatientTerm] = React.useState<string>("");
    const [isOpenTestingModal, setIsOpenTestingModal] = React.useState<boolean>(false);
    const [isStartEnabled, setIsStartEnabled] = React.useState(false);

    const {
        data: { waitingPatientList },
    } = useQueryGetWaitingPatientVaccination({ searchTerm: searchWaitingPatientTerm });

    const {
        data: { doctorPrescribedVaccines },
    } = useQueryGetMedicineVaccinationByReceptionId(patientForm.watch("receptionId"));
    const {
        data: { nearestExpiryMedicineBatch },
    } = useQueryGetNearestExpiryMedicineBatch(vaccinationForm.watch("medicineId"));

    const { mutateAsync: addVaccineToPreExamination } = useMutationAddVaccineToPreExamination();

    const patientColumnDefs = React.useMemo(
        () =>
            [
                { field: "patientCode", headerName: t(i18n.translationKey.medicalCode) },
                { field: "patientName", headerName: t(i18n.translationKey.patientName) },
                {
                    field: "dateOfBirth",
                    headerName: t(i18n.translationKey.dateOfBirth),
                    valueFormatter: ({ value }) => formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                    cellClass: "ag-cell-center",
                },
            ] as ColDef<WaitingPatientVaccination>[],
        [t],
    );

    const vaccineColumnDefs: ColDef<MedicineVaccinationInformation>[] = [
        { checkboxSelection: true, headerCheckboxSelection: true, width: 50, pinned: true, resizable: false },
        {
            field: "medicineName",
            headerName: t(i18n.translationKey.vaccineSerumName),
            headerStyle: { backgroundColor: "#98D2C0" },
            flex: 2,
        },
        {
            field: "doctorName",
            headerName: t(i18n.translationKey.batchNumber),
            headerStyle: { backgroundColor: "#98D2C0" },
            flex: 1,
        },
        {
            field: "isConfirmed",
            headerName: t(i18n.translationKey.vaccinationConfirmation),
            valueGetter: (params) => {
                return params.data.isConfirmed ? t(i18n.translationKey.isInjected) : t(i18n.translationKey.notInjected);
            },
            cellClass: "ag-cell-center",
            headerStyle: { backgroundColor: "#98D2C0" },
            flex: 1,
        },
        {
            field: "testResultEntry",
            headerName: t(i18n.translationKey.testResult),
            headerStyle: { backgroundColor: "#98D2C0" },
            flex: 1,
            valueGetter: (params) => {
                if (!params.data.testResultEntry) return t(i18n.translationKey.notTested);

                return params.data.testResultEntry === TestResultStatus.NEGATIVE
                    ? t(i18n.translationKey.negative)
                    : t(i18n.translationKey.positive);
            },
            cellClass: "ag-cell-center",
        },
        {
            field: "doctorName",
            headerName: t(i18n.translationKey.instructedDoctor),
            headerStyle: { backgroundColor: "#98D2C0" },
            cellClass: "ag-cell-center",
            flex: 1,
        },
    ];

    const handleSearch = (value: string) => {
        setSearchWaitingPatientTerm(value);
    };

    const handleConfirmStart = () => {
        setIsOpenTestingModal(true);
    };

    const handleSelectPatient = (row: RowClickedEvent<WaitingPatientVaccination>) => {
        const selectedPatient = row.data;
        patientForm.setValue("receptionId", selectedPatient.receptionId);
        patientForm.setValue("patientCode", selectedPatient.patientCode);
        patientForm.setValue("patientName", selectedPatient.patientName);
        patientForm.setValue("dateOfBirth", selectedPatient.dateOfBirth);
        patientForm.setValue("gender", selectedPatient.gender);
        patientForm.setValue("weightKg", selectedPatient.weightKg);
        patientForm.setValue("patientVaccinationCode", selectedPatient.patientVaccinationCode);
    };

    const handleSelectVaccinationMedicine = (row: RowSelectedEvent<MedicineVaccinationInformation>) => {
        if (row.type == "rowSelected") {
            const selectedRows = row.api.getSelectedRows();
            setSelectedVaccinationMedicineCount(selectedRows.length);

            if (selectedRows.length > 0) {
                const selectedMedicine = selectedRows[0];
                vaccinationForm.setValue("medicineId", selectedMedicine.medicineId);
                vaccinationForm.setValue("receptionVaccinationId", selectedMedicine.receptionVaccinationId);
                vaccinationForm.setValue("isInjected", selectedMedicine.isConfirmed);
            } else {
                vaccinationForm.reset();
            }
        }
    };

    const handleConfirmTesting = async () => {
        const receptionVaccinationId = vaccinationForm.watch("receptionVaccinationId");
        if (!receptionVaccinationId) {
            showToast.warning(t(i18n.translationKey.selectAtLeastOneDose));
            return;
        }

        await addVaccineToPreExamination({
            receptionId: receptionVaccinationId,
        });

        setIsStartEnabled(true);
    };

    React.useEffect(() => {
        if (nearestExpiryMedicineBatch.length > 0) {
            const firstBatch = nearestExpiryMedicineBatch[0];
            vaccinationForm.setValue("medicineBatchCode", firstBatch.medicineBatchNumber);
            vaccinationForm.setValue("medicineExpiryDate", firstBatch.expiryDate);
        }
    }, [nearestExpiryMedicineBatch]);

    return (
        <Box className="flex h-full">
            <DynamicForm form={patientForm}>
                <Box className="flex h-full basis-1/3 flex-col bg-[#F6F8D5] p-3">
                    <Stack spacing={2} className="flex-grow">
                        <FormItem
                            render="text-input"
                            name="patientVaccinationCode"
                            label={t(i18n.translationKey.vaccinationNumber)}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <Grid container spacing={2} alignItems="center">
                            <Grid size={12}>
                                <SearchBox
                                    onChange={handleSearch}
                                    placeholder={t(i18n.translationKey.enterMedicalCode)}
                                />
                            </Grid>
                        </Grid>

                        <AgDataGrid
                            columnDefs={patientColumnDefs}
                            rowData={waitingPatientList}
                            onRowClicked={handleSelectPatient}
                            {...patientAgGrid}
                            maxRows={5}
                        />
                        <FormItem
                            render="text-input"
                            name="patientVaccinationCode"
                            label={t(i18n.translationKey.vaccinationNumber)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <FormItem
                            render="text-input"
                            name="patientCode"
                            label={t(i18n.translationKey.medicalCode)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <FormItem
                            render="text-input"
                            name="patientName"
                            label={t(i18n.translationKey.patientName)}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <FormItem
                                    render="date-picker"
                                    name="dateOfBirth"
                                    datePickerProps={{
                                        readOnly: true,
                                    }}
                                    label={t(i18n.translationKey.dateOfBirth)}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormItem
                                    render="text-input"
                                    name="gender"
                                    label={t(i18n.translationKey.gender)}
                                    slotProps={{ input: { readOnly: true } }}
                                />
                            </Grid>
                        </Grid>

                        <FormItem
                            render="text-input"
                            name="weightKg"
                            label={t(i18n.translationKey.weight)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                    </Stack>
                </Box>
            </DynamicForm>

            <Box className="flex h-full flex-1 flex-col p-3">
                <DynamicForm form={vaccinationForm}>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Stack spacing={2}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={7}>
                                        <FormItem
                                            render="data-grid"
                                            name="medicineBatchCode"
                                            label={t(i18n.translationKey.batchNumber)}
                                            columnDefs={
                                                [
                                                    {
                                                        field: "medicineName",
                                                        headerName: t(i18n.translationKey.vaccineSerumName),
                                                    },
                                                    {
                                                        field: "medicineBatchNumber",
                                                        headerName: t(i18n.translationKey.batchNumber),
                                                    },
                                                    {
                                                        field: "expiryDate",
                                                        headerName: t(i18n.translationKey.expiryDate),
                                                        valueFormatter: ({ value }) =>
                                                            formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                                                    },
                                                ] as ColDef<NearestExpiryMedicineBatch>[]
                                            }
                                            rowData={nearestExpiryMedicineBatch}
                                            displayField="medicineBatchNumber"
                                        />
                                    </Grid>
                                    <Grid size={5}>
                                        <Typography variant="body2" color="text.secondary" className="mb-2">
                                            HSD:{" "}
                                            {formatDate(
                                                vaccinationForm.watch("medicineExpiryDate"),
                                                DATE_TIME_FORMAT["dd/MM/yyyy"],
                                            )}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <FormItem
                                            render="date-time-picker"
                                            name="testingStartTime"
                                            label={t(i18n.translationKey.testStartTime)}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <FormItem
                                            render="date-time-picker"
                                            name="injectionDate"
                                            label={t(i18n.translationKey.injectionDate)}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <FormItem
                                            render="text-area"
                                            name="note"
                                            label={t(i18n.translationKey.note)}
                                            rows={2}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>

                        <Grid size={4}>
                            <Stack spacing={2.5} height="100%">
                                {/* <Button>{t(i18n.translationKey.sendToCustomer)}</Button> */}
                                <Button
                                    disabled={selectedVaccinationMedicineCount === 0}
                                    onClick={handleConfirmTesting}
                                >
                                    {t(i18n.translationKey.confirmStart)}
                                </Button>
                                <Button disabled={selectedVaccinationMedicineCount === 0}>
                                    {t(i18n.translationKey.confirmInjectedToday)}
                                </Button>
                                <Button disabled={selectedVaccinationMedicineCount === 0}>
                                    {t(i18n.translationKey.saveNote)}
                                </Button>
                                <Button
                                    disabled={
                                        selectedVaccinationMedicineCount === 0 || vaccinationForm.watch("isInjected")
                                    }
                                >
                                    {t(i18n.translationKey.confirmSelectedDose)}
                                </Button>
                                <Button
                                    disabled={
                                        selectedVaccinationMedicineCount === 0 || !vaccinationForm.watch("isInjected")
                                    }
                                >
                                    {t(i18n.translationKey.cancelConfirm)}
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid size={2}>
                            <Stack height="100%" display="flex" flexDirection="column" spacing={2.5}>
                                <Button onClick={handleConfirmStart} disabled={!isStartEnabled}>
                                    {t(i18n.translationKey.inputTestResult)}
                                </Button>
                                <Button>{t(i18n.translationKey.vaccinationHistory)}</Button>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Box mt={2}>
                        <AgDataGrid
                            columnDefs={vaccineColumnDefs}
                            rowData={doctorPrescribedVaccines}
                            onRowSelected={handleSelectVaccinationMedicine}
                            {...vaccineAgGrid}
                        />
                    </Box>
                </DynamicForm>
            </Box>
            <PreExaminationTestingPage
                open={isOpenTestingModal}
                onClose={() => {
                    setIsOpenTestingModal(false);

                    queryClient.invalidateQueries({
                        queryKey: [
                            QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID,
                            patientForm.watch("receptionId"),
                        ],
                    });
                }}
                receptionId={patientForm.watch("receptionId")}
            />
        </Box>
    );
};

export default VaccinationPage;
