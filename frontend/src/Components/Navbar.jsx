import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

function Navbar() {

    return (
        <>
        <nav className="bg-gray-800 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">RedMoon</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Root
          </Link>
          <Link to="/Auth/login" className="hover:underline">
            Login
          </Link>
          <Link to="/Auth/signup" className="hover:underline">
            Sign Up
          </Link>
        </div>
      </nav>
        </>
    )
}


export default Navbar;