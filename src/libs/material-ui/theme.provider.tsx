import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { viVN } from "@mui/material/locale";
import React from "react";
import { componentsThemeConfig } from "./components";
import { themePalette } from "./palette";

const theme = createTheme(
    {
        palette: themePalette,
    },
    {
        components: componentsThemeConfig,
    },
    viVN,
);

export const MaterialUIThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledEngineProvider>
    );
};
