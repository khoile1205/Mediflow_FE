import { authEndpoints } from "./auth";
import { inventoryEndpoints } from "./inventory";
import { publicApiEndpoints } from "./public-api";

export const endpoints = {
    inventory: inventoryEndpoints,
    auth: authEndpoints,
    publicApi: publicApiEndpoints,
};
