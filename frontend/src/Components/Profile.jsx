import React, { useState } from "react";
import MainNavbar from "./MainNavbar.jsx"; // Assuming you have a MainNavbar component

function Profile() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [username, setUsername] = useState("");
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null); // State for the selected letter
  const [filters, setFilters] = useState({ all: true, favourite: false, pin: false }); // Filters state

  const fetchPublicLetters = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/public?username=${username}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setLetters(data);
        setError("");
      } else {
        setError("Failed to fetch public letters for the given username.");
        setLetters([]);
      }
    } catch (err) {
      console.error("Error fetching public letters:", err);
      setError("An error occurred while fetching public letters.");
      setLetters([]);
    }
  };

  const fetchFullLetter = async (letterId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/public/letters/${letterId}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const fullLetter = await response.json();
        setSelectedLetter(fullLetter); // Set the full letter content
      } else {
        console.error("Failed to fetch full letter content.");
      }
    } catch (err) {
      console.error("Error fetching full letter content:", err);
    }
  };

  const groupLettersByWeek = (letters) => {
    const weeks = {};

    letters.forEach((letter) => {
      const date = new Date(letter.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay())); // Start of the week (Sunday)
      const weekKey = weekStart.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(letter);
    });

    return weeks;
  };

  const applyFilters = (letters) => {
    if (filters.all) {
      return letters; // Show all letters if "all" is selected
    }

    return letters.filter((letter) => {
      const matchesFavourite = filters.favourite ? letter.favourite : true;
      const matchesPin = filters.pin ? letter.pin : true;

      return matchesFavourite && matchesPin;
    });
  };

  const toggleFilter = (filterKey) => {
    setFilters((prevFilters) => {
      if (filterKey === "all") {
        // If "All" is clicked, reset all other filters
        return { all: true, favourite: false, pin: false };
      } else {
        // If any other filter is clicked, disable "All" and toggle the specific filter
        return {
          ...prevFilters,
          all: false, // Disable "All" when any specific filter is toggled
          [filterKey]: !prevFilters[filterKey],
        };
      }
    });
  };

  const openLetter = (letterId) => {
    fetchFullLetter(letterId); // Fetch the full content of the letter
  };

  const closeLetter = () => {
    setSelectedLetter(null); // Clear the selected letter
  };

  const filteredLetters = applyFilters(letters);
  const groupedLetters = groupLettersByWeek(filteredLetters); // Group letters by week after applying filters

  return (
    <>
      <MainNavbar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
        {/* Input Box for Username */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-8">
          <h1 className="text-2xl font-bold text-center mb-4">Search Profiles</h1>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            onClick={fetchPublicLetters}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => toggleFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filters.all ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => toggleFilter("favourite")}
            className={`px-4 py-2 rounded-md ${
              filters.favourite ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Favourites
          </button>
          <button
            onClick={() => toggleFilter("pin")}
            className={`px-4 py-2 rounded-md ${
              filters.pin ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Pins
          </button>
        </div>

        {/* Display Public Letters Grouped by Week */}
        <div className="w-full max-w-6xl">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {Object.keys(groupedLetters).length > 0 ? (
            Object.keys(groupedLetters).map((weekKey) => (
              <div key={weekKey} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Week Starting: {weekKey}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedLetters[weekKey].map((letter) => (
                    <div
                      key={letter._id}
                      className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                      onClick={() => openLetter(letter._id)} // Fetch full letter on click
                    >
                      <h3 className="text-lg font-bold mb-2">{letter.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Date: {new Date(letter.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700 truncate mb-2">{letter.content}</p>
                      <div className="flex space-x-2 text-sm">
                        {letter.favourite && (
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                            Favourite
                          </span>
                        )}
                        {letter.pin && (
                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                            Pinned
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            !error && (
              <div className="text-center text-gray-500">
                No public letters found for this username.
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal for Selected Letter */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay */}
          <div className="fixed inset-0 bg-gray-700 " style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>

          {/* Modal Content */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full max-h-8/12  w-full max-w-10/12 relative z-60 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedLetter.title}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Date: {new Date(selectedLetter.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4" style={{ whiteSpace: "pre-wrap" }}>
              {selectedLetter.content}
            </p>
            <button
              onClick={closeLetter}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;