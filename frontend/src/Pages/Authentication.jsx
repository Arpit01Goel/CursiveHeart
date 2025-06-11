import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";

function Authentication() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default Authentication;