// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import type {RootState} from "../Redux/store.ts";
// import type {JSX} from "react";
//
// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//     const auth = useSelector((state: RootState) => state.auth);
//
//     if (!auth?.accessToken) {
//         return <Navigate to="/sign-in" replace />;
//     }
//
//     return children;
// };
//
// export default ProtectedRoute;

// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type {RootState} from "../Redux/store.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { accessToken } = useSelector((state: RootState) => state.auth);

    if (!accessToken) {
        return <Navigate to="/sign-in" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;