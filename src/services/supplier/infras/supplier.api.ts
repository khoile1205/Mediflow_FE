import { endpoints } from "~/constants/endpoints";
import { Supplier } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IBaseApiResponse } from "~/libs/axios/types";
import { CreateSupplierRequest, UpdateSupplierRequest } from "./types";

// Get all suppliers
const getSupplierById = async (id: number): Promise<IBaseApiResponse<Supplier>> => {
    return await callApi<Supplier>({
        method: HttpMethod.GET,
        url: endpoints.supplier.getSupplierById(id),
    });
};

// Create supplier
const createSupplier = async (supplier: CreateSupplierRequest): Promise<IBaseApiResponse<number>> => {
    return await callApi<number>({
        method: HttpMethod.POST,
        url: endpoints.supplier.createSupplier,
        data: supplier,
    });
};

// Update supplier
const updateSupplier = async (id: number, supplier: UpdateSupplierRequest): Promise<IBaseApiResponse<number>> => {
    return await callApi<number>({
        method: HttpMethod.PUT,
        url: endpoints.supplier.updateSupplier(id),
        data: supplier,
    });
};

// Delete supplier
const deleteSupplier = async (id: number): Promise<IBaseApiResponse<void>> => {
    return await callApi<void>({
        method: HttpMethod.DELETE,
        url: endpoints.supplier.deleteSupplier(id),
    });
};

export const supplierApi = {
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
