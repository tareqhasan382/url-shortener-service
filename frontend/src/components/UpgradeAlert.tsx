import { FiAlertCircle, FiX } from "react-icons/fi";

interface UpgradeAlertProps {
    setShowUpgradeAlert: (show: boolean) => void;
}

function UpgradeAlert({ setShowUpgradeAlert }: UpgradeAlertProps) {
    const handleClose = () => {
        setShowUpgradeAlert(false);
    };

    const handleUpgrade = () => {
        // Handle upgrade logic here
        console.log("Upgrade clicked");
    };

    const handleLater = () => {
        setShowUpgradeAlert(false);
    };

    return (
        <div className="fixed top-4 right-4 max-w-sm bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-lg p-4 animate-fade-in z-50">
            <div className="flex items-start">
                <FiAlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-yellow-800 text-base">Limit Reached!</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                        You've reached the maximum of 100 URLs. Upgrade to Premium for unlimited links!
                    </p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleLater}
                            className="px-3 py-1.5 text-sm border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleUpgrade}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="text-yellow-500 hover:text-yellow-700 ml-2 flex-shrink-0"
                    aria-label="Close alert"
                >
                    <FiX className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default UpgradeAlert;