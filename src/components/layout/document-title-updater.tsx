import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "~/hooks";
import { getPageTitleKey } from "~/configs/page-titles";

interface DocumentTitleUpdaterProps {
    children: React.ReactNode;
}

/**
 * Component để tự động cập nhật document title dựa trên route hiện tại
 */
export const DocumentTitleUpdater: React.FC<DocumentTitleUpdaterProps> = ({ children }) => {
    const location = useLocation();
    const { t } = useTranslation();
    const pageTitleKey = getPageTitleKey(location.pathname);

    const pageTitle = pageTitleKey ? t(pageTitleKey) : undefined;

    useDocumentTitle(pageTitle);

    return <>{children}</>;
};
