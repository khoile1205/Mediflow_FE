import { Box, Button, Divider, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { Dialog } from "~/components/common/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { PendingVaccination, PendingVaccinationTodayResponse } from "~/services/vaccination/infras";
import { addDaysToDate, formatDate } from "~/utils/date-time";
import { CloseVaccinationFormValues } from "./types";

interface CloseVaccinationModalProps {
    open: boolean;
    onClose?: () => void;
    onSubmit?: (data: CloseVaccinationFormValues) => Promise<void>;
    pendingVaccinations: PendingVaccinationTodayResponse;
}
const CloseVaccinationModal: React.FC<CloseVaccinationModalProps> = ({
    open,
    onSubmit,
    pendingVaccinations,
    onClose,
}) => {
    const { t } = useTranslation();
    const agGrid = useAgGrid<PendingVaccination>({});

    const form = useForm<CloseVaccinationFormValues>({
        defaultValues: {
            issueNote: "",
            reScheduleDate: null,
        },
    });

    const handleCloseVaccination = async (data: CloseVaccinationFormValues) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} maxWidth="md" onClose={onClose}>
            <Dialog.Header title={t(i18n.translationKey.closeVaccinationConfirmation)} onClose={onClose} />
            <Dialog.Body>
                <Box className="mt-3">
                    {pendingVaccinations.totalPendingDoses ? (
                        <>
                            <Typography fontWeight={500} fontSize={16} sx={{ mb: 1 }}>
                                {t(i18n.translationKey.step, { step: 1 })}
                            </Typography>{" "}
                            <Typography variant="body1" fontSize={14} sx={{ mb: 2 }}>
                                {t(i18n.translationKey.pendingVaccinationToday, {
                                    count: pendingVaccinations.totalPendingDoses,
                                })}
                                {". "}
                                {t(i18n.translationKey.checkBeforeConfirm)}
                            </Typography>
                            <AgDataGrid
                                columnDefs={
                                    [
                                        {
                                            field: "vaccineName",
                                            headerName: t(i18n.translationKey.vaccine),
                                            flex: 1,
                                            cellClass: "ag-cell-center",
                                        },
                                        {
                                            field: "pendingDoses",
                                            headerName: t(i18n.translationKey.pendingDoses),
                                            flex: 0.5,
                                            cellClass: "ag-cell-center",
                                        },
                                        {
                                            field: "scheduledDate",
                                            headerName: t(i18n.translationKey.appointmentDate),
                                            flex: 1,
                                            valueFormatter: ({ value }) =>
                                                formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                                            cellClass: "ag-cell-center",
                                        },
                                    ] as ColDef<PendingVaccination>[]
                                }
                                rowData={pendingVaccinations.pendingVaccinations}
                                {...agGrid}
                            />
                            <Divider sx={{ my: 2 }} />
                        </>
                    ) : null}
                    {pendingVaccinations.totalPendingDoses ? (
                        <Typography fontWeight={500} fontSize={16} sx={{ mb: 1 }}>
                            {t(i18n.translationKey.step, { step: 2 })}
                        </Typography>
                    ) : null}

                    <Typography variant="body1" fontSize={14} sx={{ mb: 2 }}>
                        {t(i18n.translationKey.provideCloseVaccinationInfo)}:
                    </Typography>
                    <DynamicForm form={form}>
                        <FormItem name="issueNote" render="text-area" required label={t(i18n.translationKey.note)} />
                        {pendingVaccinations.totalPendingDoses ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography variant="body1" className="mb-2" fontWeight={500}>
                                    {t(i18n.translationKey.rescheduleVaccinationAfter)}:
                                </Typography>
                                <FormItem
                                    name="reScheduleDate"
                                    render="radio-group"
                                    options={[
                                        {
                                            label: t(i18n.translationKey.notAvailable),
                                            value: null,
                                        },
                                        {
                                            label: t(i18n.translationKey.numberOfDays, { day: 7 }),
                                            value: addDaysToDate(new Date(), 7).toISOString(),
                                        },
                                        {
                                            label: t(i18n.translationKey.numberOfDays, { day: 30 }),
                                            value: addDaysToDate(new Date(), 30).toISOString(),
                                        },
                                    ]}
                                />
                            </Box>
                        ) : null}
                    </DynamicForm>
                </Box>
            </Dialog.Body>
            <Dialog.Action>
                <Button onClick={onClose} color="inherit">
                    {t(i18n.translationKey.close)}
                </Button>
                <Button onClick={form.handleSubmit(handleCloseVaccination)}>{t(i18n.translationKey.confirm)}</Button>
            </Dialog.Action>
        </Dialog>
    );
};

export default CloseVaccinationModal;
