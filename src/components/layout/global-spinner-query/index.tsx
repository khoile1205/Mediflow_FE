import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { CircularProgress, Backdrop } from "@mui/material";
import React from "react";

const GlobalSpinnerQuery: React.FC = () => {
    const isFetching = useIsFetching();
    const isMutation = useIsMutating();

    const isLoading = React.useMemo(() => isFetching > 0 || isMutation > 0, [isFetching, isMutation]);

    return (
        <Backdrop open={isLoading} style={{ zIndex: 2000 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default GlobalSpinnerQuery;
