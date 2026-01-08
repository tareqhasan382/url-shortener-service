import { FaLink } from "react-icons/fa";
import { FiLogOut, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useGetMeQuery } from "../Redux/user/userApi";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "../Redux/auth/authSlice";
import { toast } from "react-toastify";
import type { RootState } from "../Redux/store.ts";

interface NavbarProps {
    setShowMobileMenu: (show: boolean) => void;
    showMobileMenu: boolean;
}

// Define valid tier types
//type UserTier = "FREE" | "PREMIUM" | "ENTERPRISE";

// Type guard to check if tier is valid
// const isValidTier = (tier: string | undefined): tier is UserTier => {
//     return tier === "FREE" || tier === "PREMIUM" || tier === "ENTERPRISE";
// };

export const Navbar = ({
                           setShowMobileMenu,
                           showMobileMenu,
                       }: NavbarProps) => {
    const dispatch = useDispatch();
    const { accessToken, user: storedUser } = useSelector((state: RootState) => state.auth);

    // Fetch user profile if we have token but no full user data
    const {
        data: userData,
        isLoading
    } = useGetMeQuery(undefined, {
        skip: !accessToken || !!storedUser?.id,
        refetchOnMountOrArgChange: true,
    });

    // Use fetched user data or stored user data
    // Note: userData is the API response which has { data, success, message }
    // So we need to extract the user object from it
    const apiUser = userData;
    const user = apiUser || storedUser;

    const handleMobileMenuToggle = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const handleLogout = () => {
        try {
            dispatch(userLoggedOut());
            toast.success("Logged out successfully");
        } catch (err) {
            console.error("Logout error:", err);
            dispatch(userLoggedOut());
            toast.success("Logged out successfully");
        }
    };

    // Get user initials
    const getUserInitials = (): string => {
        if (!user?.firstName && !user?.lastName) {
            return user?.email?.charAt(0).toUpperCase() || "U";
        }
        return `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase();
    };

    // Get tier display text
    const getTierDisplay = (): string => {
        const tier = user?.tier;

        switch (tier) {
            case "FREE":
                return "Free Tier";
            case "PREMIUM":
                return "Premium";
            case "ENTERPRISE":
                return "Enterprise";
            default:
                return "Free Tier";
        }
    };

    // Get tier color class
    const getTierColor = (): string => {
        const tier = user?.tier;

        switch (tier) {
            case "FREE":
                return "from-blue-500 to-purple-500";
            case "PREMIUM":
                return "from-yellow-500 to-orange-500";
            case "ENTERPRISE":
                return "from-purple-500 to-pink-500";
            default:
                return "from-blue-500 to-purple-500";
        }
    };

    // Get display name
    const getDisplayName = (): string => {
        if (!user?.data) return "User";

        if (user?.data.firstName && user?.data.lastName) {
            return `${user?.data.firstName} ${user?.data.lastName}`;
        }

        if (user?.data.firstName) {
            return user?.data.firstName;
        }

        if (user?.data.email) {
            return user?.data.email.split('@')[0];
        }

        return "User";
    };

    if (isLoading) {
        return (
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <FaLink className="h-8 w-8 text-blue-600" />
                                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Short.ly
                </span>
                            </div>
                        </div>
                        <div className="animate-pulse flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="hidden md:block">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <FaLink className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Short.ly
              </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-8 md:flex md:space-x-6">
                            <a
                                href="#"
                                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors duration-200"
                            >
                                Dashboard
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors duration-200"
                            >
                                Analytics
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors duration-200"
                            >
                                Settings
                            </a>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group cursor-pointer">
                                    <div
                                        className={`w-8 h-8 bg-gradient-to-r ${getTierColor()} rounded-full flex items-center justify-center text-white font-semibold`}
                                    >
                                        {getUserInitials()}
                                    </div>
                                    <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">
                      {getDisplayName()}
                    </span>
                                        <span className="text-xs text-gray-500">{getTierDisplay()}</span>
                                    </div>
                                    <FiUser className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                    aria-label="Logout"
                                    title="Logout"
                                >
                                    <FiLogOut className="w-5 h-5 text-gray-500" />
                                </button>
                            </>
                        ) : (
                            <div className="text-sm text-gray-600">
                                <a href="/login" className="text-blue-600 hover:text-blue-800">
                                    Sign In
                                </a>
                            </div>
                        )}

                        <button
                            onClick={handleMobileMenuToggle}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                            aria-expanded={showMobileMenu}
                        >
                            {showMobileMenu ? (
                                <FiX className="w-6 h-6 text-gray-700" />
                            ) : (
                                <FiMenu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};