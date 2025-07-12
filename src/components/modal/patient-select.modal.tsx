import { Close } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { RowSelectedEvent } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { Patient } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryPatients } from "~/services/patient/hooks/queries";
import { AgDataGrid, useAgGrid } from "../common/ag-grid";
import DynamicForm from "../form/dynamic-form";
import FormItem from "../form/form-item";
import { useForm } from "../form/hooks/use-form";

type PatientSearchForm = {
    code?: string;
    name?: string;
    phoneNumber?: string;
    identityCard?: string;
};

interface PatientSelectModalProps {
    open: boolean;
    onClose: () => void;
    onSelect?: (patient?: Patient) => void;
}

const defaultPatientSearchForm: PatientSearchForm = {
    code: "",
    name: "",
    phoneNumber: "",
    identityCard: "",
};
export const PatientSelectModal: React.FC<PatientSelectModalProps> = ({ open, onSelect, onClose }) => {
    const { t } = useTranslation();
    const { pageIndex, pageSize, handlePageChange } = usePagination();
    const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
    const [searchParams, setSearchParams] = React.useState<PatientSearchForm>(defaultPatientSearchForm);
    const patientSelectForm = useForm<PatientSearchForm>({
        defaultValues: defaultPatientSearchForm,
    });

    const {
        data: { listPatients, totalItems },
        isLoading,
    } = useQueryPatients({
        isEnabled: open,
        query: {
            pageIndex,
            pageSize,
            ...searchParams,
        },
    });

    const listPatientAgGrid = useAgGrid<Patient>({});

    const handleSelectPatient = (params: RowSelectedEvent<Patient>) => {
        const selectedRows = params.api.getSelectedRows();

        if (selectedRows.length > 0) {
            setSelectedPatient(selectedRows[0]);
        } else {
            setSelectedPatient(null);
        }
    };

    const handleSubmit = () => {
        if (selectedPatient) {
            onSelect?.(selectedPatient);
        }
        handleCloseForm();
    };

    const handleCloseForm = () => {
        patientSelectForm.reset();
        setSearchParams(defaultPatientSearchForm);
        onClose();
    };

    const handleSearchPatient = async (data: PatientSearchForm) => {
        const newSearchParams = {
            code: data.code?.trim() ?? "",
            name: data.name?.trim() ?? "",
            phoneNumber: data.phoneNumber?.trim() ?? "",
            identityCard: data.identityCard?.trim() ?? "",
        };
        setSearchParams(newSearchParams);
        patientSelectForm.reset(newSearchParams);
    };

    return (
        <Dialog open={open} maxWidth="lg" fullWidth onClose={handleCloseForm}>
            <DialogTitle>
                <Box className="flex items-center justify-between">
                    <Typography>Chọn bệnh nhân</Typography>
                    <IconButton>
                        <Close onClick={handleCloseForm} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent className="no-scrollbar h-full">
                <DynamicForm form={patientSelectForm}>
                    <Stack className="flex rounded-lg border border-gray-100 p-4" spacing={2} direction="row">
                        <Stack
                            className="flex-1"
                            direction={"row"}
                            spacing={2}
                            sx={{
                                "& > *": {
                                    flex: 1,
                                },
                            }}
                        >
                            <FormItem
                                render="text-input"
                                name="code"
                                label={t(i18n.translationKey.medicalCode)}
                                className="mb-0"
                            />
                            <FormItem
                                render="text-input"
                                name="name"
                                label={t(i18n.translationKey.patientName)}
                                className="mb-0"
                            />
                            <FormItem
                                render="text-input"
                                name="phoneNumber"
                                label={t(i18n.translationKey.phoneNumber)}
                                className="mb-0"
                            />
                            <FormItem
                                render="text-input"
                                name="identityCard"
                                label={t(i18n.translationKey.identityCard)}
                                className="mb-0"
                            />
                        </Stack>
                        <Button
                            onClick={patientSelectForm.handleSubmit(handleSearchPatient)}
                            size="small"
                            className="mb-2"
                            disabled={isLoading}
                        >
                            {t(i18n.translationKey.search)}
                        </Button>
                    </Stack>
                </DynamicForm>
                <Box flex={1} mt={2}>
                    <AgDataGrid
                        columnDefs={[
                            {
                                checkboxSelection: true,
                                headerCheckboxSelection: true,
                                width: 50,
                                pinned: true,
                                resizable: false,
                            },
                            {
                                field: "code",
                                headerName: t(i18n.translationKey.medicalCode),
                                flex: 1,
                            },
                            {
                                field: "name",
                                headerName: t(i18n.translationKey.patientName),
                                flex: 1,
                            },
                            {
                                field: "phoneNumber",
                                headerName: t(i18n.translationKey.phoneNumber),
                                flex: 1,
                            },
                            {
                                field: "identityCard",
                                headerName: t(i18n.translationKey.identityCard),
                                flex: 1,
                            },
                        ]}
                        rowData={listPatients}
                        pagination
                        pageSize={pageSize}
                        pageIndex={pageIndex}
                        totalItems={totalItems}
                        onRowSelected={handleSelectPatient}
                        onPageChange={handlePageChange}
                        {...listPatientAgGrid}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Box className="flex items-center justify-end gap-2 p-4">
                    <Button
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        Chọn
                    </Button>
                    <Button
                        type="button"
                        className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                        onClick={handleCloseForm}
                    >
                        Hủy
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
