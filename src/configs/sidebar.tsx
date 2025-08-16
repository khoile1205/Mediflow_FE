import {
    AccessTime,
    AddCircleOutline,
    Apartment,
    Assignment,
    Biotech,
    Business,
    Description,
    EventNote,
    FactCheck,
    Healing,
    Home,
    Inventory,
    Inventory2,
    ListAlt,
    LocalHospital,
    LocalPharmacy,
    MedicalServices,
    MedicationLiquid,
    Paid,
    People,
    PermContactCalendar,
    PriceChange,
    Science,
    Vaccines,
    WarningAmber,
} from "@mui/icons-material";
import { SidebarTabProps } from "~/components/layout/sidebar/tabs/sidebar.tab";
import i18n from "./i18n";
import { routePermissions } from "./route-permission";

const getRoutePermissions = (path: string) => routePermissions[path];

export const sidebarTree: SidebarTabProps[] = [
    {
        icon: <Home />, // Dashboard / Home
        labelKey: i18n.translationKey.home,
        pathName: "/",
    },
    {
        icon: <LocalHospital />, // Reception
        labelKey: i18n.translationKey.reception,
        children: [
            {
                labelKey: i18n.translationKey.vaccination,
                pathName: "/reception/vaccination",
                icon: <MedicalServices />, // More general medical service icon
                ...getRoutePermissions("/reception/vaccination"),
            },
        ],
        ...getRoutePermissions("/reception/vaccination"),
    },
    {
        icon: <EventNote />, // Appointments
        labelKey: i18n.translationKey.appointments,
        children: [
            {
                labelKey: i18n.translationKey.followUpAppointments,
                pathName: "/appointments/follow-up",
                icon: <AccessTime />, // Time-related icon
                ...getRoutePermissions("/appointments/follow-up"),
            },
        ],
        ...getRoutePermissions("/appointments/follow-up"),
    },
    {
        icon: <Paid />, // Finance
        labelKey: i18n.translationKey.hospitalFee,
        pathName: "/finance",
        ...getRoutePermissions("/finance"),
    },
    {
        icon: <Biotech />, // Examination
        labelKey: i18n.translationKey.examination,
        children: [
            {
                labelKey: i18n.translationKey.examination,
                pathName: "/examination",
                icon: <FactCheck />, // Represents checkup/exam
                ...getRoutePermissions("/examination"),
            },
            {
                labelKey: i18n.translationKey.examinationHistory,
                pathName: "/examination/history/patients",
                icon: <AccessTime />, // History icon
                ...getRoutePermissions("/examination/history/patients"),
            },
        ],
        ...getRoutePermissions("/examination"),
    },
    {
        icon: <MedicalServices />, // Services
        labelKey: i18n.translationKey.service,
        children: [
            {
                labelKey: i18n.translationKey.serviceHospital,
                pathName: "/service/hospital-service",
                icon: <LocalHospital />, // Hospital
                ...getRoutePermissions("/service/hospital-service"),
            },
            {
                labelKey: i18n.translationKey.examinationService,
                pathName: "/service/examination-service",
                icon: <Assignment />, // General service task
                ...getRoutePermissions("/service/examination-service"),
            },
        ],
        ...Object.assign(
            {},
            getRoutePermissions("/service/hospital-service"),
            getRoutePermissions("/service/examination-service"),
        ),
    },
    {
        icon: <Vaccines />, // Vaccination
        labelKey: i18n.translationKey.vaccination,
        children: [
            {
                labelKey: i18n.translationKey.vaccination,
                pathName: "/vaccination",
                icon: <Vaccines />,
                ...getRoutePermissions("/vaccination"),
            },
            {
                labelKey: i18n.translationKey.vaccinationHistory,
                pathName: "/vaccination/history",
                icon: <AccessTime />,
                ...getRoutePermissions("/vaccination/history"),
            },
            {
                labelKey: i18n.translationKey.AfterInjection,
                pathName: "/vaccination/post-injection",
                icon: <Healing />,
                ...getRoutePermissions("/vaccination/post-injection"),
            },
        ],
        ...getRoutePermissions("/vaccination"),
    },
    {
        icon: <LocalPharmacy />, // Pharmacy
        labelKey: i18n.translationKey.pharmacy,
        children: [
            {
                labelKey: i18n.translationKey.importPharmacy,
                pathName: "/pharmacy/import",
                icon: <Inventory />, // Inventory for import
                ...getRoutePermissions("/pharmacy/import"),
            },
            {
                labelKey: i18n.translationKey.medicineImportList,
                pathName: "/pharmacy/medicine-import-list",
                icon: <ListAlt />, // List icon
                ...getRoutePermissions("/pharmacy/medicine-import-list"),
            },
            {
                labelKey: i18n.translationKey.expiredMedicine,
                pathName: "/pharmacy/expired-medicine",
                icon: <WarningAmber />,
                ...getRoutePermissions("/pharmacy/expired-medicine"),
            },
            {
                labelKey: i18n.translationKey.expiredReturnForm,
                pathName: "/pharmacy/expired-return-form",
                icon: <MedicationLiquid />,
                ...getRoutePermissions("/pharmacy/expired-return-form"),
            },
            {
                labelKey: i18n.translationKey.inventoryLimitStock,
                pathName: "/pharmacy/limit-stock",
                icon: <Inventory2 />,
                ...getRoutePermissions("/pharmacy/limit-stock"),
            },
        ],
        ...Object.assign(
            {},
            getRoutePermissions("/pharmacy/import"),
            getRoutePermissions("/pharmacy/expired-medicine"),
            getRoutePermissions("/pharmacy/expired-return-form"),
            getRoutePermissions("/pharmacy/limit-stock"),
            getRoutePermissions("/pharmacy/medicine-import-list"),
        ),
    },
    {
        icon: <Science />, // Medicine Management
        labelKey: i18n.translationKey.medicineManagement,
        children: [
            {
                labelKey: i18n.translationKey.medicineManagement,
                pathName: "/medicine/medicine-list",
                icon: <ListAlt />,
                ...getRoutePermissions("/medicine/medicine-list"),
            },
            {
                labelKey: i18n.translationKey.addMedicine,
                pathName: "/medicine/create-medicine",
                icon: <AddCircleOutline />,
                ...getRoutePermissions("/medicine/create-medicine"),
            },
            {
                labelKey: i18n.translationKey.medicineInteractionList,
                pathName: "/medicine/medicine-interaction-list",
                icon: <ListAlt />,
                ...getRoutePermissions("/medicine/medicine-interaction-list"),
            },
            {
                labelKey: i18n.translationKey.createMedicineInteraction,
                pathName: "/medicine/create-medicine-interaction",
                icon: <AddCircleOutline />,
                ...getRoutePermissions("/medicine/create-medicine-interaction"),
            },
            {
                labelKey: i18n.translationKey.medicinePriceList,
                pathName: "/medicine/medicine-price-list",
                icon: <PriceChange />,
                ...getRoutePermissions("/medicine/medicine-price-list"),
            },
            {
                labelKey: i18n.translationKey.createMedicinePrice,
                pathName: "/medicine/create-medicine-price",
                icon: <AddCircleOutline />,
                ...getRoutePermissions("/medicine/create-medicine-price"),
            },
        ],
        ...getRoutePermissions("/medicine/medicine-list"),
    },
    {
        icon: <PermContactCalendar />, // Human Resource
        labelKey: i18n.translationKey.humanResource,
        children: [
            {
                labelKey: i18n.translationKey.staff,
                pathName: "/management/users",
                icon: <People />,
                ...getRoutePermissions("/management/users"),
            },
            {
                labelKey: i18n.translationKey.department,
                pathName: "/management/departments",
                icon: <Apartment />,
                ...getRoutePermissions("/management/departments"),
            },
        ],
        ...getRoutePermissions("/management/users"),
    },
    {
        icon: <Description />, // Contract
        labelKey: i18n.translationKey.contract,
        children: [
            {
                labelKey: i18n.translationKey.supplier,
                pathName: "/contract/supplier",
                icon: <Business />,
                ...getRoutePermissions("/contract/supplier"),
            },
        ],
        ...getRoutePermissions("/contract/supplier"),
    },
];
