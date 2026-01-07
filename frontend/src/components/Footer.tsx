import {FaLink} from "react-icons/fa";

export const Footer: React.FC = () => {
    return (
        <footer className="mt-12 border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <FaLink className="h-6 w-6 text-blue-600" />
                        <span className="ml-2 text-lg font-bold">Short.ly</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2024 TechNext Assignment. All rights reserved.
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-gray-500 hover:text-blue-600">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-blue-600">Terms</a>
                        <a href="#" className="text-gray-500 hover:text-blue-600">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}