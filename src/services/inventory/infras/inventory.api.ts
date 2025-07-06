import { endpoints } from "~/constants/endpoints";
import { Manufacture, ManufactureCountry } from "~/entities/medicine";
import { callApi } from "~/libs/axios/request";
import { IDocumentImportMedicineSupplierResponse, ImportMedicineFromSupplierDocumentRequest } from "./types";
import { IPaginationRequest, IPagination, HttpMethod } from "~/libs/axios/types";
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

export const inventoryApis = {
    getAllManufacturers,
    getAllManufactureCountries,
    generateDocumentCode,
    getListSupplier,
    saveImportDocument,
};
