import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function MainNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to determine if link is active
  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    // Clear the authentication token
    sessionStorage.removeItem("authToken");
    // Redirect to the login page
    navigate("/Auth/login", { replace: true });
  };

  return (
    <nav className="bg-gray-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - clicking takes you home */}
        <Link to="/home">
          <h1 className="text-white text-lg font-bold cursor-pointer">Red Moon</h1>
        </Link>

        {/* Navigation Links */}
        <div>
          <Link 
            to="/home" 
            className={`text-white px-4 ${isActive('/home') ? 'underline font-bold' : 'hover:underline'}`}
          >
            Home
          </Link>
          <Link 
            to="/letter" 
            className={`text-white px-4 ${isActive('/letter') ? 'underline font-bold' : 'hover:underline'}`}
          >
            Letters
          </Link>
          <Link 
            to="/profile" 
            className={`text-white px-4 ${isActive('/profile') ? 'underline font-bold' : 'hover:underline'}`}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-white px-4 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;