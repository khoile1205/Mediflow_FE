import { FormHelperText } from "@mui/material";
import React from "react";

interface FormErrorMessageProps {
    error?: string;
    errorMessage?: string;
    errorType?: "error" | "warning" | "info";
    errorPosition?: "top" | "bottom" | "left" | "right";
    errorStyle?: React.CSSProperties;
    errorClassName?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ errorMessage }) => {
    if (!errorMessage) {
        return null;
    }

    return (
        <FormHelperText
            error
            className="ps-4 pt-1"
            sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                display: "block",
            }}
        >
            {errorMessage}
        </FormHelperText>
    );
};

export default FormErrorMessage;
