import baseApi from "./api/baseApi";
import authSlice from "./auth/authSlice";

export const reducer = {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice
};