import { Box, Pagination } from "@mui/material";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import classNames from "classnames";
import React from "react";
import "./ag-grid.scss";
import { GRID_STYLE_CONFIG } from "./config";
import { useAgGrid } from "./hooks";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";

type AgDataGridProps = Omit<AgGridReactProps, "columnDefs" | "rowData"> & {
    columnDefs: NonNullable<AgGridReactProps["columnDefs"]>;
    rowData: NonNullable<AgGridReactProps["rowData"]>;
    totalItems?: number;
    pageSize?: number;
    pageIndex?: number;
    onPageChange?: (newPageIndex: number) => void;
} & Pick<ReturnType<typeof useAgGrid>, "onGridReady">;

const AgDataGrid: React.FC<AgDataGridProps> = ({
    columnDefs,
    rowData,
    defaultColDef,
    onGridReady,
    gridOptions,
    className = "",
    totalItems,
    pageSize = 10,
    pageIndex = 1,
    onPageChange,
    ...props
}) => {
    const { t } = useTranslation();

    const totalPages = React.useMemo(() => Math.ceil((totalItems || 0) / pageSize), [totalItems, pageSize]);

    const getHeightDataGrid = () => {
        const { MIN_HEIGHT, MAX_ROWS, HEADER_HEIGHT, ROW_HEIGHT, SCROLLBAR_HEIGHT } = GRID_STYLE_CONFIG.GRID_DIMENSIONS;
        const pinnedBottomRowData = gridOptions?.pinnedBottomRowData ?? [];
        const pinnedHeight = pinnedBottomRowData.length * ROW_HEIGHT;

        const dataRowCount = Array.isArray(rowData) ? rowData.length : 0;
        const visibleRows = Math.min(dataRowCount, MAX_ROWS);

        const calculatedHeight = HEADER_HEIGHT + visibleRows * ROW_HEIGHT + pinnedHeight + SCROLLBAR_HEIGHT;

        return Math.max(calculatedHeight, MIN_HEIGHT);
    };

    return (
        <Box className={classNames("ag-data-grid", className)} sx={{ height: getHeightDataGrid() }}>
            <AgGridReact
                {...gridOptions}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                rowData={rowData}
                defaultColDef={defaultColDef}
                ensureDomOrder
                overlayNoRowsTemplate={t(i18n.translationKey.noDataToDisplay)}
                {...props}
            />

            {totalItems !== undefined && totalItems > pageSize && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={pageIndex}
                        onChange={(_, newPage) => onPageChange?.(newPage)}
                        color="primary"
                        shape="rounded"
                        size="small"
                    />
                </Box>
            )}
        </Box>
    );
};

export default AgDataGrid;
