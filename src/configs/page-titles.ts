import i18n from "~/configs/i18n";

/**
 * Configuration object để map routes với translation keys tương ứng
 * Sử dụng để hiển thị tên trang trong document title
 */
export const PAGE_TITLES = {
    // Landing/Home
    "/": i18n.translationKey.pageTitle.home,

    // Authentication
    "/login": i18n.translationKey.pageTitle.login,

    // Reception
    "/reception/vaccination": i18n.translationKey.pageTitle.receptionVaccination,

    // Appointments
    "/appointments/follow-up": i18n.translationKey.pageTitle.appointmentsFollowUp,

    // Vaccination
    "/vaccination": i18n.translationKey.pageTitle.vaccination,
    "/vaccination/history": i18n.translationKey.pageTitle.vaccinationHistory,
    "/vaccination/patient-history": i18n.translationKey.pageTitle.patientVaccinationHistory,
    "/vaccination/post-injection": i18n.translationKey.pageTitle.postVaccination,

    // Finance
    "/finance": i18n.translationKey.pageTitle.hospitalFee,

    // Pharmacy
    "/pharmacy/import": i18n.translationKey.pageTitle.pharmacyImport,
    "/pharmacy/expired-medicine": i18n.translationKey.pageTitle.pharmacyExpiredMedicine,
    "/pharmacy/expired-return-form": i18n.translationKey.pageTitle.pharmacyExpiredReturnForm,

    // Medicine Management
    "/medicine/medicine-list": i18n.translationKey.pageTitle.medicineList,
    "/medicine/create-medicine": i18n.translationKey.pageTitle.medicineCreate,
    "/medicine/create-medicine-interaction": i18n.translationKey.pageTitle.medicineInteractionCreate,
    "/medicine/medicine-interaction-list": i18n.translationKey.pageTitle.medicineInteractionList,
    "/medicine/medicine-price-list": i18n.translationKey.pageTitle.medicinePriceList,
    "/medicine/create-medicine-price": i18n.translationKey.pageTitle.medicinePriceCreate,

    // Inventory
    "/inventory/limit-stock": i18n.translationKey.pageTitle.inventoryLimitStock,

    // Contract/Supplier
    "/contract/supplier": i18n.translationKey.pageTitle.supplierManagement,

    // Management
    "/management/users": i18n.translationKey.pageTitle.userManagement,
    "/management/departments": i18n.translationKey.pageTitle.departmentManagement,

    // Examination
    "/examination": i18n.translationKey.pageTitle.examination,
    "/examination/history/patients": i18n.translationKey.pageTitle.examinationHistoryPatients,
    "/examination/history/patient": i18n.translationKey.pageTitle.examinationHistoryPatientDetail,

    // Template pages
    "/template/app": i18n.translationKey.pageTitle.templateApp,
    "/template/form": i18n.translationKey.pageTitle.templateForm,
    "/template/layout": i18n.translationKey.pageTitle.templateLayout,
} as const;

/**
 * Function để lấy translation key của trang dựa trên pathname
 * @param pathname - Đường dẫn hiện tại
 * @returns Translation key tương ứng hoặc undefined nếu không tìm thấy
 */
export const getPageTitleKey = (pathname: string): string | undefined => {
    // Kiểm tra exact match trước
    if (PAGE_TITLES[pathname as keyof typeof PAGE_TITLES]) {
        return PAGE_TITLES[pathname as keyof typeof PAGE_TITLES];
    }

    // Kiểm tra pattern match cho dynamic routes
    if (pathname.startsWith("/examination/history/patient/")) {
        return i18n.translationKey.pageTitle.examinationHistoryPatientDetail;
    }

    return undefined;
};
