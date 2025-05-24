import { Dashboard, ExitToApp, Home, Inventory2, Paid, People, Settings, Vaccines } from "@mui/icons-material";
import { Avatar, Box, Drawer, Stack, Typography } from "@mui/material";
import React from "react";
import { SidebarTabItem, SidebarTabProps } from "./tabs/sidebar.tab";
import AppLogo from "~/assets/images/app_logo.png";

const sidebarTree: SidebarTabProps[] = [
    {
        icon: <Home />,
        label: "Trang chủ",
        pathName: "/",
    },
    {
        icon: <Dashboard />,
        label: "Tiếp nhận",
        children: [
            {
                label: "Tiêm chủng",
                pathName: "/reception/vaccination",
            },
            {
                label: "Bệnh nhân",
                pathName: "/reception/patient",
            },
        ],
    },
    {
        icon: <Paid />,
        label: "Viện phí",
        pathName: "/finance",
    },
    {
        icon: <Vaccines />,
        label: "Tiêm chủng",
        pathName: "/vaccination",
    },
    {
        icon: <People />,
        label: "Bệnh nhân",
        pathName: "/patient",
    },
    {
        icon: <Inventory2 />,
        label: "Kho dược",
        children: [
            {
                label: "Nhập dược",
                pathName: "/pharmacy/import",
            },
        ],
    },
];

export const Sidebar: React.FC = () => {
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
                    {sidebarTree.map((item, idx) => (
                        <SidebarTabItem key={item.label + idx} {...item} level={0} />
                    ))}
                </Box>
                <Stack direction={"column"} sx={{ flexShrink: 0 }} className="p-2">
                    <SidebarTabItem icon={<Settings />} label="Cài đặt" />
                    <SidebarTabItem icon={<ExitToApp />} label="Đăng xuất" />
                </Stack>
            </Stack>
        </Drawer>
    );
};
