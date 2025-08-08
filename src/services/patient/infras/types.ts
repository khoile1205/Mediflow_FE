import { IPaginationRequest } from "~/libs/axios/types";

export interface GetPatientWithPaginationRequest extends IPaginationRequest {
    code?: string;
    name?: string;
    phoneNumber?: string;
    identityCard?: string;
}
