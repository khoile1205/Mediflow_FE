import { FormControl, Popover, TextField } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReactProps } from "ag-grid-react";
import React from "react";
import { AgDataGrid, useAgGrid } from "../../common/ag-grid";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";

export type AgGridDropdownFormItemProps<T extends object = any> = BaseFormItemProps &
    AgGridReactProps &
    Partial<React.ComponentProps<typeof AgDataGrid>> & {
        columnDefs: ColDef<T>[];
        rowData: T[];
        colField?: keyof T;
    };

export const AgGridDropdownFormItem = <T extends object>({
    name,
    required = false,
    columnDefs,
    rowData,
    colField,
    fullWidth = true,
    disabled = false,
    placeholder = "",
    label = "",
    totalItems = 0,
    pageSize = 10,
    pageIndex = 1,
    onPageChange,
    ...props
}: AgGridDropdownFormItemProps<T>) => {
    const agGrid = useAgGrid<T>({});

    const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);

    // Handle row click with optional colField
    const handleRowClick = React.useCallback(
        (e: { data: T | undefined }, onChange: (value: any) => void) => {
            if (e.data) {
                const value = colField ? e.data[colField] : e.data;
                onChange(value);
                setOpen(false);
            }
        },
        [colField],
    );

    const handlePageChange = React.useCallback(
        (newPageIndex: number, newPageSize: number) => {
            if (onPageChange) {
                onPageChange?.(newPageIndex, newPageSize);
            }
        },
        [onPageChange],
    );

    return (
        <ControllerWrapper
            name={name}
            required={required}
            render={({ field, error }) => {
                return (
                    <>
                        <FormControl fullWidth margin="normal" error={!!error} required={required}>
                            <TextField
                                {...field}
                                value={field.value ?? ""}
                                onClick={() => setOpen(true)}
                                error={!!error}
                                inputRef={anchorRef}
                                slotProps={{ input: { readOnly: true } }}
                                size="small"
                                label={label}
                                disabled={disabled}
                                placeholder={placeholder}
                                fullWidth={fullWidth}
                                required={required}
                            />
                            <FormErrorMessage errorMessage={error} label={label} />
                        </FormControl>
                        <Popover
                            open={open}
                            anchorEl={anchorRef.current}
                            onClose={() => setOpen(false)}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        width: "100%",
                                        maxWidth: "600px",
                                        height: "100%",
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                    },
                                },
                            }}
                        >
                            <AgDataGrid
                                {...agGrid}
                                {...props}
                                columnDefs={columnDefs}
                                rowData={rowData}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                                onPageChange={handlePageChange}
                                onRowClicked={(e) => handleRowClick(e, field.onChange)}
                            />
                        </Popover>
                    </>
                );
            }}
        />
    );
};
