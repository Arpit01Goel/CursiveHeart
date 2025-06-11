import React from "react";
import { Link, useNavigate } from "react-router-dom";

function MainNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token
    sessionStorage.removeItem("authToken");
    // Redirect to the login page
    navigate("/Auth/login");
  };

  return (
    <nav className="bg-gray-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-white text-lg font-bold">Red Moon</h1>

        {/* Navigation Links */}
        <div>
          <Link to="/home" className="text-white px-4 hover:underline">
            Home
          </Link>
          <Link to="/letter" className="text-white px-4 hover:underline">
            Letters
          </Link>
          <Link to="/profile" className="text-white px-4 hover:underline">
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