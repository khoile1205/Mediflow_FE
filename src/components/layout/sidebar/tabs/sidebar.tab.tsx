import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import classNames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { ResourceType } from "~/configs/route-permission";

export interface SidebarTabProps {
    icon?: React.ReactNode;
    labelKey: string;
    level?: number;
    pathName?: string;
    children?: SidebarTabProps[];
    onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
    requiredPermissions?: ResourceType[];
}

export const SidebarTabItem: React.FC<SidebarTabProps> = ({
    icon,
    labelKey,
    level = 0,
    children,
    pathName = "",
    onClick,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

    const active = React.useMemo(() => {
        return location.pathname === pathName;
    }, [location.pathname, pathName]);

    const hasChildren = React.useMemo(() => {
        return children && children.length > 0;
    }, [children]);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (onClick) {
            onClick(e);
            return;
        }

        if (pathName) {
            navigate(pathName);
            return;
        }

        if (hasChildren) {
            setIsExpanded((prev) => !prev);
        }
    };

    return (
        <Box className={classNames("w-full cursor-pointer rounded-md")}>
            <Box
                sx={{ pl: level * 2 }}
                className={classNames("flex flex-col hover:bg-gray-50", {
                    "bg-gray-200": active,
                })}
                onClick={handleClick}
            >
                <Box className="flex items-center justify-start rounded-md p-2">
                    {hasChildren ? (
                        <IconButton className="rounded-full transition-all duration-200 ease-in-out">
                            {!isExpanded ? (
                                <KeyboardArrowDown className="text-sm" />
                            ) : (
                                <KeyboardArrowUp className="text-sm" />
                            )}
                        </IconButton>
                    ) : (
                        <Box className="h-[30px] w-[30px]" />
                    )}
                    {icon && <Box className="text-sm text-gray-500">{icon}</Box>}
                    <Typography
                        className={classNames("truncate pl-2 text-sm", {
                            "font-bold": active,
                        })}
                    >
                        {t(labelKey)}
                    </Typography>
                </Box>
            </Box>
            {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {children.map((child, idx) => (
                        <SidebarTabItem key={child.labelKey + idx} level={level + 1} {...child} />
                    ))}
                </Collapse>
            )}
        </Box>
    );
};
