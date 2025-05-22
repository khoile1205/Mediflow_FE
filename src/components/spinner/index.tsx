import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Spinner: React.FC = () => {
    return (
        <Box className="flex h-screen w-screen items-center justify-center">
            <CircularProgress className="w-50 h-50" />
        </Box>
    );
};

export default Spinner;
