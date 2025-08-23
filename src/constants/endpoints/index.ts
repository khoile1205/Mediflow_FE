import { appointmentEndpoints } from "./appointment";
import { authEndpoints } from "./auth";
import { examinationEndpoints } from "./examination";
import { hospitalEndpoints } from "./hospital-fee";
import { hospitalServiceEndpoints } from "./hospital-service";
import { inventoryEndpoints } from "./inventory";
import { managementEndpoints } from "./management";
import { patientEndpoints } from "./patient";
import { publicApiEndpoints } from "./public-api";
import { receptionEndpoints } from "./reception";
import { reportEndpoints } from "./reports";
import { supplierEndpoints } from "./supplier";
import { transactionHistoryEndpoints } from "./transaction-history";
import { uploadFileEndpoints } from "./upload-file";
import { vaccinationEndpoints } from "./vaccination";

export const endpoints = {
    uploadFile: uploadFileEndpoints,
    inventory: inventoryEndpoints,
    auth: authEndpoints,
    publicApi: publicApiEndpoints,
    hospitalService: hospitalServiceEndpoints,
    reception: receptionEndpoints,
    management: managementEndpoints,
    patient: patientEndpoints,
    hospitalFee: hospitalEndpoints,
    vaccination: vaccinationEndpoints,
    appointment: appointmentEndpoints,
    examination: examinationEndpoints,
    supplier: supplierEndpoints,
    reports: reportEndpoints,
    transactionHistory: transactionHistoryEndpoints,
};
