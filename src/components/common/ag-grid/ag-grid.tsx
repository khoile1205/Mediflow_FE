import { Box, FormControl, Grid, MenuItem, Pagination, Select, Typography } from "@mui/material";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import classNames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { DEFAULT_PAGINATION_PARAMS } from "~/constants/pagination";
import "./ag-grid.scss";
import { GRID_STYLE_CONFIG } from "./config";
import { useAgGrid } from "./hooks";

type AgDataGridProps = Omit<AgGridReactProps, "columnDefs" | "rowData"> & {
    columnDefs: NonNullable<AgGridReactProps["columnDefs"]>;
    rowData: NonNullable<AgGridReactProps["rowData"]>;
    totalItems?: number;
    pageSize?: number;
    pageIndex?: number;
    pageSizeOptions?: number[];
    onPageChange?: (pageIndex: number, pageSize: number) => void;
    maxRows?: number;
    isFullHeight?: boolean;
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
    maxRows = GRID_STYLE_CONFIG.GRID_DIMENSIONS.MAX_ROWS,
    pageSizeOptions = DEFAULT_PAGINATION_PARAMS.PAGE_SIZE_OPTIONS,
    isFullHeight = false,
    ...props
}) => {
    const { t } = useTranslation();

    const getHeightDataGrid = () => {
        const { MIN_HEIGHT, HEADER_HEIGHT, ROW_HEIGHT, SCROLLBAR_HEIGHT } = GRID_STYLE_CONFIG.GRID_DIMENSIONS;

        const pinnedBottomRowData = props.pinnedBottomRowData ?? [];
        const pinnedHeight = pinnedBottomRowData.length * ROW_HEIGHT;

        const dataRowCount = Array.isArray(rowData) ? rowData.length : 0;
        const visibleRows = Math.min(dataRowCount, maxRows);

        const hasPinnedRow = pinnedBottomRowData.length > 0;
        const forcedBodyHeight = hasPinnedRow ? 96 : visibleRows * ROW_HEIGHT;

        const calculatedHeight = HEADER_HEIGHT + forcedBodyHeight + pinnedHeight + SCROLLBAR_HEIGHT;

        return Math.max(calculatedHeight, MIN_HEIGHT);
    };

    return (
        <Grid className="h-full">
            <Box
                className={classNames("ag-data-grid", className)}
                sx={{ height: isFullHeight ? "100%" : getHeightDataGrid() }}
            >
                <AgGridReact
                    {...gridOptions}
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    ensureDomOrder
                    rowHeight={GRID_STYLE_CONFIG.GRID_DIMENSIONS.ROW_HEIGHT}
                    headerHeight={GRID_STYLE_CONFIG.GRID_DIMENSIONS.HEADER_HEIGHT}
                    overlayNoRowsTemplate={t(i18n.translationKey.noDataToDisplay)}
                    {...props}
                    pagination={false}
                />
            </Box>
            {props.pagination && totalItems !== undefined && (
                <Box display="flex" justifyContent="end" alignItems="center" mt={2} flexWrap="wrap" gap={2} pb={2}>
                    <Box>
                        <FormControl size="small">
                            <Select
                                value={pageSize}
                                onChange={(e) => {
                                    const newPageSize = Number(e.target.value);
                                    props.onPageChange?.(pageIndex, newPageSize);
                                }}
                            >
                                {pageSizeOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option} / {t(i18n.translationKey.page).toLowerCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Typography fontSize={14}>
                        {totalItems === 0
                            ? t(i18n.translationKey.paginationRange, { from: 0, to: 0, total: 0 })
                            : t(i18n.translationKey.paginationRange, {
                                  from: (pageIndex - 1) * pageSize + 1,
                                  to: Math.min(pageIndex * pageSize, totalItems),
                                  total: totalItems,
                              })}
                    </Typography>
                    <Pagination
                        count={Math.ceil(totalItems / pageSize)}
                        page={pageIndex}
                        onChange={(_, newPage) => {
                            props.onPageChange?.(newPage, pageSize);
                        }}
                        shape="rounded"
                        color="primary"
                        size="small"
                    />
                </Box>
            )}
        </Grid>
    );
};

export default AgDataGrid;
