import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to RedMoon</h1>
          <p className="text-gray-700 mb-6">
            This is the home page of your application. Navigate to Login or Sign Up to get started.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/Auth/login"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </a>
            <a
              href="/Auth/signup"
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;