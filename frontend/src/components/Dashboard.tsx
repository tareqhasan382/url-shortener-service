import { useState } from 'react';
import { useSelector } from 'react-redux';
import UpgradeAlert from "../components/UpgradeAlert.tsx";
import type {RootState} from "../Redux/store.ts";
import {useGetMeQuery} from "../Redux/user/userApi.ts";
import {Navbar} from "./Navbar.tsx";
import {Cards} from "./Cards.tsx";
import {CreateShortener} from "./CreateShortener.tsx";
import {URLManagement} from "./URLManagement.tsx";
import {UpgradeBanner} from "./UpgradeBanner.tsx";
import {Footer} from "./Footer.tsx";


const Dashboard = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const { data: userData } = useGetMeQuery(undefined, {
        skip: !user?.id,
    });

    const currentUser = userData || user;

    // Calculate URL usage percentage
    const urlUsage = currentUser?.urlLimit ? {
        current: 95, // This should come from your URLs API
        limit: currentUser.urlLimit,
        percentage: (95 / currentUser.urlLimit) * 100,
    } : { current: 0, limit: 100, percentage: 0 };

    // Show upgrade alert if usage is high
    const shouldShowUpgradeAlert = urlUsage.percentage >= 95 && currentUser?.tier === "FREE";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Upgrade Alert */}
            {shouldShowUpgradeAlert || showUpgradeAlert && (
                <UpgradeAlert
                    setShowUpgradeAlert={setShowUpgradeAlert}
                    //currentUsage={urlUsage.current}
                    //maxLimit={urlUsage.limit}
                />
            )}

            {/* Navbar */}
            <Navbar setShowMobileMenu={setShowMobileMenu} showMobileMenu={showMobileMenu} />

            {/* Mobile Menu */}
            {showMobileMenu && currentUser && (
                <div className="md:hidden bg-white border-b shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a href="#" className="bg-blue-50 text-blue-700 block px-3 py-2 rounded-md font-medium">
                            Dashboard
                        </a>
                        <a href="#" className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md font-medium">
                            Analytics
                        </a>
                        <a href="#" className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md font-medium">
                            Settings
                        </a>
                        <div className="pt-4 border-t">
                            <div className="flex items-center px-3 py-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                    {currentUser.firstName?.charAt(0) || currentUser.email?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {currentUser.firstName && currentUser.lastName
                                            ? `${currentUser.firstName} ${currentUser.lastName}`
                                            : currentUser.email?.split('@')[0] || "User"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {currentUser.tier === "FREE" ? "Free" : currentUser.tier} Tier • {urlUsage.current}/{urlUsage.limit} URLs
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">URL Dashboard</h1>
                    <p className="text-gray-600 mt-2">Create, manage, and track your shortened URLs</p>
                    {currentUser && (
                        <div className="mt-2 text-sm text-gray-500">
                            Welcome back, {currentUser.firstName || currentUser.email?.split('@')[0]}!
                        </div>
                    )}
                </div>

                {/* Stats Cards user={currentUser} */}
                <Cards  />

                {/* URL Shortener Section */}
                <CreateShortener />

                {/* URL Management Section */}
                <URLManagement />

                {/* Upgrade Banner - Show only for free tier users */}
                {currentUser?.tier === "FREE" && <UpgradeBanner />}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Dashboard;