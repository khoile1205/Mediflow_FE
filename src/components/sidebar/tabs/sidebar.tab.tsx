import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import classNames from "classnames";
import React from "react";
import { useLocation, useNavigate } from "react-router";

export interface SidebarTabProps {
    icon?: React.ReactNode;
    label: string;
    level?: number;
    pathName?: string;
    children?: SidebarTabProps[];
    onClick?: () => void;
}

export const SidebarTabItem: React.FC<SidebarTabProps> = ({
    icon,
    label,
    level = 0,
    children,
    pathName = "",
    onClick,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

    const handleNavigate = () => {
        if (onClick) {
            onClick();
        } else {
            if (!pathName) {
                return;
            }
            navigate(pathName);
        }
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded((prev) => !prev);
    };

    const active = React.useMemo(() => {
        return location.pathname === pathName;
    }, [location.pathname, pathName]);

    const hasChildren = React.useMemo(() => {
        return children && children.length > 0;
    }, [children]);

    return (
        <Box className={classNames("w-full cursor-pointer rounded-md")}>
            <Box
                sx={{ pl: level * 2 }}
                className={classNames("flex flex-col hover:bg-gray-50", {
                    "bg-gray-200": active,
                })}
            >
                <Box className="flex items-center justify-start rounded-md p-2" onClick={handleNavigate}>
                    {hasChildren ? (
                        <IconButton
                            className="rounded-full transition-all duration-200 ease-in-out"
                            onClick={handleToggle}
                        >
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
                        {label}
                    </Typography>
                </Box>
            </Box>
            {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {children.map((child, idx) => (
                        <SidebarTabItem key={child.label + idx} level={level + 1} {...child} />
                    ))}
                </Collapse>
            )}
        </Box>
    );
};
