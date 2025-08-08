import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { getAxiosErrorMessageKey } from "../axios/helper";

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: DEFAULT_STALE_TIME,
            refetchOnWindowFocus: false,
            retry: false,
        },
        mutations: {
            onError: (error) => {
                showToast.error(i18n.t(getAxiosErrorMessageKey(error)));
            },
        },
    },
});

export const ReactQueryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
