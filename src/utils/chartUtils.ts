export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface YearlyData<T> {
    year: number;
    monthly: T[];
}

export function buildSeries<T extends { month: string }>(data: YearlyData<T>[], getValue: (m: T) => number) {
    return data.map((yearData) => ({
        type: "line" as const,
        name: `${yearData.year}`,
        data: months.map((monthName) => {
            const monthData = yearData.monthly.find((m) => m.month === monthName);
            return monthData ? getValue(monthData) : 0;
        }),
    }));
}
