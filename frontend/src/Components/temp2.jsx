import React, { useEffect, useState } from "react";
import LetterList from "./temp1";

function ShowLetters({ fetchUrl, headers = {} }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [letters, setLetters] = useState([]);
  const [error, setError] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null); // For the modal
  const [password, setPassword] = useState(""); // For decryption
  const [decryptedContent, setDecryptedContent] = useState(""); // Decrypted content

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch(fetchUrl, {
          method: "GET",
          headers,
        });

        if (response.status === 200) {
          const data = await response.json();
          setLetters(data);
          setError("");
        } else {
          setError("Failed to fetch letters.");
        }
      } catch (err) {
        console.error("Error fetching letters:", err);
        setError("An error occurred while fetching letters.");
      }
    };

    fetchLetters();
  }, [fetchUrl, headers]);

  const handleDecrypt = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ content: selectedLetter.content, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setDecryptedContent(data.decryptedContent);
      } else {
        alert("Failed to decrypt the content. Please check the password.");
      }
    } catch (err) {
      console.error("Error decrypting content:", err);
      alert("An error occurred while decrypting the content.");
    }
  };

  const toggleProperty = async (property) => {
    try {
      const updatedLetter = {
        ...selectedLetter,
        [property]: !selectedLetter[property],
      };

      const response = await fetch(`${API_BASE_URL}/api/letters/${selectedLetter._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ [property]: updatedLetter[property] }),
      });

      if (response.status === 200) {
        setSelectedLetter(updatedLetter);
        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter._id === updatedLetter._id ? updatedLetter : letter
          )
        );
      } else {
        alert(`Failed to update ${property}.`);
      }
    } catch (err) {
      console.error(`Error updating ${property}:`, err);
      alert(`An error occurred while updating ${property}.`);
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div>
      <LetterList
        letters={letters}
        onLetterClick={(letter) => {
          setSelectedLetter(letter);
          setDecryptedContent(""); // Reset decrypted content
          setPassword(""); // Reset password
        }}
      />

      {/* Modal for showing letter details */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedLetter(null)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedLetter.title}</h2>
            <p className="text-gray-600 mb-4">
              Date: {new Date(selectedLetter.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4">
              {decryptedContent || selectedLetter.content}
            </p>

            {/* Decrypt Section */}
            {selectedLetter.isEncrypted && (
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter password to decrypt"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full mb-2"
                />
                <button
                  onClick={handleDecrypt}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Decrypt
                </button>
              </div>
            )}

            {/* Toggle Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => toggleProperty("pin")}
                className={`py-2 px-4 rounded-md ${
                  selectedLetter.pin
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {selectedLetter.pin ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={() => toggleProperty("favourite")}
                className={`py-2 px-4 rounded-md ${
                  selectedLetter.favourite
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {selectedLetter.favourite ? "Unfavourite" : "Favourite"}
              </button>
              <button
                onClick={() => toggleProperty("public")}
                className={`py-2 px-4 rounded-md ${
                  selectedLetter.public
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {selectedLetter.public ? "Make Private" : "Make Public"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowLetters;