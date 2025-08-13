import {
    AccessTime,
    Biotech,
    Business,
    Description,
    EventNote,
    Healing,
    Home,
    Inventory2,
    LocalHospital,
    MedicationLiquid,
    Paid,
    PermContactCalendar,
    Vaccines,
    WarningAmber,
} from "@mui/icons-material";
import { SidebarTabProps } from "~/components/layout/sidebar/tabs/sidebar.tab";
import i18n from "./i18n";
import { ResourceType, routePermissions } from "./route-permission";
import { Role } from "~/constants/roles";

const getRoutePermissions = (path: string) => routePermissions[path];

export const sidebarTree: SidebarTabProps[] = [
    {
        icon: <Home />,
        labelKey: i18n.translationKey.home,
        pathName: "/",
    },
    {
        icon: <LocalHospital />,
        labelKey: i18n.translationKey.reception,
        children: [
            {
                labelKey: i18n.translationKey.vaccination,
                pathName: "/reception/vaccination",
                icon: <Vaccines />,
                ...getRoutePermissions("/reception/vaccination"),
            },
        ],
        ...getRoutePermissions("/reception/vaccination"),
    },
    {
        icon: <EventNote />,
        labelKey: i18n.translationKey.appointments,
        children: [
            {
                labelKey: i18n.translationKey.followUpAppointments,
                pathName: "/appointments/follow-up",
                icon: <AccessTime />,
                ...getRoutePermissions("/appointments/follow-up"),
            },
        ],
        ...getRoutePermissions("/appointments/follow-up"),
    },
    {
        icon: <Paid />,
        labelKey: i18n.translationKey.hospitalFee,
        pathName: "/finance",
        ...getRoutePermissions("/finance"),
    },
    {
        icon: <Vaccines />,
        labelKey: i18n.translationKey.examination,
        children: [
            {
                labelKey: i18n.translationKey.examination,
                pathName: "/examination",
                icon: <Biotech />,
                ...getRoutePermissions("/examination"),
            },
            {
                labelKey: i18n.translationKey.examinationHistory,
                pathName: "/examination/history/patients",
                icon: <Vaccines />,
                ...getRoutePermissions("/examination/history/patients"),
            },
        ],
        ...getRoutePermissions("/examination"),
    },
    {
        icon: <LocalHospital />,
        labelKey: i18n.translationKey.service,
        children: [
            {
                labelKey: i18n.translationKey.serviceHospital,
                pathName: "/service/hospital-service",
                icon: <LocalHospital />,
                requiredPermissions: [ResourceType.VaccinationReception],
                requiredRoles: [
                    Role.Administrator,
                    Role.Doctor,
                    Role.Nurse,
                    Role.Receptionist,
                    Role.LaboratoryStaff,
                    Role.ImagingTechnician,
                ],
            },
            {
                labelKey: i18n.translationKey.examinationService,
                pathName: "/service/examination-service",
                icon: <Biotech />,
                requiredPermissions: [ResourceType.VaccinationReception],
                requiredRoles: [
                    Role.Administrator,
                    Role.Doctor,
                    Role.Nurse,
                    Role.Receptionist,
                    Role.LaboratoryStaff,
                    Role.ImagingTechnician,
                ],
            },
        ],
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [
            Role.Administrator,
            Role.Doctor,
            Role.Nurse,
            Role.Receptionist,
            Role.LaboratoryStaff,
            Role.ImagingTechnician,
        ],
    },
    {
        icon: <Vaccines />,
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
        icon: <Inventory2 />,
        labelKey: i18n.translationKey.pharmacy,
        children: [
            {
                labelKey: i18n.translationKey.importPharmacy,
                pathName: "/pharmacy/import",
                icon: <Inventory2 />,
                ...getRoutePermissions("/pharmacy/import"),
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
        ],
        ...Object.assign(
            {},
            getRoutePermissions("/pharmacy/import"),
            getRoutePermissions("/pharmacy/expired-medicine"),
            getRoutePermissions("/pharmacy/expired-return-form"),
        ),
    },
    {
        icon: <Inventory2 />,
        labelKey: i18n.translationKey.medicineManagement,
        children: [
            {
                labelKey: i18n.translationKey.medicineManagement,
                pathName: "/medicine/medicine-list",
                icon: <Inventory2 />,
                ...getRoutePermissions("/medicine/medicine-list"),
            },
            {
                labelKey: i18n.translationKey.addMedicine,
                pathName: "/medicine/create-medicine",
                icon: <Inventory2 />,
                ...getRoutePermissions("/medicine/create-medicine"),
            },
            {
                labelKey: i18n.translationKey.medicineInteractionList,
                pathName: "/medicine/medicine-interaction-list",
                icon: <Inventory2 />,
                ...getRoutePermissions("/medicine/medicine-interaction-list"),
            },
            {
                labelKey: i18n.translationKey.createMedicineInteraction,
                pathName: "/medicine/create-medicine-interaction",
                icon: <Inventory2 />,
                ...getRoutePermissions("/medicine/create-medicine-interaction"),
            },
            {
                labelKey: i18n.translationKey.medicinePriceList,
                pathName: "/medicine/medicine-price-list",
                icon: <Inventory2 />,
                ...getRoutePermissions("/medicine/medicine-price-list"),
            },
            {
                labelKey: i18n.translationKey.createMedicinePrice,
                pathName: "/medicine/create-medicine-price",
                icon: <Inventory2 />,
                ...getRoutePermissions("/medicine/create-medicine-price"),
            },
        ],
        ...getRoutePermissions("/medicine/medicine-list"),
    },
    {
        icon: <Inventory2 />,
        labelKey: i18n.translationKey.inventoryManagement,
        children: [
            {
                labelKey: i18n.translationKey.inventoryLimitStock,
                pathName: "/inventory/limit-stock",
                icon: <Inventory2 />,
                ...getRoutePermissions("/inventory/limit-stock"),
            },
        ],
        ...getRoutePermissions("/inventory/limit-stock"),
    },
    {
        icon: <PermContactCalendar />,
        labelKey: i18n.translationKey.humanResource,
        children: [
            {
                labelKey: i18n.translationKey.staff,
                pathName: "/management/users",
                ...getRoutePermissions("/management/users"),
            },
            {
                labelKey: i18n.translationKey.department,
                pathName: "/management/departments",
                ...getRoutePermissions("/management/departments"),
            },
        ],
        ...getRoutePermissions("/management/users"),
    },
    {
        icon: <Description />,
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
