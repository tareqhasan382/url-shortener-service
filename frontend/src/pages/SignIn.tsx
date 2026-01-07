import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/login.jpg";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLoginMutation } from "../Redux/auth/authApi";
export interface LoginData {
    email: string;
    password: string;
}
const SignIn: React.FC = () => {
    const [login, { isLoading, isError }] = useLoginMutation();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data: LoginData = {
                email,
                password,
            };

            const result = await login(data).unwrap();

            if (result) {
                toast.success("Login successful");
                navigate("/");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <div className="lg:px-28 px-2 py-10 w-full h-auto bg-white flex flex-col items-center gap-10">
            <h1 className=" text-4xl font-bold ">Sign In</h1>
            <div className=" w-full grid lg:grid-cols-2 items-center justify-center gap-10">
                <div className=" w-full h-auto ">
                    <img
                        src={loginImage}
                        alt="Login Image"
                        className=" w-full h-full object-cover "
                    />
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="  ">
                        <div className="relative z-0 w-full mb-6 group">
                            <input
                                type="text"
                                name="email"
                                id="email"
                                className="block py-2.5 px-0 w-full text-sm md:text-base text-black font-semibold bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                // required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label
                                className="peer-focus:font-bold absolute text-sm md:text-base font-bold text-black duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                htmlFor="floating_student_name"
                            >
                                Email
                                <span className=" text-red-500 text-sm md:text-base font-bold ">
                  *
                </span>
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="block py-2.5 px-0 w-full text-sm md:text-base text-black font-semibold bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                // required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label
                                className="peer-focus:font-bold absolute text-sm md:text-base font-bold text-black duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                htmlFor="floating_student_name"
                            >
                                password
                                <span className=" text-red-500 text-sm md:text-base font-bold ">
                  *
                </span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white font-bold py-2.5 px-4 rounded-md mt-4"
                        >
                            {isLoading ? "Logging in..." : "Sign In"}
                        </button>
                        <div>
                            <h1>
                                New User ? Please{" "}
                                <Link to="/sign-up" className=" text-blue-600 underline ">
                                    Sign Up{" "}
                                </Link>
                            </h1>
                        </div>
                    </form>
                    {isError && (
                        <p className="text-red-500 mt-2">Login failed. Please try again.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignIn;