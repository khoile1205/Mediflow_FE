import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import { useVaccinationHistoryForm } from "../hooks/use-vaccination-history-form";
import { Patient } from "~/entities";
import { PatientSelectModal } from "~/components/modal/patient-select.modal";
import { Search } from "@mui/icons-material";
import { ActionButton } from "~/components/common/action-button";
import { formatDate } from "~/utils/date-time";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { useQueryGetVaccinationHistoryByPatientId } from "~/services/vaccination/hooks/queries";
import { createVaccinationHistoryColumns } from "./utils/vaccination-history-columns.util";

export const PatientVaccinationHistory: React.FC = () => {
    const { t } = useTranslation();
    const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

    const form = useVaccinationHistoryForm();

    const [isOpenPatientSelectModal, setIsOpenPatientSelectModal] = React.useState<boolean>(false);
    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    const {
        data: { vaccinationHistory },
    } = useQueryGetVaccinationHistoryByPatientId(selectedPatient?.id);

    useEffect(() => {
        if (vaccinationHistory) {
            form.setValue("patientCode", vaccinationHistory.patientCode || "");
            form.setValue("patientVaccinationCode", vaccinationHistory.patientVaccinationCode || "");
            form.setValue("patientName", vaccinationHistory.patientName || "");
            form.setValue("gender", vaccinationHistory.gender || "");
            form.setValue("phoneNumber", vaccinationHistory.phoneNumber || "");
            form.setValue("addressDetail", vaccinationHistory.addressDetail || "");
            form.setValue("ward", vaccinationHistory.ward || "");
            form.setValue("district", vaccinationHistory.district || "");
            form.setValue("province", vaccinationHistory.province || "");
            form.setValue("vaccinationHistoryItems", vaccinationHistory.vaccinationHistoryItems || []);
        }
    }, [vaccinationHistory, form]);

    const vaccinationHistoryGrid = useAgGrid({ rowSelection: "multiple" });

    // Use shared column definitions without patient info
    const vaccinationHistoryColumnDefs = React.useMemo(() => {
        return createVaccinationHistoryColumns(t, {
            includePatientInfo: false,
            includeSelection: true,
        });
    }, [t]);

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <Box sx={{ flex: 1, p: 3 }}>
                    <DynamicForm form={form}>
                        <Stack spacing={2}>
                            <Box>
                                <Grid container spacing={2} alignItems="center" marginBottom={2}>
                                    <Typography variant="subtitle2" className="w-2/3 text-xl font-bold">
                                        {t(i18n.translationKey.patientVaccinationHistory)}
                                    </Typography>
                                    <ActionButton
                                        label={t(i18n.translationKey.searchPatient)}
                                        startIcon={<Search />}
                                        onClick={() => {
                                            setIsOpenPatientSelectModal(true);
                                        }}
                                    />
                                </Grid>
                                <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                                    <Grid container spacing={2.5} alignItems="flex-start">
                                        <Grid size={3}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="patientCode"
                                                label={t(i18n.translationKey.medicalCode)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={3}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="patientName"
                                                label={t(i18n.translationKey.patientName)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={3}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="dateOfBirth"
                                                label={t(i18n.translationKey.dateOfBirth)}
                                                size="small"
                                                value={`${formatDate(selectedPatient ? selectedPatient.dob : null, DATE_TIME_FORMAT["dd/MM/yyyy"])}`}
                                            />
                                        </Grid>
                                        <Grid size={3}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="gender"
                                                label={t(i18n.translationKey.gender)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={2}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="phoneNumber"
                                                label={t(i18n.translationKey.phoneNumber)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={3}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="addressDetail"
                                                label={t(i18n.translationKey.address)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={3}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="ward"
                                                label={t(i18n.translationKey.ward)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={2}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="district"
                                                label={t(i18n.translationKey.district)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={2}>
                                            <FormItem
                                                render="text-input-no-clear"
                                                slotProps={{ input: { readOnly: true } }}
                                                name="province"
                                                label={t(i18n.translationKey.province)}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box mt={2}>
                                        <AgDataGrid
                                            columnDefs={vaccinationHistoryColumnDefs}
                                            rowData={form.watch("vaccinationHistoryItems") || []}
                                            maxRows={10}
                                            className="mt-2"
                                            {...vaccinationHistoryGrid}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Stack>
                    </DynamicForm>
                </Box>
            </Box>
            <PatientSelectModal
                open={isOpenPatientSelectModal}
                onClose={() => setIsOpenPatientSelectModal(false)}
                onSelect={handleSelectPatient}
            />
        </>
    );
};

export default PatientVaccinationHistory;
