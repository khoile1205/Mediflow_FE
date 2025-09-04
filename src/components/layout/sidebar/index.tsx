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
import { usePasswordConfirm } from "~/contexts/password-confirmation.context";

const UserInfoSummary: React.FC = () => {
    const auth = useAuth();

    const fullName: string = auth?.user?.name ?? "N/A";
    const roles: string[] = auth?.userPermission?.roles ?? auth?.user?.roles ?? [];
    const department = auth?.userPermission?.departments[0] ?? "N/A";
    const primaryRole = roles?.[0] ?? "N/A";

    const initials =
        fullName
            .split(" ")
            .filter(Boolean)
            .map((p: string) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U";

    return (
        <Box className="mb-2 flex items-center rounded-xl bg-gray-100 px-3 py-2">
            <Avatar sx={{ width: 36, height: 36 }}>{initials}</Avatar>
            <Box className="ml-3 min-w-0">
                <Typography fontWeight={600} className="truncate">
                    {fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="truncate">
                    {`${primaryRole} - ${department}`}
                </Typography>
            </Box>
        </Box>
    );
};

export const Sidebar: React.FC = () => {
    const auth = useAuth();
    const { resetPasswordConfirmationSession } = usePasswordConfirm();

    const handleLogout = () => {
        resetPasswordConfirmationSession();
        auth.logout();
    };

    const filteredSidebarTree = React.useMemo(() => {
        const filterTree = (items: SidebarTabProps[]): SidebarTabProps[] =>
            items
                .map((item) => {
                    const filteredChildren = item.children ? filterTree(item.children) : undefined;

                    const userResourceTypes = auth?.userPermission?.resourceTypes || {};
                    const hasExamination = !!userResourceTypes["examination"];
                    const hasVaccinationReception = !!userResourceTypes["vaccination-reception"];

                    let isAccessible =
                        !item.requiredPermissions ||
                        hasPermission({
                            resourceTypes: userResourceTypes,
                            requiredPermissions: item.requiredPermissions,
                            userRoles: auth?.userPermission?.roles || [],
                            requiredRoles: item.requiredRoles,
                            accessModifier: userResourceTypes[item.requiredPermissions?.[0] || ""],
                        });

                    if (item.pathName === "/examination") {
                        if (hasVaccinationReception) {
                            isAccessible = false;
                        } else if (hasExamination) {
                            isAccessible = true;
                        }
                    }

                    if (isAccessible || (filteredChildren && filteredChildren.length > 0)) {
                        return { ...item, children: filteredChildren };
                    }

                    return null;
                })
                .filter(Boolean) as SidebarTabProps[];

        return filterTree(sidebarTree);
    }, [auth?.userPermission]);
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
                    <UserInfoSummary />
                    <ChangeLanguageTab />
                    <SidebarTabItem
                        icon={<ExitToApp />}
                        labelKey={i18n.translationKey.signOut}
                        onClick={handleLogout}
                    />
                </Stack>
            </Stack>
        </Drawer>
    );
};
