import { FormHelperText } from "@mui/material";
import React from "react";

interface FormErrorMessageProps {
    errorMessage?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ errorMessage }) => {
    if (!errorMessage) {
        return null;
    }

    return (
        <FormHelperText
            error
            className="ps-2"
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
