import { FormControl, IconButton, InputAdornment, Popover, TextField } from "@mui/material";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import { AgGridReactProps } from "ag-grid-react";
import React from "react";
import { AgDataGrid, useAgGrid } from "../../common/ag-grid";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import SearchBox from "~/components/common/search-box";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { useFormContext } from "react-hook-form";
import { HighlightOff } from "@mui/icons-material";

export type AgGridDropdownFormItemProps<T extends object = any> = BaseFormItemProps &
    AgGridReactProps &
    Partial<React.ComponentProps<typeof AgDataGrid>> & {
        columnDefs: ColDef<T>[];
        rowData: T[];
        valueField?: keyof T;
        displayField?: keyof T;
        onSearch?: (searchValue: string) => void;
    };

export const AgGridDropdownFormItem = <T extends object>({
    name,
    required = false,
    columnDefs,
    rowData,
    valueField,
    displayField,
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
    const { t } = useTranslation();
    const formContext = useFormContext();

    const agGrid = useAgGrid<T>({
        autoSizeColumns: true,
    });
    const anchorRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<T | null>(null);

    // Handle row click with optional valueField
    const handleRowClick = React.useCallback(
        (e: RowClickedEvent<T>, onChange: (value: T[keyof T] | T) => void) => {
            if (!e.data) {
                setSelectedRow(null);
                onChange(null);
                return;
            }

            setSelectedRow(e.data);
            const value = valueField ? e.data[valueField] : e.data;
            onChange(value);
            setOpen(false);
        },
        [valueField],
    );

    const handlePageChange = React.useCallback(
        (newPageIndex: number, newPageSize: number) => {
            if (newPageSize !== pageSize) {
                // Reset to the first page if page size changes
                newPageIndex = 1;
            }
            onPageChange?.(newPageIndex, newPageSize);
        },
        [onPageChange],
    );

    const handleSearch = React.useCallback((searchValue: string) => {
        if (props.onSearch) {
            props.onSearch(searchValue);
        }
    }, []);

    React.useEffect(() => {
        if (!selectedRow) return;

        if (!formContext.watch(name)) {
            setSelectedRow(null);
        }
    }, [formContext.watch(name)]);

    React.useEffect(() => {
        if (!selectedRow) return;

        setSelectedRow(null);
    }, [rowData]);
    return (
        <ControllerWrapper
            name={name}
            required={required}
            render={({ field, error }) => {
                const displayText = displayField && selectedRow ? selectedRow[displayField] : (field.value ?? "");

                const onClear = () => {
                    field.onChange(null);
                    setSelectedRow(null);
                    setOpen(false);
                };

                return (
                    <>
                        <FormControl fullWidth margin="normal" error={!!error} required={required}>
                            <TextField
                                {...field}
                                value={displayText}
                                onClick={() => setOpen(true)}
                                error={!!error}
                                inputRef={anchorRef}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        endAdornment: field.value ? (
                                            <InputAdornment position="end">
                                                <IconButton aria-label="clear input" onClick={onClear} edge="end">
                                                    <HighlightOff />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    },
                                }}
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
                                        maxWidth: `${columnDefs.reduce((acc, col) => acc + ((col as ColDef).width ?? 200), 0)}px`,
                                        overflowY: "auto",
                                    },
                                },
                            }}
                        >
                            {props.onSearch && (
                                <SearchBox
                                    size="small"
                                    placeholder={t(i18n.translationKey.search)}
                                    onChange={handleSearch}
                                    sx={{ p: 1 }}
                                />
                            )}

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
