import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "~/configs/i18n";
import GlobalSpinnerQuery from "./components/layout/global-spinner-query";
import { AuthContextProvider } from "./contexts/auth.context.tsx";
import { HttpContextProvider } from "./contexts/http.context.tsx";
import "./index.css";
import { MaterialUIThemeProvider } from "./libs/material-ui/theme.provider.tsx";
import { ReactQueryProvider } from "./libs/query-client/provider.tsx";
import { ApplicationRoutes } from "./routes/index.tsx";
import "~/utils/string.exts.ts";

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
        <ReactQueryProvider>
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
        </ReactQueryProvider>
    </BrowserRouter>,
);
