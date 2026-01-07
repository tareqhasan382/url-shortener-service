import { baseApi } from "../api/baseApi";
export interface UrlResponse {
    id: string;
    userId: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    clickCount: number;
    createdAt: string;
    updatedAt: string;
}
export interface CreateUrlRequest {
    originalUrl: string;
};
export interface UrlAnalyticsOverview {
    totalUrls: number;
    urlLimit: number;
    remainingUrls: number;

    totalClicks: number;
    weeklyGrowth: number;

    todayClicks: number;

    topPerformer: {
        shortUrl: string;
        clicksThisWeek: number;
    } | null;
}

export const urlApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createUrl: builder.mutation<UrlResponse, CreateUrlRequest>({
            query: (data) => ({
                url: "/url",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["urls"],
        }),
        myUrls: builder.query<
            { data: UrlResponse[]; page: number; limit: number; total: number; totalPages: number },
            { page?: number; limit?: number; search?: string }
        >({
            query: ({ page = 1, limit = 10, search }) => ({
                url: "/url/my-urls",
                method: "GET",
                params: { page, limit, search },
            }),
            providesTags: ["urls"],
        }),
        analyticsOverview: builder.query<UrlAnalyticsOverview, void>({
            query: () => ({
                url: "/url/analytics/overview",
                method: "GET",
            }),
            providesTags: ["urls"],
        }),

        deleteUrl: builder.mutation({
            query: (id: string) => ({
                url: `/url/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["urls"],
        }),
    }),
});

export const { useCreateUrlMutation, useMyUrlsQuery, useDeleteUrlMutation,useAnalyticsOverviewQuery } = urlApi;