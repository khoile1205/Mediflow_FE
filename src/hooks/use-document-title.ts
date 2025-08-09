import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook để cập nhật document title
 * @param title - Tiêu đề mới cho trang
 */
export const useDocumentTitle = (title?: string) => {
    useEffect(() => {
        if (title) {
            const baseTitle = "MediFlow";
            document.title = `${title} | ${baseTitle}`;
        }

        // Cleanup function để reset về title gốc khi component unmount
        return () => {
            document.title = "MediFlow";
        };
    }, [title]);
};

/**
 * Hook để set title manually từ trong component
 * @param titleOrKey - Tiêu đề hoặc translation key
 * @param isTranslationKey - Có phải translation key không (default: false)
 */
export const useSetPageTitle = (titleOrKey: string, isTranslationKey: boolean = false) => {
    const { t } = useTranslation();

    useEffect(() => {
        const baseTitle = "MediFlow";
        const title = isTranslationKey ? t(titleOrKey) : titleOrKey;
        const previousTitle = document.title;
        document.title = `${title} | ${baseTitle}`;

        // Cleanup để restore title trước đó
        return () => {
            document.title = previousTitle;
        };
    }, [titleOrKey, isTranslationKey, t]);
};
