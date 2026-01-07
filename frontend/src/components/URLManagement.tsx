import {useMemo, useState} from "react";
import {
    type UrlResponse,
    useAnalyticsOverviewQuery,
    useDeleteUrlMutation,
    useMyUrlsQuery
} from "../Redux/url/urlApi.ts";
import {toast} from "react-toastify";
import {FiBarChart2, FiCalendar, FiCopy, FiExternalLink, FiSearch, FiTrash2} from "react-icons/fi";
import {FaLink} from "react-icons/fa";
// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useMemo(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
export const URLManagement = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    // Fetch analytics data
    const { data: analyticsData, refetch:analyticsDataRefetch } = useAnalyticsOverviewQuery();
    const { data, isLoading, error ,refetch } = useMyUrlsQuery(
        { page, limit, search: debouncedSearchTerm },
        {
            refetchOnFocus: false,
            refetchOnReconnect: false,
        }
    );

    const [deleteUrl, { isLoading: deleteLoading }] = useDeleteUrlMutation();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUrl(id).unwrap();
            toast.success("Deleted URL successfully");
        } catch (err) {
            toast.error("Delete URL failed");
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">
                        Your Shortened URLs
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1 md:w-64">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search URLs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Original URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Short Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Short URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clicks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {!isLoading &&
                        !error &&
                        data?.data?.map((url: UrlResponse) => (
                            <tr key={url.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="max-w-xs flex items-center">
                                        <FaLink className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <a
                                            href={url.originalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-gray-900 truncate hover:text-blue-600"
                                            title={url.originalUrl}
                                        >
                                            {url.originalUrl.length > 30
                                                ? `${url.originalUrl.substring(0, 30)}...`
                                                : url.originalUrl}
                                        </a>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {url.shortCode}
                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <a
                                            href={url.shortUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                        >
                                            {url.shortUrl}
                                        </a>
                                        <button
                                            onClick={() => copyToClipboard(url.shortUrl)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                            title="Copy to clipboard"
                                        >
                                            <FiCopy className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                window.open(url.shortUrl, "_blank", "noopener,noreferrer");
                                                setTimeout(() => {
                                                    refetch();
                                                    analyticsDataRefetch()
                                                }, 300);
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded"
                                            title="Open link"
                                        >
                                            <FiExternalLink className="w-4 h-4 text-gray-500" />
                                        </button>

                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <FiBarChart2 className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-semibold text-gray-900">
                        {url?.clickCount}
                      </span>
                                        <span className="text-xs text-gray-500 ml-1">clicks</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                                        {new Date(url.createdAt).toLocaleDateString("en-GB", {
                                            timeZone: "Asia/Dhaka",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        disabled={deleteLoading}
                                        onClick={() => handleDelete(url.id)}
                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete URL"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end px-6 py-4 border-t space-x-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="px-3 py-1 border rounded bg-gray-50">
          Page {page} / {data?.totalPages || 1}
        </span>

                <button
                    disabled={page >= (data?.totalPages || 1)}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
