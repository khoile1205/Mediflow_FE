import React from "react";

export default function usePagination(
    params: {
        defaultPage?: number;
        defaultPageSize?: number;
    } = {
        defaultPage: 1,
        defaultPageSize: 10,
    },
) {
    const [pageIndex, setPageIndex] = React.useState(params.defaultPage);
    const [pageSize, setPageSize] = React.useState(params.defaultPageSize);

    const handlePageChange = (newPageIndex: number, newPageSize: number) => {
        setPageIndex(newPageIndex);
        setPageSize(newPageSize);
    };

    const resetPagination = () => {
        setPageIndex(params.defaultPage);
        setPageSize(params.defaultPageSize);
    };

    return {
        pageIndex,
        pageSize,
        handlePageChange,
        resetPagination,
    };
}
