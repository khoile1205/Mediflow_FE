import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { inventoryApis } from "../../infras";
import { QueryKey } from "~/constants/query-key";

export const useQueryGetAllMedicines = () => {
    const [totalItems, setTotalItems] = useState<number | null>(null);

    const previewQuery = useQuery({
        queryKey: [QueryKey.INVENTORY.GET_LIST_WITH_PAGINATION, "countOnly"],
        queryFn: () =>
            inventoryApis.getMedicines({
                pageIndex: 1,
                pageSize: 1,
            }),
        enabled: totalItems === null,
    });

    useEffect(() => {
        if (previewQuery.data) {
            setTotalItems(previewQuery.data.Data.totalItems);
        }
    }, [previewQuery.data]);

    const fullQuery = useQuery({
        queryKey: [QueryKey.INVENTORY.GET_LIST_WITH_PAGINATION, { pageIndex: 1, pageSize: totalItems }],
        queryFn: () =>
            inventoryApis.getMedicines({
                pageIndex: 1,
                pageSize: totalItems ?? 0,
            }),
        enabled: totalItems !== null,
        staleTime: 1000 * 60 * 1,
    });

    const medicines = fullQuery.data?.Data.data ?? [];

    return {
        medicines,
        isLoading: previewQuery.isLoading || fullQuery.isLoading,
        isError: previewQuery.isError || fullQuery.isError,
        refetch: fullQuery.refetch,
    };
};
