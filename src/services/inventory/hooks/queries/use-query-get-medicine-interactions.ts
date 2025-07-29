import { useQuery } from "@tanstack/react-query";
import { inventoryApis } from "../../infras";
import { QueryKey } from "~/constants/query-key";
import { GetMedicineInteractionListRequest, MedicineInteraction } from "../../infras/types";
import { IBaseApiResponse, IPagination } from "~/libs/axios/types";
import React from "react";

export const useQueryGetMedicineInteractions = ({
    isEnabled,
    query,
}: {
    isEnabled: boolean;
    query: GetMedicineInteractionListRequest;
}) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<MedicineInteraction>>>({
        queryKey: [QueryKey.INVENTORY.GET_MEDICINE_INTERACTIONS_WITH_PAGINATION, query],
        queryFn: () => inventoryApis.getMedicineInteractions(query),
        enabled: isEnabled,
        staleTime: 1000 * 60 * 1,
    });

    const medicineInteractions = React.useMemo(() => {
        if (isLoading || isError || !response) return [];
        return response.Data.data;
    }, [response, isLoading, isError]);

    const totalItems = React.useMemo(() => {
        if (isLoading || isError || !response) return 0;
        return response.Data.totalItems;
    }, [response, isLoading, isError]);

    return {
        data: { medicineInteractions, totalItems },
        isLoading,
        isError,
        refetch,
    };
};
