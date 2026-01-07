import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const Layout = () => {
    return (
        <div className="bg-[#FDF8EE] w-full h-auto overflow-hidden">
            {/*<div className="shadow fixed bg-[#FDF8EE] text-white top-0 z-50 w-full ">*/}
            {/*  pt-[90px] bg-[#FDF8EE]  /!*<Navbar />*!/*/}
            {/*</div>*/}

            <div className="mx-auto w-full h-full ">
                <Outlet></Outlet>
            </div>
            {/*<Footer />*/}
        </div>
    );
};

export default Layout;