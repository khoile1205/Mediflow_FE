import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { enUS, Localization, viVN } from "@mui/material/locale";
import React from "react";
import { componentsThemeConfig } from "./components";
import { themePalette } from "./palette";
import { I18N_LANGUAGE } from "~/configs/i18n/types";
import { useTranslation } from "react-i18next";

const localeMap: Record<I18N_LANGUAGE, Localization> = {
    vi: viVN,
    en: enUS,
};

export const MaterialUIThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const { i18n } = useTranslation();

    const locale = localeMap[i18n.language as I18N_LANGUAGE] || viVN;

    const theme = React.useMemo(
        () =>
            createTheme(
                {
                    colorSchemes: {
                        light: true,
                        dark: false,
                    },
                    palette: themePalette,
                },
                {
                    components: componentsThemeConfig,
                },
                locale,
            ),
        [i18n.language],
    );

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledEngineProvider>
    );
};
