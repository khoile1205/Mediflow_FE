import {
    AccessTime,
    EventNote,
    ExitToApp,
    Healing,
    Home,
    Inventory2,
    LocalHospital,
    Paid,
    PermContactCalendar,
    Vaccines,
} from "@mui/icons-material";
import { Avatar, Box, Drawer, Stack, Typography } from "@mui/material";
import React from "react";
import AppLogo from "~/assets/images/app_logo.png";
import i18n from "~/configs/i18n";
import { ResourceType } from "~/configs/route-permission";
import { Role } from "~/constants/roles";
import { useAuth } from "~/contexts/auth.context";
import { hasPermission } from "~/utils/permission.utils";
import { ChangeLanguageTab } from "./tabs/change-lang.tab";
import { SidebarTabItem, SidebarTabProps } from "./tabs/sidebar.tab";

const sidebarTree: SidebarTabProps[] = [
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
                labelKey: i18n.translationKey.authorization,
                pathName: "/management/authorization",
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

export const Sidebar: React.FC = () => {
    const { logout, userPermission } = useAuth();

    const filteredSidebarTree = React.useMemo(() => {
        const filterTree = (items: SidebarTabProps[]): SidebarTabProps[] =>
            items
                .filter((item) => {
                    if (!item.requiredPermissions) return true;
                    return hasPermission({
                        resourceTypes: userPermission?.resourceTypes,
                        requiredPermissions: item.requiredPermissions,
                        userRoles: userPermission?.roles || [],
                        requiredRoles: item.requiredRoles,
                        accessModifier: userPermission?.resourceTypes[item.requiredPermissions[0]],
                    });
                })
                .map((item) => ({
                    ...item,
                    children: item.children ? filterTree(item.children) : undefined,
                }));

        return filterTree(sidebarTree);
    }, [userPermission]);

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: "15%",
                minWidth: "250px",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: "15%",
                    minWidth: "250px",
                    boxSizing: "border-box",
                    pt: 2,
                },
            }}
        >
            <Stack direction="column" spacing={1.5} sx={{ minHeight: "100%" }}>
                <Box className="flex items-center px-6 py-2">
                    <Avatar src={AppLogo}>H</Avatar>
                    <Typography className="ml-3 truncate text-[16px]">MediFlows</Typography>
                </Box>
                <Box className="no-scrollbar mx-6 w-full flex-1 overflow-y-auto overflow-x-hidden pb-4 pt-2">
                    {filteredSidebarTree.map((sideBar, idx) => (
                        <SidebarTabItem key={sideBar.labelKey + idx} {...sideBar} level={0} />
                    ))}
                </Box>
                <Stack direction={"column"} sx={{ flexShrink: 0 }} className="border-t border-gray-300 p-2">
                    <ChangeLanguageTab />
                    <SidebarTabItem icon={<ExitToApp />} labelKey={i18n.translationKey.signOut} onClick={logout} />
                </Stack>
            </Stack>
        </Drawer>
    );
};
