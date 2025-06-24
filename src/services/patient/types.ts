import { IPaginationRequest } from "~/libs/axios/types";

// export
export interface GetPatientWithPaginationRequest extends IPaginationRequest {
    patientCode?: string;
    patientName?: string;
    patientPhoneNumber?: string;
}
