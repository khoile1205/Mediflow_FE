import React from "react";
import { Button, Typography, ButtonProps } from "@mui/material";

interface ActionButtonProps extends ButtonProps {
    label: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, ...props }) => (
    <Button
        sx={{
            flex: 1,
            borderRadius: 2,
            boxShadow: 3,
        }}
        {...props}
    >
        <Typography className="py-2 font-semibold">{label}</Typography>
    </Button>
);
