import { createTheme, ThemeProvider } from "@mui/material";
import { viVN } from "@mui/material/locale";
import React from "react";
import { textFieldTheme } from "./text-field/config";

const theme = createTheme(
    {
        components: {
            ...textFieldTheme,
        },
    },
    viVN,
);

export const MaterialUIThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
