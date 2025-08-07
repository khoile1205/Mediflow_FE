export interface HospitalServiceGroup {
    id: number;
    groupName: string;
}

export interface HospitalService {
    id: number;
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: number;
    createdAt?: string;
    lastUpdatedAt?: string;
    serviceGroups?: { id: number; groupName: string }[];
    diseaseGroups?: { id: number; groupName: string; description?: string }[];
    examinationService?: number | null;
    serviceTestParameters?: {
        id: number;
        serviceId: number;
        parameterName: string;
        unit: string;
        standardValue: string;
        equipmentName: string;
        specimenType: string;
        isSuspended: boolean;
        isCancelled: boolean;
        createdAt: string;
        createdBy: number;
        lastUpdatedAt: string;
        lastUpdatedBy: number;
    }[];
}

export interface AssignServiceToGroupDto {
    groupId: number;
    serviceIds: number[];
}

export interface AssignServicesToGroupRequest {
    serviceGroupId: number;
    serviceIds: number[];
}

export interface HospitalServiceListResponse {
    StatusCode: number;
    MessageKey: string;
    Data: HospitalService[];
}
