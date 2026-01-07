import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound.tsx";
import SignUp from "../pages/SignUp.tsx";
import SignIn from "../pages/SignIn.tsx";


const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <App />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/sign-up",
                element: <SignUp />,
            },
            {
                path: "/sign-in",
                element: <SignIn />,
            },

            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
export default routes;