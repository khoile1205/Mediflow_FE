import { Box } from "@mui/material";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import classNames from "classnames";
import React from "react";
import { AG_GRID_STRING } from "~/constants/app.string";
import "./ag-grid.scss";
import { GRID_STYLE_CONFIG } from "./config";
import { useAgGrid } from "./hooks";

type AgDataGridProps = Omit<AgGridReactProps, "columnDefs" | "rowData"> & {
    columnDefs: NonNullable<AgGridReactProps["columnDefs"]>;
    rowData: NonNullable<AgGridReactProps["rowData"]>;
} & Pick<ReturnType<typeof useAgGrid>, "onGridReady">;

const AgDataGrid: React.FC<AgDataGridProps> = ({
    columnDefs,
    rowData,
    defaultColDef,
    onGridReady,
    gridOptions,
    className = "",
    ...props
}) => {
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
                overlayNoRowsTemplate={AG_GRID_STRING.NO_ROWS_TO_SHOW}
                {...props}
            />
        </Box>
    );
};

export default AgDataGrid;
