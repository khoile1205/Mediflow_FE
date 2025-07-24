import {
    AccessTime,
    Biotech,
    EventNote,
    Healing,
    Home,
    Inventory2,
    LocalHospital,
    Paid,
    PermContactCalendar,
    Vaccines,
} from "@mui/icons-material";
import { SidebarTabProps } from "~/components/layout/sidebar/tabs/sidebar.tab";
import { Role } from "~/constants/roles";
import i18n from "./i18n";
import { ResourceType } from "./route-permission";

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
            Role.Accountant,
        ],
    },
    {
        icon: <EventNote />,
        labelKey: i18n.translationKey.appointments,
        children: [
            {
                labelKey: i18n.translationKey.followUpAppointments,
                pathName: "/appointments/follow-up",
                icon: <AccessTime />,
                requiredPermissions: [ResourceType.Appointments],
                requiredRoles: [Role.Administrator, Role.Doctor, Role.Receptionist],
            },
        ],
        requiredPermissions: [ResourceType.Appointments],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.Receptionist],
    },
    {
        icon: <Paid />,
        labelKey: i18n.translationKey.hospitalFee,
        pathName: "/finance",
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Nurse, Role.Accountant],
    },
    {
        icon: <Vaccines />,
        labelKey: i18n.translationKey.examination,
        children: [
            {
                labelKey: i18n.translationKey.examination,
                pathName: "/examination",
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
            {
                labelKey: i18n.translationKey.examinationHistory,
                pathName: "/examination/history/patients",
                icon: <Vaccines />,
                requiredPermissions: [ResourceType.VaccinationReception],
                requiredRoles: [Role.Administrator, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician],
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
                labelKey: i18n.translationKey.vaccinationHistory,
                pathName: "/vaccination/history",
                icon: <AccessTime />,
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
                labelKey: i18n.translationKey.AfterInjection,
                pathName: "/vaccination/post-injection",
                icon: <Healing />,
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
        icon: <Inventory2 />,
        labelKey: i18n.translationKey.pharmacy,
        children: [
            {
                labelKey: i18n.translationKey.importPharmacy,
                pathName: "/pharmacy/import",
                icon: <Inventory2 />,
                requiredPermissions: [ResourceType.Inventory],
                requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
            },
        ],
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    {
        icon: <PermContactCalendar />,
        labelKey: i18n.translationKey.humanResource,
        children: [
            {
                labelKey: i18n.translationKey.staff,
                pathName: "/management/users",
                requiredPermissions: [ResourceType.Management],
                requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
            },
            {
                labelKey: i18n.translationKey.department,
                pathName: "/management/departments",
                requiredPermissions: [ResourceType.Management],
                requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
            },
        ],
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
];
