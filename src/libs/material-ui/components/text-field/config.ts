import type { Components } from "@mui/material/styles";

export const textFieldTheme: Components = {
    MuiTextField: {
        styleOverrides: {
            root: {
                marginTop: 0,
                borderRadius: "8px",
            },
        },
        defaultProps: {
            slotProps: {
                inputLabel: {
                    shrink: true,
                },
            },
        },
    },
    MuiFilledInput: {
        styleOverrides: {
            root: {
                backgroundColor: "F2F2F2",
                "&:before": {
                    borderBottom: "none",
                },
                "&:after": {
                    borderBottom: "none",
                },
                "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "none",
                },
                "&.Mui-focused": {
                    backgroundColor: "#F0F0F0",
                },
            },
        },
    },
};
