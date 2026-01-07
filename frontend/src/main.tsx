import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <ToastContainer />
            <RouterProvider router={routes} />
        </Provider>
    </StrictMode>
);