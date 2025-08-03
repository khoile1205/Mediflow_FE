import { ColDef, GridApi, GridOptions, GridReadyEvent, RowDataTransaction, themeQuartz } from "ag-grid-community";
import React from "react";
import { GRID_STYLE_CONFIG } from "./config";

// Define interface for hook props
interface UseAgGridProps<T> {
    initialColumnDefs?: ColDef<T>[];
    autoSizeColumns?: boolean;
    suppressRowClickSelection?: boolean;
    rowSelection?: "single" | "multiple";
    defaultSortModel?: Array<{ colId: string; sort: "asc" | "desc" }>;
    onRowDataChanged?: (params: RowDataTransaction) => void;
    isRowSelectable?: (rowData: T, selectedRows: T[]) => boolean;
}

// Define interface for hook return value
interface UseAgGridResult<T> {
    defaultColDef: ColDef<T>;
    gridOptions: GridOptions<T>;
    onGridReady: (params: GridReadyEvent) => void;
    onRowDataChanged: (params: RowDataTransaction) => void;
    gridApi: GridApi<T> | null;
    refreshCells: () => void;
}

export const useAgGrid = <T>({
    initialColumnDefs = [],
    autoSizeColumns = true,
    suppressRowClickSelection = false,
    rowSelection = "single",
    defaultSortModel = [],
    onRowDataChanged,
    isRowSelectable, // ✅ added
}: UseAgGridProps<T>): UseAgGridResult<T> => {
    const gridApi = React.useRef<GridApi | null>(null);

    // Default column definitions
    const defaultColDef = React.useMemo<ColDef<T>>(
        () => ({
            sortable: false,
            filter: false,
            resizable: true,
            cellStyle: {
                height: GRID_STYLE_CONFIG.GRID_DIMENSIONS.ROW_HEIGHT,
            },
            headerClass: "ag-header-cell-center",
            headerStyle: {
                height: GRID_STYLE_CONFIG.GRID_DIMENSIONS.HEADER_HEIGHT,
            },
        }),
        [],
    );

    // Grid options configuration
    const gridOptions = React.useMemo<GridOptions<T>>(
        () => ({
            theme: themeQuartz,
            rowSelection,
            suppressRowClickSelection,
            animateRows: false,
            rowMultiSelectWithClick: rowSelection === "multiple",
            enableCellTextSelection: false,
            suppressContextMenu: false,
            domLayout: "normal",
            suppressMovableColumns: true,
            defaultColDef,
            columnDefs: initialColumnDefs,
            onRowSelected: (event) => {
                if (isRowSelectable && gridApi.current) {
                    const selectedRows = gridApi.current.getSelectedRows();
                    const isAllowed = isRowSelectable(event.data as T, selectedRows);

                    if (!isAllowed && event.node.isSelected()) {
                        event.node.setSelected(false); // auto-deselect invalid row
                    }
                }
            },
        }),
        [rowSelection, suppressRowClickSelection, defaultColDef, initialColumnDefs],
    );

    // Handle grid ready event
    const onGridReady = React.useCallback(
        (params: GridReadyEvent) => {
            if (!gridApi.current) {
                gridApi.current = params.api;
            }

            if (autoSizeColumns) {
                gridApi.current?.sizeColumnsToFit();
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
        gridApi: gridApi.current,
        refreshCells,
    };
};
