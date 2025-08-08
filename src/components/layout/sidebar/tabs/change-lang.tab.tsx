import React from "react";
import { Box, Popover, PopoverProps, Typography } from "@mui/material";
import { Language } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SidebarTabItem } from "./sidebar.tab";
import USFlag from "~/assets/images/flag_of_the_united_states.svg";
import VNFlag from "~/assets/images/flag_of_vietnam.svg";
import { I18N_LANGUAGE } from "~/configs/i18n/types";
import i18n from "~/configs/i18n";

interface ChangeLanguageTabProps {
    popOverAnchorOrigin?: PopoverProps["anchorOrigin"];
}

export const ChangeLanguageTab: React.FC<ChangeLanguageTabProps> = ({
    popOverAnchorOrigin = { vertical: "center", horizontal: "center" },
}) => {
    const { i18n: reactI18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeLanguage = (lang: I18N_LANGUAGE) => {
        reactI18n.changeLanguage(lang);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <Box>
            <SidebarTabItem
                icon={<Language />}
                labelKey={
                    reactI18n.language === I18N_LANGUAGE.VIETNAMESE
                        ? i18n.translationKey.vietnamese
                        : i18n.translationKey.english
                }
                onClick={handleOpen}
            />

            <Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={popOverAnchorOrigin}>
                <Box sx={{ p: 1, minWidth: 120 }}>
                    <Box
                        className="flex cursor-pointer items-center gap-x-3 p-2"
                        onClick={() => handleChangeLanguage(I18N_LANGUAGE.VIETNAMESE)}
                    >
                        <img src={VNFlag} alt="" className="h-6 w-6" />
                        <Typography variant="body2" sx={{ cursor: "pointer", py: 0.5 }}>
                            Tiếng Việt
                        </Typography>
                    </Box>
                    <Box
                        className="flex cursor-pointer items-center gap-x-3 p-2"
                        onClick={() => handleChangeLanguage(I18N_LANGUAGE.ENGLISH)}
                    >
                        <img src={USFlag} alt="" className="h-6 w-6" />
                        <Typography variant="body2" sx={{ cursor: "pointer", py: 0.5 }}>
                            English
                        </Typography>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
};
