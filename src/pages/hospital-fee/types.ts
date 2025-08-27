import { PaymentMethod, ReceiptPaymentType } from "~/constants/enums";
import { HospitalServiceType } from "~/services/hospital-fee/infras";

export interface HospitalFeeFormValue {
    patientCode?: string;
    invoiceNumber?: string;
    invoiceValue?: number;
    phoneNumber?: string;
    paidType?: PaymentMethod;
    isPaid?: boolean;
    isRefund?: boolean;
    isCancel?: boolean;
    name?: string;
    yearOfBirth?: number;
    dob?: string;
    age?: number;
    address?: string;
    taxCode?: string;
    atmCode?: string;
    unitName?: string;
    method?: ReceiptPaymentType;
    note?: string;
    hospitalServiceItems?: HospitalServiceItem[];
}

export interface HospitalServiceItem {
    id: number;
    requestNumber: string;
    serviceId?: number;
    vaccineId?: number;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    createdAt: string | Date;
    serviceType?: HospitalServiceType;
}
