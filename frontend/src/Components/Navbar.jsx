import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  
  // Helper function to determine if link is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">RedMoon</h1>
        <div className="space-x-4">
          <Link 
            to="/" 
            className={`hover:underline ${isActive('/') ? 'font-bold underline' : ''}`}
          >
            Root
          </Link>
          <Link 
            to="/Auth/login" 
            className={`hover:underline ${isActive('/Auth/login') ? 'font-bold underline' : ''}`}
          >
            Login
          </Link>
          <Link 
            to="/Auth/signup" 
            className={`hover:underline ${isActive('/Auth/signup') ? 'font-bold underline' : ''}`}
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;