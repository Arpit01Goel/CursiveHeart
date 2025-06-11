import React, { useEffect, useState } from "react";
// Decrypt function for the frontend
// import CryptoJS from "crypto-js";



function Home() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [filters, setFilters] = useState({ all: true, favourite: false, pin: false, public: false }); // Multiple filters
  
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
          setError("You are not logged in. Please log in first.");
          return;
        }

        const response = await fetch("${API_BASE_URL}/api/data", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const lettersData = await response.json();
          setLetters(lettersData);
        } else {
          setError("Failed to fetch letters.");
        }
      } catch (err) {
        setError("An error occurred while fetching letters.");
        console.error(err);
      }
    };

    fetchLetters();
  }, []);

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
      const matchesPublic = filters.public ? letter.public : true;

      return matchesFavourite && matchesPin && matchesPublic;
    });
  };

  const toggleFilter = (filterKey) => {
    setFilters((prevFilters) => {
      if (filterKey === "all") {
        // If "All" is clicked, reset all other filters
        return { all: true, favourite: false, pin: false, public: false };
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

  const groupedLetters = groupLettersByWeek(applyFilters(letters));

  const openLetter = async (letter) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/data/letters/${letter._id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const fullLetter = await response.json();
        setSelectedLetter(fullLetter);
      } else {
        console.error("Failed to fetch full letter content. Status:", response.status);
      }
    } catch (err) {
      console.error("Error fetching full letter content:", err);
    }
  };

  const closeLetter = () => {
    setSelectedLetter(null);
  };

  const updateLetterStatus = async (updatedLetter) => {
    try {
      const token = sessionStorage.getItem("authToken");
  
      // Exclude the decryptedContent field before sending the update
      const { _ , ...letterToUpdate } = updatedLetter;
  
      const response = await fetch(
        `${API_BASE_URL}/api/data/letters/${updatedLetter._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(letterToUpdate),
        }
      );
  
      if (response.status === 200) {
        const updatedData = await response.json();
  
        // Truncate the content for the updated letter
        const truncatedContent =
          updatedData.content.length > 25
            ? updatedData.content.substring(0, 25) + "..."
            : updatedData.content;
  
        const updatedLetters = letters.map((letter) =>
          letter._id === updatedData._id
            ? { ...updatedData, content: truncatedContent }
            : letter
        );
  
        setLetters(updatedLetters);
        closeLetter();
      } else {
        console.error("Failed to update letter status. Status:", response.status);
      }
    } catch (err) {
      console.error("Error updating letter status:", err);
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl text-center mt-4">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Letters!</h1>
        <p className="text-gray-600">Manage your letters, favourites, pins, and public visibility easily.</p>
      </div>

      {/* Sort Tags */}
      <div className="flex space-x-4 mb-6 mt-4 w-full max-w-4xl justify-center">
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
        <button
          onClick={() => toggleFilter("public")}
          className={`px-4 py-2 rounded-md ${
            filters.public ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Public
        </button>
      </div>

      {/* Letters List */}
      <div className="w-full max-w-6xl">
        {Object.keys(groupedLetters).map((weekKey) => (
          <div key={weekKey} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Week Starting: {weekKey}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedLetters[weekKey].map((letter) => (
                <div
                  key={letter._id}
                  className="bg-white p-4 rounded-lg shadow-md relative cursor-pointer"
                  onClick={() => openLetter(letter)}
                >
                  <h3 className="text-lg font-bold mb-2">{letter.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Date: {new Date(letter.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-2">{letter.content}</p>
                  <div className="flex space-x-2 text-sm">
                    {letter.public && (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                        Public
                      </span>
                    )}
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
        ))}
      </div>

      {/* Letter Dialog */}
      
      

{selectedLetter && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="fixed inset-0 bg-black"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={closeLetter}
    ></div>
    <div className="bg-white p-6 rounded-lg shadow-md h-full max-h-8/12 w-full max-w-10/12 relative z-60 overflow-y-auto">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <input
          id="decryptPassword"
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-md px-2 py-1 w-40 text-sm"
          value={selectedLetter.password || ""}
          onChange={(e) =>
            setSelectedLetter({ ...selectedLetter, password: e.target.value })
          }
        />
        <button
  onClick={async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(
        "${API_BASE_URL}/api/data/letters/${selectedLetter._id}/decrypt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: selectedLetter.password }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        // Store the decrypted content in a separate field
        setSelectedLetter({ ...selectedLetter, decryptedContent: data.decryptedContent });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to decrypt the letter.");
      }
    } catch (err) {
      console.error("Error decrypting letter:", err);
      alert("An error occurred while decrypting the letter.");
    }
  }}
  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
>
  Decrypt
</button>
      </div>
      <h2 className="text-2xl font-bold mb-6">{selectedLetter.title}</h2>
      <p className="text-gray-600 text-sm mb-4">
        Date: {new Date(selectedLetter.date).toLocaleDateString()}
      </p>
      <p
        className="text-gray-700 mb-6"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {selectedLetter.decryptedContent || selectedLetter.content}
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={closeLetter}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => updateLetterStatus(selectedLetter)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Home;