import { ExitToApp } from "@mui/icons-material";
import { Avatar, Box, Drawer, Stack, Typography } from "@mui/material";
import React from "react";
import AppLogo from "~/assets/images/logo.png";
import i18n from "~/configs/i18n";
import { sidebarTree } from "~/configs/sidebar";
import { useAuth } from "~/contexts/auth.context";
import { hasPermission } from "~/utils/permission.utils";
import { ChangeLanguageTab } from "./tabs/change-lang.tab";
import { SidebarTabItem, SidebarTabProps } from "./tabs/sidebar.tab";

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
                    <Typography className="ml-3 truncate text-[16px] font-bold">MediFlow</Typography>
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
