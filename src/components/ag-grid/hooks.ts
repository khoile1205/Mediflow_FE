import { ColDef, GridApi, GridOptions, GridReadyEvent, RowDataTransaction, themeQuartz } from "ag-grid-community";
import React from "react";

// Define interface for hook props
interface UseAgGridProps<T> {
    initialColumnDefs?: ColDef<T>[];
    autoSizeColumns?: boolean;
    suppressRowClickSelection?: boolean;
    rowSelection?: "single" | "multiple";
    defaultSortModel?: Array<{ colId: string; sort: "asc" | "desc" }>;
    onRowDataChanged?: (params: RowDataTransaction) => void;
}

// Define interface for hook return value
interface UseAgGridResult<T> {
    defaultColDef: ColDef<T>;
    gridOptions: GridOptions;
    onGridReady: (params: GridReadyEvent) => void;
    onRowDataChanged: (params: RowDataTransaction) => void;
    gridApi: React.RefObject<GridApi | null>;
    refreshCells: () => void;
}

export const useAgGrid = <T>({
    initialColumnDefs = [],
    autoSizeColumns = true,
    suppressRowClickSelection = false,
    rowSelection = "single",
    defaultSortModel = [],
    onRowDataChanged,
}: UseAgGridProps<T>): UseAgGridResult<T> => {
    const gridApi = React.useRef<GridApi | null>(null);

    // Default column definitions
    const defaultColDef = React.useMemo<ColDef<T>>(
        () => ({
            sortable: false,
            filter: false,
            resizable: true,
            flex: 1,
            minWidth: 100,
            headerClass: "ag-header-cell-center",
        }),
        [],
    );

    // Grid options configuration
    const gridOptions = React.useMemo<GridOptions<T>>(
        () => ({
            theme: themeQuartz,
            rowSelection,
            suppressRowClickSelection,
            animateRows: true,
            rowMultiSelectWithClick: rowSelection === "multiple",
            enableCellTextSelection: true,
            suppressContextMenu: false,
            domLayout: "autoHeight",
            suppressMovableColumns: true,
            defaultColDef,
            columnDefs: initialColumnDefs,
        }),
        [rowSelection, suppressRowClickSelection, defaultColDef, initialColumnDefs],
    );

    // Handle grid ready event
    const onGridReady = React.useCallback(
        (params: GridReadyEvent) => {
            gridApi.current = params.api;

            // params.api.sizeColumnsToFit();
            if (autoSizeColumns) {
                // params.api.autoSizeAllColumns();
            }

            // Apply default sort if provided
            if (defaultSortModel.length > 0) {
                params.api.applyColumnState({
                    state: defaultSortModel.map((model) => ({
                        colId: model.colId,
                        sort: model.sort,
                    })),
                });
            }
        },
        [autoSizeColumns, defaultSortModel],
    );

    // Handle row data changed
    const handleRowDataChanged = React.useCallback(
        (params: RowDataTransaction) => {
            onRowDataChanged?.(params);
        },
        [onRowDataChanged],
    );

    // Refresh cells
    const refreshCells = React.useCallback(() => {
        if (gridApi.current) {
            gridApi.current.refreshCells({ force: true });
        }
    }, []);

    return {
        defaultColDef,
        gridOptions,
        onGridReady,
        onRowDataChanged: handleRowDataChanged,
        gridApi,
        refreshCells,
    };
};
