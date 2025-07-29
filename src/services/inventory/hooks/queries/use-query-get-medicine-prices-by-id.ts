import { useQuery } from "@tanstack/react-query";
import { IBaseApiResponse } from "~/libs/axios/types";
import { MedicinePrice } from "../../infras/types";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras/inventory.api";

export const useQueryGetMedicinePriceById = ({ isEnabled, id }: { isEnabled: boolean; id: number }) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<MedicinePrice>>({
        queryKey: [QueryKey.INVENTORY.GET_MEDICINE_PRICES_WITH_PAGINATION, id],
        queryFn: () => inventoryApis.getMedicinePriceById(id),
        enabled: isEnabled && !!id,
        staleTime: 1000 * 60 * 1,
    });

    return {
        data: data?.Data,
        isLoading,
        isError,
        refetch,
    };
};
