import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { useQueryOverview } from "~/services/management/statistic/hooks/queries";

export const OverviewManagement: React.FC = () => {
    const { t } = useTranslation();

    const {
        data: { statisticOverview },
    } = useQueryOverview();

    return (
        <div>
            <h1>{t(i18n.translationKey.overview)}</h1>
        </div>
    );
};
