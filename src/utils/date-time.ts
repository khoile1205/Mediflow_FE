import { DATE_TIME_FORMAT } from "~/constants/date-time.format";

export const addDaysToDate = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const convertIsoToYYYYMMDD = (isoDateString: Date): string => {
    if (!isoDateString) return "";

    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

/**
 * Get the difference in days between now and the given date
 * @param date The date to compare with the current date
 * @returns The number of days between the two dates
 */
export const getDiffDays = (date: Date) => {
    const now = new Date();
    const diffInTime = now.getTime() - date.getTime();
    return Math.floor(diffInTime / (1000 * 60 * 60 * 24));
};

export const getExpiredDays = (date: Date) => {
    const now = new Date();
    const diffInTime = date.getTime() - now.getTime();
    return Math.floor(diffInTime / (1000 * 60 * 60 * 24));
};

/**
 * Normalize fromDate to start of the day (00:00)
 */
export const normalizeStartDate = (date: Date | null): Date | null => {
    if (!date) return null;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

/**
 * Normalize toDate to end of the day (23:59)
 */
export const normalizeEndDate = (date: Date | null): Date | null => {
    if (!date) return null;
    const normalized = new Date(date);
    normalized.setHours(23, 59, 59, 999);
    return normalized;
};

export function getPreviousDate(baseDate: Date = new Date()): Date {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - 1);
    return date;
}

export function getNextDate(baseDate: Date = new Date()): Date {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 1);
    return date;
}

export const formatDate = (date: Date | string, format: DATE_TIME_FORMAT): string => {
    switch (format) {
        case DATE_TIME_FORMAT["dd/MM/yyyy"]:
            return formatDateToDDMMYYYY(date);
        case DATE_TIME_FORMAT["dd/MM/yyyy HH:mm:ss"]:
            return formatDateToDDMMYYYYHHMMSS(date);
        case DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]:
            return formatDateToDDMMYYYYHHMM(date);
        case DATE_TIME_FORMAT["HH:mm:ss"]:
            return formatDateToHHMMSS(date);
        case DATE_TIME_FORMAT["yyyy-MM-dd"]:
            return formatDateToYYYYMMDD(date);
    }
};

const formatDateToDDMMYYYY = (date: Date | string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatDateToDDMMYYYYHHMMSS = (date: Date | string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const formatDateToDDMMYYYYHHMM = (date: Date | string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatDateToHHMMSS = (date: Date | string): string => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};

const formatDateToYYYYMMDD = (date: Date | string): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const getCurrentAge = (birthDate: Date | string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
