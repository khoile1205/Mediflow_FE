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
    Person,
    Vaccines,
} from "@mui/icons-material";
import { Avatar, Box, Drawer, Stack, Typography } from "@mui/material";
import React from "react";
import AppLogo from "~/assets/images/app_logo.png";
import i18n from "~/configs/i18n";
import { ResourceType } from "~/configs/route-permission";
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
            },
            {
                labelKey: i18n.translationKey.patient,
                pathName: "/reception/patient",
                icon: <Person />,
            },
        ],
        requiredPermissions: [ResourceType.VaccinationReception],
    },
    {
        icon: <EventNote />,
        labelKey: i18n.translationKey.appointments,
        children: [
            {
                labelKey: i18n.translationKey.followUpAppointments,
                pathName: "/appointments/follow-up",
                icon: <AccessTime />,
            },
        ],
        requiredPermissions: [ResourceType.Appointments],
    },
    {
        icon: <Paid />,
        labelKey: i18n.translationKey.hospitalFee,
        pathName: "/finance",
        requiredPermissions: [ResourceType.VaccinationReception],
    },
    {
        icon: <Vaccines />,
        labelKey: i18n.translationKey.vaccination,
        children: [
            {
                labelKey: i18n.translationKey.vaccination,
                pathName: "/vaccination",
                icon: <Vaccines />,
            },
            {
                labelKey: i18n.translationKey.vaccinationHistory,
                pathName: "/vaccination/history",
                icon: <AccessTime />,
            },
            {
                labelKey: i18n.translationKey.AfterInjection,
                pathName: "/vaccination/post-injection",
                icon: <Healing />,
            },
        ],
        requiredPermissions: [ResourceType.VaccinationReception],
    },
    {
        icon: <Inventory2 />,
        labelKey: i18n.translationKey.pharmacy,
        children: [
            {
                labelKey: i18n.translationKey.importPharmacy,
                pathName: "/pharmacy/import",
                icon: <Inventory2 />,
            },
        ],
        requiredPermissions: [ResourceType.Inventory],
    },
    {
        icon: <PermContactCalendar />,
        labelKey: i18n.translationKey.humanResource,
        children: [
            {
                labelKey: i18n.translationKey.staff,
                pathName: "/management/users",
            },
            {
                labelKey: i18n.translationKey.authorization,
                pathName: "/management/authorization",
            },
            {
                labelKey: i18n.translationKey.department,
                pathName: "/management/departments",
            },
        ],
        requiredPermissions: [ResourceType.Management],
    },
];

export const Sidebar: React.FC = () => {
    const { logout, userPermission } = useAuth();

    const filteredSidebarTree = React.useMemo(() => {
        const filterTree = (items: SidebarTabProps[]): SidebarTabProps[] =>
            items
                .filter((item) => {
                    if (!item.requiredPermissions) return true;
                    return hasPermission(userPermission?.resourceTypes || {}, item.requiredPermissions);
                })
                .map((item) => ({
                    ...item,
                    children: item.children ? filterTree(item.children) : undefined,
                }));

        return filterTree(sidebarTree);
    }, [userPermission.resourceTypes]);

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
                    padding: 2,
                },
            }}
        >
            <Stack direction="column" spacing={1.5} sx={{ minHeight: "100%" }}>
                <Box className="flex items-center p-2">
                    <Avatar src={AppLogo}>H</Avatar>
                    <Typography className="ml-3 truncate text-[16px]">MediFlows</Typography>
                </Box>
                <Box className="no-scrollbar w-full flex-1 overflow-y-auto overflow-x-hidden p-2">
                    {filteredSidebarTree.map((sideBar, idx) => (
                        <SidebarTabItem key={sideBar.labelKey + idx} {...sideBar} level={0} />
                    ))}
                </Box>
                <Stack direction={"column"} sx={{ flexShrink: 0 }} className="p-2">
                    <ChangeLanguageTab />
                    <SidebarTabItem icon={<ExitToApp />} labelKey={i18n.translationKey.signOut} onClick={logout} />
                </Stack>
            </Stack>
        </Drawer>
    );
};
