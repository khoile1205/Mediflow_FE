import { endpoints } from "~/constants/endpoints";
import { Manufacture, ManufactureCountry, Medicine } from "~/entities/medicine";
import { callApi } from "~/libs/axios/request";
import {
    CreateMedicineInteractionRequest,
    CreateMedicineRequest,
    GetMedicineInteractionListRequest,
    IDocumentImportMedicineSupplierResponse,
    ImportMedicineFromSupplierDocumentRequest,
    MedicineInteraction,
    UpdateMedicineDto,
    UpdateMedicineInteractionRequest,
    VaccineType,
} from "./types";
import { IPaginationRequest, IPagination, HttpMethod, IBaseApiResponse } from "~/libs/axios/types";
import { Supplier } from "~/entities/supplier";
import { GetMedicineListRequest } from "../hooks/queries/use-query-get-medicines";
import { inventoryEndpoints } from "~/constants/endpoints/inventory";

const getAllManufacturers = async () => {
    return await callApi<Manufacture[]>({
        url: endpoints.inventory.manufacturer.standard,
        method: HttpMethod.GET,
    });
};

const getAllManufactureCountries = async () => {
    return await callApi<ManufactureCountry[]>({
        url: endpoints.inventory.manufacturerCountry.standard,
        method: HttpMethod.GET,
    });
};

const generateDocumentCode = async () => {
    return await callApi<IDocumentImportMedicineSupplierResponse>({
        url: endpoints.inventory.supplierImportDocument.generateDocumentCode,
        method: HttpMethod.GET,
    });
};

const getListSupplier = async ({ pageIndex, pageSize }: IPaginationRequest) => {
    return await callApi<IPagination<Supplier>>({
        url: endpoints.inventory.supplier.standard,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
        },
    });
};

const saveImportDocument = async (importDocument: ImportMedicineFromSupplierDocumentRequest) => {
    return await callApi({
        url: endpoints.inventory.supplierImportDocument.createDocument,
        method: HttpMethod.POST,
        data: importDocument,
    });
};

const getMedicines = async ({
    pageIndex,
    pageSize,
    name,
    code,
}: GetMedicineListRequest): Promise<IBaseApiResponse<IPagination<Medicine>>> => {
    return await callApi({
        url: endpoints.inventory.medicine.standard,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
            name,
            code,
        },
    });
};

const createMedicine = async (data: CreateMedicineRequest) => {
    return await callApi({
        url: endpoints.inventory.medicine.createMedicine,
        method: HttpMethod.POST,
        data,
    });
};

export const deleteMedicine = (medicineId: number) => {
    return callApi<void>({
        method: HttpMethod.DELETE,
        url: endpoints.inventory.medicine.deleteMedicine(medicineId),
    });
};

export const updateMedicine = (data: UpdateMedicineDto) => {
    return callApi<void>({
        method: HttpMethod.PUT,
        url: endpoints.inventory.medicine.updateMedicine(data.id),
        data,
    });
};

const getVaccineTypes = async (): Promise<IBaseApiResponse<VaccineType[]>> => {
    return await callApi({
        url: endpoints.inventory.vaccineType.standard,
        method: HttpMethod.GET,
    });
};

const getMedicineInteractions = async (
    query: GetMedicineInteractionListRequest,
): Promise<IBaseApiResponse<IPagination<MedicineInteraction>>> => {
    return await callApi({
        url: endpoints.inventory.medicineInteraction.standard,
        method: HttpMethod.GET,
        params: query,
    });
};

const updateMedicineInteraction = async (data: UpdateMedicineInteractionRequest) => {
    return callApi<void>({
        url: inventoryEndpoints.medicineInteraction.update(data.id),
        method: HttpMethod.PUT,
        data,
    });
};

const deleteMedicineInteraction = async (id: number) => {
    return callApi<void>({
        url: inventoryEndpoints.medicineInteraction.delete(id),
        method: HttpMethod.DELETE,
    });
};

const createMedicineInteraction = async (data: CreateMedicineInteractionRequest) => {
    return callApi({
        url: inventoryEndpoints.medicineInteraction.standard,
        method: HttpMethod.POST,
        data,
    });
};
export const inventoryApis = {
    getAllManufacturers,
    getAllManufactureCountries,
    generateDocumentCode,
    getListSupplier,
    saveImportDocument,
    getMedicines,
    createMedicine,
    getVaccineTypes,
    getMedicineInteractions,
    updateMedicineInteraction,
    deleteMedicineInteraction,
    createMedicineInteraction,
};
