import { endpoints } from "~/constants/endpoints";
import { HttpMethod } from "~/constants/enums";
import { Manufacture, ManufactureCountry } from "~/entities/medicine";
import { callApi } from "~/libs/axios/request";
import { IDocumentImportMedicineSupplierResponse, ImportMedicineFromSupplierDocumentRequest } from "./types";
import { IPaginationRequest, IPagination } from "~/libs/axios/types";
import { Supplier } from "~/entities/supplier";

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

const createImportDocument = async (data: any) => {
    return await callApi({
        url: endpoints.inventory.supplierImportDocument.createDocument,
        method: HttpMethod.POST,
        data,
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

export const inventoryService = {
    getAllManufacturers,
    getAllManufactureCountries,
    generateDocumentCode,
    createImportDocument,
    getListSupplier,
    saveImportDocument,
};
