import React from "react";
import { ColDef } from "ag-grid-community";
import { AgDataGrid, useAgGrid } from "../../components/common/ag-grid";

const ExamplePage = () => {
    const agGrid = useAgGrid({});

    const [rowData] = React.useState([
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 },
        { make: "BMW", model: "M3", price: 60000 },
        { make: "Audi", model: "A4", price: 40000 },
    ]);

    const [columnDefs] = React.useState<ColDef[]>([{ field: "make" }, { field: "model" }, { field: "price" }]);

    return (
        <div style={{ width: "100%", height: "100vh", padding: "20px" }}>
            <h1>Ag Grid Example</h1>
            <AgDataGrid {...agGrid} columnDefs={columnDefs} rowData={rowData} />
        </div>
    );
};

export default ExamplePage;
