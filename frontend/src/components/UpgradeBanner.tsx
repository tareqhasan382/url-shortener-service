
export const UpgradeBanner = () => {
    return (
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                    <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
                    <p className="text-blue-100">
                        Remove URL limits, get advanced analytics, custom domains, and priority support.
                    </p>
                </div>
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
                    Upgrade to Premium
                </button>
            </div>
        </div>
    )
}