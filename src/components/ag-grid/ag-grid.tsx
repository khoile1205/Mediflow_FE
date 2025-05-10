import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import React from "react";
import { useAgGrid } from "./hooks";
import "./ag-grid.scss";

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
    ...props
}) => {
    return (
        <AgGridReact
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            rowData={rowData}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            {...props}
        />
    );
};

export default AgDataGrid;
