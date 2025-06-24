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
import { DEFAULT_PAGINATION_PARAMS } from "~/constants/pagination";
import { Patient } from "~/entities";
import { getAxiosErrorMessageKey } from "~/libs/axios/helper";
import { IPagination } from "~/libs/axios/types";
import { patientService } from "~/services/patient";
import { showToast } from "~/utils";
import { AgDataGrid, useAgGrid } from "../common/ag-grid";
import DynamicForm from "../form/dynamic-form";
import FormItem from "../form/form-item";
import { useForm } from "../form/hooks/use-form";
type PatientSearchForm = {
    patientCode?: string;
    patientName?: string;
    patientPhoneNumber?: string;
};

interface PatientSelectModalProps {
    open: boolean;
    onClose: () => void;
    onSelect?: (patient?: Patient) => void;
}

export const PatientSelectModal: React.FC<PatientSelectModalProps> = ({ open, onSelect, onClose }) => {
    const { t } = useTranslation();
    const [listPatientWithPagination, setListPatientWithPagination] = React.useState<IPagination<Patient>>();
    const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

    const patientSelectForm = useForm<PatientSearchForm>({
        defaultValues: {
            patientCode: "",
            patientName: "",
            patientPhoneNumber: "",
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
        onClose();
    };

    const getListPatientWithPagination = async (pageIndex: number, pageSize: number, filters?: PatientSearchForm) => {
        try {
            const response = await patientService.getListPatientWithPagination({
                pageIndex,
                pageSize,
                ...filters,
            });
            setListPatientWithPagination(response.Data);
        } catch (error) {
            showToast.error(getAxiosErrorMessageKey(error));
        }
    };

    const handleSearchPatient = async (data: PatientSearchForm) => {
        const { patientCode, patientName, patientPhoneNumber } = data;
        await getListPatientWithPagination(DEFAULT_PAGINATION_PARAMS.PAGE_INDEX, DEFAULT_PAGINATION_PARAMS.PAGE_SIZE, {
            patientCode: patientCode?.trim(),
            patientName: patientName?.trim(),
            patientPhoneNumber: patientPhoneNumber?.trim(),
        });
    };

    React.useEffect(() => {
        if (open) {
            getListPatientWithPagination(DEFAULT_PAGINATION_PARAMS.PAGE_INDEX, DEFAULT_PAGINATION_PARAMS.PAGE_SIZE);
        }
    }, [open]);
    return (
        <Dialog open={open} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box className="flex items-center justify-between">
                    <Typography>Chọn bệnh nhân</Typography>
                    <IconButton>
                        <Close onClick={() => patientSelectForm.reset()} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
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
                                name="patientCode"
                                label={t(i18n.translationKey.medicalCode)}
                                className="mb-0"
                            />
                            <FormItem
                                render="text-input"
                                name="patientName"
                                label={t(i18n.translationKey.patientName)}
                                className="mb-0"
                            />
                            <FormItem
                                render="text-input"
                                name="patientPhoneNumber"
                                label={t(i18n.translationKey.phoneNumber)}
                                className="mb-0"
                            />
                        </Stack>
                        <Button
                            onClick={patientSelectForm.handleSubmit(handleSearchPatient)}
                            size="small"
                            className="mb-2"
                        >
                            {t(i18n.translationKey.search)}
                        </Button>
                    </Stack>
                </DynamicForm>
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
                        },
                        {
                            field: "name",
                            headerName: t(i18n.translationKey.patientName),
                        },
                        {
                            field: "phoneNumber",
                            headerName: t(i18n.translationKey.phoneNumber),
                        },
                    ]}
                    rowData={listPatientWithPagination?.data ?? []}
                    pageIndex={listPatientWithPagination?.pageIndex ?? 0}
                    pageSize={listPatientWithPagination?.pageSize ?? 10}
                    className="mt-4"
                    onRowSelected={handleSelectPatient}
                    {...listPatientAgGrid}
                />
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
