import { CalendarToday, Mail, Person, Phone } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { Dialog } from "~/components/common/dialog";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { Gender } from "~/constants/enums";
import { Appointment } from "~/entities/appointment.entity";
import { useQueryGetAppointmentById } from "~/services/appointments/hooks/queries";
import { useQueryGetPatientById } from "~/services/patient/hooks/queries";
import { formatDate } from "~/utils/date-time";

interface AppointmentDetailsModalProps {
    open: boolean;
    onClose: () => void;
    appointmentId?: number;
}
export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ open, onClose, appointmentId }) => {
    const { t } = useTranslation();

    const {
        data: { appointment },
    } = useQueryGetAppointmentById(appointmentId);

    const { data: patient } = useQueryGetPatientById({ patientId: appointment?.patient.id });

    const appointmentAgGrid = useAgGrid({});
    const appointmentColumnDefs: ColDef<Appointment>[] = [
        {
            field: "vaccineName",
            headerName: t(i18n.translationKey.vaccineSerumName),
            flex: 2,
            cellClass: "ag-grid-cell-text-wrap ag-cell-center",
        },
        {
            field: "dose",
            headerName: t(i18n.translationKey.doseNumber),
            flex: 0.8,
            cellClass: "ag-cell-center",
        },
        {
            field: "appointmentDate",
            headerName: t(i18n.translationKey.appointmentDate),
            valueFormatter: ({ value }) => formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "note",
            headerName: t(i18n.translationKey.note),
            flex: 1,
            valueGetter: ({ data }) => data.note || t(i18n.translationKey.notAvailable),
        },
    ];

    if (!appointment || !patient) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Dialog.Header title={t(i18n.translationKey.followUpAppointmentDetail)} onClose={onClose} />

            <Dialog.Body className="space-y-6 bg-slate-50 p-6 !pt-4">
                {/* Patient Info */}
                <Card className="rounded-lg border border-slate-100">
                    <CardContent className="p-0">
                        <Box className="rounded-t-lg border-b border-slate-100 bg-white p-4">
                            <Typography
                                variant="subtitle1"
                                className="flex items-center gap-2 font-semibold text-slate-800"
                            >
                                <Person />
                                {t(i18n.translationKey.patientInformation)}
                            </Typography>
                        </Box>

                        <Box className="bg-white p-6">
                            <Box className="flex flex-col gap-6 md:flex-row">
                                {/* Avatar & Name */}
                                <Box className="flex flex-1 flex-col items-center border-b border-slate-100 pb-4 md:items-start md:border-b-0 md:border-r md:pb-0 md:pr-6">
                                    <Avatar className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white shadow">
                                        {appointment.patientName.split(" ").slice(-1)[0]?.[0].toUpperCase()}
                                    </Avatar>
                                    <Typography
                                        variant="h6"
                                        className="mt-3 w-full text-center font-semibold text-slate-800 md:text-left"
                                    >
                                        {appointment.patientName}
                                    </Typography>
                                    <Box className="mt-2 w-full rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                                        {t(i18n.translationKey.medicalCode)}:{" "}
                                        <span className="font-semibold text-slate-800">{appointment.patientCode}</span>
                                    </Box>
                                </Box>

                                {/* Detail Grid */}
                                <Box className="flex-3 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:pt-0">
                                    {[
                                        {
                                            icon: <Person />,
                                            label: t(i18n.translationKey.gender),
                                            value:
                                                patient.gender == Gender.MALE
                                                    ? t(i18n.translationKey.male)
                                                    : t(i18n.translationKey.female),
                                        },
                                        {
                                            icon: <CalendarToday />,
                                            label: t(i18n.translationKey.dateOfBirth),
                                            value: formatDate(appointment.patient.dob, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                                        },
                                        {
                                            icon: <Phone />,
                                            label: t(i18n.translationKey.phoneNumber),
                                            value: appointment.patient.phoneNumber,
                                        },
                                        {
                                            icon: <Mail />,
                                            label: t(i18n.translationKey.email),
                                            value: appointment.patient.email,
                                        },
                                    ].map((item, idx) => (
                                        <Box key={idx} className="flex items-start gap-3">
                                            <Box className="rounded-md bg-slate-100 p-1 text-slate-500">
                                                {item.icon}
                                            </Box>
                                            <Box>
                                                <p className="text-sm text-slate-500">{item.label}</p>
                                                <p className="text-sm font-medium text-slate-800">{item.value}</p>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Vaccine Table */}
                <Card className="rounded-lg border border-slate-100">
                    <CardContent className="p-0">
                        <Box className="rounded-t-lg border-b border-slate-100 bg-white p-4">
                            <Typography
                                variant="subtitle1"
                                className="flex items-center gap-2 font-semibold text-slate-800"
                            >
                                <CalendarToday /> {t(i18n.translationKey.scheduledVaccines)}
                            </Typography>
                        </Box>
                        <AgDataGrid {...appointmentAgGrid} columnDefs={appointmentColumnDefs} rowData={[appointment]} />
                    </CardContent>
                </Card>
            </Dialog.Body>
        </Dialog>
    );
};
