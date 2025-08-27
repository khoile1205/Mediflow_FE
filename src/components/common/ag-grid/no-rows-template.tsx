import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";

const NoRowsOverlay: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div style={{ padding: "16px", textAlign: "center", color: "#999" }}>
            {t(i18n.translationKey.noDataToDisplay)}
        </div>
    );
};

export default NoRowsOverlay;
