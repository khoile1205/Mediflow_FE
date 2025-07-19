import { Visibility } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { formatDate } from "~/utils/date-time";

const mockPatients = [
    {
        id: "128437582",
        name: "Trần Văn A",
        phone: "0945740153",
        lastExam: "2023-06-15",
        service: "General Checkup",
        status: "Complete",
    },
    {
        id: "128437583",
        name: "Nguyễn Thị B",
        phone: "0912345678",
        lastExam: "2023-06-14",
        service: "Blood Test",
        status: "Pending",
    },
    {
        id: "128437584",
        name: "Lê Văn C",
        phone: "0987654321",
        lastExam: "2023-06-13",
        service: "X-Ray",
        status: "Complete",
    },
    {
        id: "128437585",
        name: "Phạm Thị D",
        phone: "0977123456",
        lastExam: "2023-06-12",
        service: "Cardiology",
        status: "Complete",
    },
    {
        id: "128437586",
        name: "Hoàng Văn E",
        phone: "0909876543",
        lastExam: "2023-06-11",
        service: "Ultrasound",
        status: "Complete",
    },
];

const ListPatientsExaminationHistoryPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState("");

    const agGrid = useAgGrid({});

    const filteredPatients = mockPatients.filter(
        (patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.id.includes(searchQuery),
    );

    return (
        <Box
            component="main"
            sx={{
                p: 3,
                mt: { xs: 8, lg: 0 },
            }}
        >
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5" fontWeight={700}>
                    {t(i18n.translationKey.examinationHistory)}
                </Typography>
                <Box className="basis-1/3">
                    <SearchBox
                        placeholder={t(i18n.translationKey.searchPatient)}
                        onChange={(value) => setSearchQuery(value)}
                    />
                </Box>
            </Box>
            <AgDataGrid
                {...agGrid}
                rowData={filteredPatients}
                columnDefs={[
                    {
                        headerName: t(i18n.translationKey.medicalCode),
                        field: "id",
                        cellClass: "ag-cell-center",
                        flex: 1,
                    },
                    {
                        headerName: t(i18n.translationKey.patientName),
                        field: "name",
                        cellClass: "ag-cell-center",
                        flex: 1,
                    },
                    {
                        headerName: t(i18n.translationKey.phoneNumber),
                        field: "phone",
                        cellClass: "ag-cell-center",
                        flex: 1,
                    },
                    {
                        headerName: t(i18n.translationKey.lastExamination),
                        field: "lastExam",
                        cellClass: "ag-cell-center",
                        valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
                        flex: 0.8,
                    },
                    {
                        cellClass: "ag-cell-center",
                        cellRenderer: (params: ICellRendererParams) => (
                            <IconButton
                                // variant="outlined"
                                // size="small"
                                color="primary"
                                onClick={() => {
                                    navigate(`/examination/history/patient/${params.data.id}`);
                                }}
                            >
                                <Visibility />
                            </IconButton>
                        ),
                        flex: 0.5,
                    },
                ]}
            />
        </Box>
    );
};

export default ListPatientsExaminationHistoryPage;
