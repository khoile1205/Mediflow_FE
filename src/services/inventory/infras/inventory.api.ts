import { endpoints } from "~/constants/endpoints";
import { Manufacture, ManufactureCountry, Medicine } from "~/entities/medicine";
import { callApi } from "~/libs/axios/request";
import {
    CreateMedicineInteractionRequest,
    CreateMedicinePriceRequest,
    CreateMedicineRequest,
    GetMedicineInteractionListRequest,
    GetMedicinePriceListRequest,
    MedicineInteraction,
    MedicinePrice,
    UpdateMedicineDto,
    UpdateMedicineInteractionRequest,
    UpdateMedicinePriceRequest,
    VaccineType,
    GetInventoryLimitStockListRequest,
    IDocumentImportMedicineSupplierResponse,
    ImportMedicineFromSupplierDocumentRequest,
    InventoryLimitStock,
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

const getInventoryLimitStocks = async ({
    pageIndex,
    pageSize,
    searchKeyword,
}: GetInventoryLimitStockListRequest): Promise<IBaseApiResponse<IPagination<InventoryLimitStock>>> => {
    return await callApi({
        url: inventoryEndpoints.inventoryLimitStock.getList,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
            searchKeyword,
        },
    });
};

const createInventoryLimitStock = async (data: {
    medicineId: number;
    minimalStockThreshold: number;
}): Promise<IBaseApiResponse<void>> => {
    return await callApi({
        url: inventoryEndpoints.inventoryLimitStock.create,
        method: HttpMethod.POST,
        data,
    });
};

const updateInventoryLimitStock = async (data: {
    id: number;
    medicineId: number;
    minimalStockThreshold: number;
}): Promise<IBaseApiResponse<void>> => {
    return await callApi({
        url: inventoryEndpoints.inventoryLimitStock.update(data.id),
        method: HttpMethod.PUT,
        data,
    });
};

const deleteInventoryLimitStock = async (id: number): Promise<IBaseApiResponse<void>> => {
    return await callApi({
        url: inventoryEndpoints.inventoryLimitStock.delete(id),
        method: HttpMethod.DELETE,
    });
};

const getMedicines = async ({
    pageIndex,
    pageSize,
    name,
    code,
    searchKeyword,
}: GetMedicineListRequest): Promise<IBaseApiResponse<IPagination<Medicine>>> => {
    return await callApi({
        url: endpoints.inventory.medicine.standard,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
            name,
            code,
            searchKeyword,
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

const getMedicinePrices = async (
    query: GetMedicinePriceListRequest,
): Promise<IBaseApiResponse<IPagination<MedicinePrice>>> => {
    return await callApi({
        url: inventoryEndpoints.medicinePrice.getList,
        method: HttpMethod.GET,
        params: query,
    });
};

export const getMedicinePriceById = async (id: number): Promise<IBaseApiResponse<MedicinePrice>> => {
    return await callApi({
        url: inventoryEndpoints.medicinePrice.update(id),
        method: HttpMethod.GET,
    });
};

const createMedicinePrice = async (data: CreateMedicinePriceRequest) => {
    return await callApi({
        url: inventoryEndpoints.medicinePrice.create,
        method: HttpMethod.POST,
        data,
    });
};

const updateMedicinePrice = async (data: UpdateMedicinePriceRequest) => {
    return await callApi<void>({
        url: inventoryEndpoints.medicinePrice.update(data.id),
        method: HttpMethod.PUT,
        data,
    });
};

const deleteMedicinePrice = async (id: number) => {
    return await callApi<void>({
        url: inventoryEndpoints.medicinePrice.delete(id),
        method: HttpMethod.DELETE,
    });
};

export const inventoryApis = {
    getAllManufacturers,
    getAllManufactureCountries,
    generateDocumentCode,
    getListSupplier,
    saveImportDocument,
    getInventoryLimitStocks,
    createInventoryLimitStock,
    updateInventoryLimitStock,
    deleteInventoryLimitStock,
    getMedicines,
    createMedicine,
    getVaccineTypes,
    getMedicineInteractions,
    updateMedicineInteraction,
    deleteMedicineInteraction,
    createMedicineInteraction,
    getMedicinePrices,
    createMedicinePrice,
    updateMedicinePrice,
    deleteMedicinePrice,
    getMedicinePriceById,
};
