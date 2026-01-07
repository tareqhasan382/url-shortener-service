import { baseApi } from "../api/baseApi";

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    profileImage: string | null;
    role: "USER" | "ADMIN";
    status: "ACTIVE" | "INACTIVE" | "SUSPEND";
    lastLogin: string;
    verified: boolean;
    tier: "FREE" | "PREMIUM" | "ENTERPRISE";
    urlLimit: number;
    createdAt: string;
    updatedAt: string;
}
export interface GetMeResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: UserProfile;
}
export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<GetMeResponse, void>({
            query: () => ({
                url: "/user/get-me",
                method: "GET",
            }),
            providesTags: ["user"],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/user/update-me",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
    }),
});

export const { useGetMeQuery, useUpdateProfileMutation } = userApi;