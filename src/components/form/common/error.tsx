import { FormHelperText } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface FormErrorMessageProps {
    errorMessage?: string;
    label?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ errorMessage, label }) => {
    const { t } = useTranslation();
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
            {t(errorMessage, { field: label })}
        </FormHelperText>
    );
};

export default FormErrorMessage;
