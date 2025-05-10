import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Spinner: React.FC = () => {
    return (
        <Box className="flex items-center justify-center h-screen">
            <CircularProgress />
        </Box>
    );
};

export default Spinner;
