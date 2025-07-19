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

const ListPatientsExaminationHistoryPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [_, setSearchQuery] = React.useState("");

    const agGrid = useAgGrid({});

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
                rowData={[]}
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
