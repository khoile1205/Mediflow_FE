import { authEndpoints } from "./auth";
import { hospitalEndpoints } from "./hospital-fee";
import { hospitalServiceEndpoints } from "./hospital-service";
import { inventoryEndpoints } from "./inventory";
import { managementEndpoints } from "./management";
import { patientEndpoints } from "./patient";
import { publicApiEndpoints } from "./public-api";
import { receptionEndpoints } from "./reception";

export const endpoints = {
    inventory: inventoryEndpoints,
    auth: authEndpoints,
    publicApi: publicApiEndpoints,
    hospitalService: hospitalServiceEndpoints,
    reception: receptionEndpoints,
    management: managementEndpoints,
    patient: patientEndpoints,
    hospitalFee: hospitalEndpoints,
};
