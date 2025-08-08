import { Box } from "@mui/material";
import React from "react";
import { Sidebar } from "~/components/layout/sidebar";

const TemplateLayout: React.FC = () => {
    return (
        <Box className="flex h-screen w-screen">
            <Sidebar />
        </Box>
    );
};

export default TemplateLayout;
