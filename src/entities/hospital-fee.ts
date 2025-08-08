export interface HospitalFee {
    name: string;
    content: string;
    quantity: number;
    cost: number;
    support: number;
    beforeDiscount: number;
    attachedServiceFees: AttachedServiceFee[];
}

export interface AttachedServiceFee {
    name: string;
    content: string;
    quantity: number;
    cost: number;
    support: number;
    beforeDiscount: number;
}
