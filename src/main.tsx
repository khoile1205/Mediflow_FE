import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "~/configs/i18n";
import { AuthContextProvider } from "./contexts/auth.context.tsx";
import { HttpContextProvider } from "./contexts/http.context.tsx";
import "./index.css";
import { MaterialUIThemeProvider } from "./libs/material-ui/theme.provider.tsx";
import { ApplicationRoutes } from "./routes/index.tsx";
import GlobalSpinnerQuery from "./components/layout/global-spinner-query";

const queryClient = new QueryClient();

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
        <QueryClientProvider client={queryClient}>
            <HttpContextProvider>
                <AuthContextProvider>
                    <MaterialUIThemeProvider>
                        <GlobalSpinnerQuery />
                        <ApplicationRoutes />
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                            transition={Zoom}
                        />
                    </MaterialUIThemeProvider>
                </AuthContextProvider>
            </HttpContextProvider>
        </QueryClientProvider>
    </BrowserRouter>,
);
