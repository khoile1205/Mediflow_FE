import { Box, Button, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";

const TemplateForm = () => {
    const form = useForm();

    const handleSubmit = (data: any) => {
        console.log("Form submitted with data:", data);
    };

    const [rowData] = React.useState([
        { make: "Toyota", model: "Camry", year: 2020, color: "Red", price: 30000 },
        { make: "Ford", model: "Focus", year: 2019, color: "Blue", price: 25000 },
        { make: "Honda", model: "Civic", year: 2021, color: "Black", price: 27000 },
        { make: "Tesla", model: "Model 3", year: 2022, color: "White", price: 45000 },
        { make: "BMW", model: "X5", year: 2020, color: "Gray", price: 60000 },
        { make: "Audi", model: "Q7", year: 2021, color: "Black", price: 65000 },
        { make: "Mercedes", model: "C300", year: 2022, color: "Silver", price: 70000 },
        { make: "Hyundai", model: "Elantra", year: 2018, color: "Blue", price: 20000 },
        { make: "Kia", model: "Sorento", year: 2019, color: "Red", price: 24000 },
        { make: "Chevrolet", model: "Malibu", year: 2020, color: "White", price: 22000 },
    ]);

    const [columnDefs] = React.useState<ColDef[]>([
        { field: "make", headerName: "Make" },
        { field: "model", headerName: "Model" },
        { field: "year", headerName: "Year" },
        { field: "color", headerName: "Color" },
        {
            field: "price",
            headerName: "Price",
            valueFormatter: (params) => `$${params.value.toLocaleString()}`,
        },
    ]);

    return (
        <Box maxWidth="md" mx="auto" py={4}>
            <Typography variant="h5" mb={3}>
                Template Form
            </Typography>

            <DynamicForm form={form} onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <FormItem
                        render="text-input"
                        name="username"
                        label="Username"
                        minLength={3}
                        required
                        variant="filled"
                        size="small"
                    />
                    <FormItem
                        render="data-grid"
                        name="carDetails"
                        label="Car Details"
                        columnDefs={columnDefs}
                        rowData={rowData}
                        displayField="make"
                    />
                    <FormItem
                        render="checkbox-group"
                        name="preferences"
                        label="Preferences"
                        options={[
                            { label: "Option 1", value: "option1" },
                            { label: "Option 2", value: "option2" },
                        ]}
                    />
                    <FormItem
                        render="select"
                        name="dropdownSelection"
                        label="Select Option"
                        size="small"
                        required
                        options={[
                            { label: "Option 1", value: "option1" },
                            { label: "Option 2", value: "option2" },
                        ]}
                    />
                    <FormItem render="date-picker" name="selectedDate" label="Date Picker" required />
                    <FormItem render="switch" name="toggleSwitch" label="Switch" defaultValue={true} />
                    <FormItem
                        render="radio-group"
                        name="radioOptions"
                        label="Radio Group"
                        required
                        direction="horizontal"
                        options={[
                            { label: "Option 1", value: "option1" },
                            { label: "Option 2", value: "option2" },
                        ]}
                        defaultValue="option1"
                    />
                    <FormItem
                        render="text-area"
                        name="description"
                        label="Description"
                        placeholder="Enter your text here"
                        defaultValue="This is a text area"
                        rows={4}
                        maxLength={200}
                    />
                    <FormItem
                        render="input-number"
                        name="numericInput"
                        label="Input Number"
                        placeholder="Enter a number"
                        defaultValue={42}
                        maxNumber={100}
                        required
                    />
                    <FormItem
                        render="date-range-picker"
                        name="dateRange"
                        label="Date Range Picker"
                        defaultValue={{ startDate: new Date(), endDate: new Date() }}
                        required
                    />
                    <Box textAlign="right">
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </DynamicForm>
        </Box>
    );
};

export default TemplateForm;
