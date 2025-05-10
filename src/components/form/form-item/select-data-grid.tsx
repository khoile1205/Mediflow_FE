import { FormControl, FormHelperText, Popover, TextField } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReactProps } from "ag-grid-react";
import React from "react";
import { AgDataGrid, useAgGrid } from "../../ag-grid";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";

export type AgGridDropdownFormItemProps<T extends object = any> = BaseFormItemProps &
    AgGridReactProps & {
        columnDefs: ColDef[];
        rowData: T[];
        colField?: keyof T; // Optional, inferred from rowData
    };

export const AgGridDropdownFormItem = <T extends object = any>({
    name,
    required = false,
    columnDefs,
    rowData,
    colField,
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

    return (
        <ControllerWrapper
            name={name}
            required={required}
            render={({ field, error }) => {
                return (
                    <>
                        <FormControl fullWidth margin="normal" error={!!error} required={required}>
                            <TextField
                                value={field.value}
                                onClick={() => setOpen(true)}
                                inputRef={anchorRef}
                                slotProps={{ input: { readOnly: true } }}
                                size="small"
                            />
                            <FormHelperText>{error}</FormHelperText>
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
                                        maxWidth: "400px",
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
                                onRowClicked={(e) => handleRowClick(e, field.onChange)}
                            />
                        </Popover>
                        <FormErrorMessage errorMessage={error} />
                    </>
                );
            }}
        />
    );
};
