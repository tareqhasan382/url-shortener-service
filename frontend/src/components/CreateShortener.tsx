import {FiLink, FiPlus} from "react-icons/fi";
import {useCreateUrlMutation} from "../Redux/url/urlApi.ts";
import {toast} from "react-toastify";
import {useState} from "react";

export const CreateShortener = () => {
    const [longUrl, setLongUrl] = useState('');
    const [createUrl, { isLoading, error }] = useCreateUrlMutation();
    const generateShortUrl = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await createUrl({
                originalUrl: longUrl,
            }).unwrap();
            toast.success("Create New Short URL successful");
            setLongUrl("");
        } catch (err) {
            console.error("Failed to create short URL", err);
            toast.error("Failed to create short URL");
        }
    };
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center mb-6">
                <FiPlus className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Create New Short URL</h2>
            </div>

            <form onSubmit={generateShortUrl} className="space-y-4">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your long URL
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="url"
                            id="longUrl"
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            placeholder="https://www.example.com/very-long-url-path/that-needs-shortening"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center"
                        >
                            <FiLink className="w-5 h-5 mr-2" />
                            Shorten URL
                        </button>
                    </div>
                </div>

            </form>
            {error && <p>Create New Short URL Field</p>}
        </div>
    )
}