import React from "react";
import clsx from "clsx";

interface StatusBadgeProps {
    status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = {
        base: "inline-block px-3 py-1 rounded text-sm font-medium",
        variants: {
            "Checked In": "bg-green-100 text-green-700",
            Scheduled: "bg-yellow-100 text-yellow-800",
            Completed: "bg-blue-100 text-blue-700",
            "In Progress": "bg-indigo-100 text-indigo-700",
            default: "bg-gray-100 text-gray-600",
        },
    };

    const statusClass = styles.variants[status as keyof typeof styles.variants] || styles.variants.default;

    return <span className={clsx(styles.base, statusClass)}>{status}</span>;
};
