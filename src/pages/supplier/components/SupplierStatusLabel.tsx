import { Chip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { getExpiredDays } from "~/utils/date-time";

interface SupplierExpiredStatusLabelProps {
    expiredAt: Date;
}

export const SupplierStatusLabel: React.FC<SupplierExpiredStatusLabelProps> = ({ expiredAt }) => {
    const { t } = useTranslation();

    const diffInDays = getExpiredDays(new Date(expiredAt));

    if (diffInDays < 0) {
        return (
            <Chip
                label={t(i18n.translationKey.expired)}
                color="error"
                sx={{
                    color: "white",
                    fontWeight: 500,
                }}
            />
        );
    }
    if (diffInDays < 7) {
        return (
            <Chip
                label={t(i18n.translationKey.expiringSoon)}
                color="warning"
                sx={{
                    color: "white",
                    fontWeight: 500,
                }}
            />
        );
    }

    return (
        <Chip
            label={t(i18n.translationKey.active)}
            color="success"
            sx={{
                fontWeight: 500,
            }}
        />
    );
};
