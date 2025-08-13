import { ExaminationService } from "~/services/hospital-service/infras/types";
import { BaseEntity } from "./base.entity";

export interface Service extends BaseEntity {
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: number;
    examinationService?: ExaminationService;
}
