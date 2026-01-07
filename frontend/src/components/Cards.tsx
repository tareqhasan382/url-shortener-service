import {FaChartLine, FaLink, FaUsers} from "react-icons/fa";
import {FiBarChart2} from "react-icons/fi";
import {useAnalyticsOverviewQuery} from "../Redux/url/urlApi.ts";

export const Cards = () => {
    const { data, isLoading } = useAnalyticsOverviewQuery();
    if (isLoading || !data) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total URLs</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalUrls}<span className="text-gray-400 text-lg">/{data?.urlLimit}</span></p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <FaLink className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            style={{
                                width: `${(data?.totalUrls / data?.urlLimit) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{data?.remainingUrls} URLs remaining</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl border border-green-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Clicks</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalClicks?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl">
                        <FaUsers className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">+{data?.weeklyGrowth}% from last week</p>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border border-purple-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Today's Clicks</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{ data?.todayClicks}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <FiBarChart2 className="w-6 h-6 text-purple-600" />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Updated in real-time</p>
            </div>

            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl border border-orange-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Top Performer</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">
                            {data?.topPerformer
                                ? data?.topPerformer?.shortUrl
                                : "—"}
                        </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-xl">
                        <FaChartLine className="w-6 h-6 text-orange-600" />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    {data?.topPerformer
                        ? `${data.topPerformer?.clicksThisWeek} clicks this week`
                        : "No data"}
                </p>
            </div>
        </div>
    )
}