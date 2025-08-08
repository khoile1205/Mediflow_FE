import type { Components } from "@mui/material/styles";

export const buttonThemeConfig: Components = {
    MuiButtonBase: {
        styleOverrides: {
            root: {
                borderRadius: "6px",
                textTransform: "none",

                "&:focus": {
                    outline: "none",
                },
                "&:focus-visible": {
                    outline: "none",
                    boxShadow: "none",
                },
            },
        },
    },
    MuiButton: {
        defaultProps: {
            variant: "outlined",
        },
        styleOverrides: {
            root: {
                textTransform: "none",
            },
        },
    },
};
