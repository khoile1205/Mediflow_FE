import React from "react";
import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { MedicineBatchExpiredFormStatus } from "~/constants/enums";

interface ExpiredReturnStatusProps {
    status: MedicineBatchExpiredFormStatus;
}

export const ExpiredReturnStatus: React.FC<ExpiredReturnStatusProps> = ({ status }) => {
    const { t } = useTranslation();

    switch (status) {
        case MedicineBatchExpiredFormStatus.PENDING: // Pending
            return <Chip label={t(i18n.translationKey.pending)} color="warning" variant="filled" size="small" />;
        case MedicineBatchExpiredFormStatus.APPROVED: // Approved
            return <Chip label={t(i18n.translationKey.approved)} color="success" variant="filled" size="small" />;
        case MedicineBatchExpiredFormStatus.REJECTED: // Rejected
            return <Chip label={t(i18n.translationKey.rejected)} color="error" variant="filled" size="small" />;
    }
};
