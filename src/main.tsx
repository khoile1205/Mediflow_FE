import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HttpContextProvider } from "./contexts/http.context.tsx";
import "./index.css";
import { MaterialUIThemeProvider } from "./libs/material-ui/theme.provider.tsx";
import { ApplicationRoutes } from "./routes/index.tsx";
import { AuthContextProvider } from "./contexts/auth.context.tsx";
import { BrowserRouter } from "react-router";

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
            <HttpContextProvider>
                <AuthContextProvider>
                    <MaterialUIThemeProvider>
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
        </BrowserRouter>
    </StrictMode>,
);
