import { DATE_TIME_FORMAT } from "~/constants/date-time.format";

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
