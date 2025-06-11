import React from "react"
import {Routes, Route} from "react-router-dom"
import Home from "../Components/Home.jsx"
import MainNavbar from "../Components/MainNavbar.jsx"
// import "../Components/Letter.jsx"
export default function Main() {
    return (
        <>

            <MainNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    )
}