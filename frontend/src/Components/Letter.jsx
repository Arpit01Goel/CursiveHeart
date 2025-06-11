import React, { useState, useRef, useEffect } from "react";
import bgImage from "../assets/BG.jpg";
import MainNavbar from "./MainNavbar";

function Letter() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [title, setTitle] = useState(""); // State for the title
  const [date, setDate] = useState(""); // State for the date
  const [content, setContent] = useState(""); // State for the letter content
  const [password, setPassword] = useState(""); // State for encryption password
  const [favourite, setFavourite] = useState(false); // State for marking as favourite
  const [pin, setPin] = useState(false); // State for pinning the letter
  const [images, setImages] = useState([]); // State for storing uploaded images
  const [fontSize, setFontSize] = useState(16); // State for font size
  const [showFontControls, setShowFontControls] = useState(false); // Toggle for font size controls
  const [showSidebar, setShowSidebar] = useState(false); // Toggle for sidebar visibility
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode
  const [isPublic, setIsPublic] = useState(false); // State for public view

  const textareaRef = useRef(null); // Ref for the textarea

  // Detect fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Content cannot be empty!");
      return;
    }

    const token = sessionStorage.getItem("authToken"); // Retrieve JWT from sessionStorage

    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch("API_BASE_URL/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT in the Authorization header
        },
        body: JSON.stringify({
          title,
          date,
          content,
          password,
          favourite,
          pin,
          images,
          public: isPublic, // Include public state
          isEncrypted: !!password, // Set isEncrypted based on whether a password is provided
          username: sessionStorage.getItem("username"), // Include username from sessionStorage


        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTitle(""); // Clear title after saving
        setDate(""); // Clear date after saving
        setContent(""); // Clear content after saving
        setPassword(""); // Clear password after saving
        setFavourite(false); // Reset favourite
        setPin(false); // Reset pin
        setImages([]); // Clear images
        console.log("Letter Saved:", data);
        alert("Letter saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to save letter: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving letter:", error);
      alert("An error occurred while saving the letter.");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readerPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Convert image to Base64
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then((base64Images) => {
      setImages((prevImages) => [...prevImages, ...base64Images]); // Append new images
    });
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32)); // Limit max font size
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12)); // Limit min font size
  };

  return (
    <>
      {!isFullscreen && <MainNavbar />}
      <div
        className="flex flex-col items-center justify-start min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Sidebar */}
        <div
          className={`absolute left-0 top-auto bg-gray-800 text-white p-2 flex flex-col items-center gap-4 w-16 md:w-20 lg:w-24 h-full transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <button
            onClick={() => setShowFontControls((prev) => !prev)}
            className="bg-blue-500 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded hover:bg-blue-600"
            aria-label="Toggle font size controls"
          >
            A
          </button>
          {showFontControls && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <button
                onClick={increaseFontSize}
                className="bg-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded hover:bg-gray-600"
                aria-label="Increase font size"
              >
                +
              </button>
              <button
                onClick={decreaseFontSize}
                className="bg-gray-700 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded hover:bg-gray-600"
                aria-label="Decrease font size"
              >
                -
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className="bg-gray-700 opacity-85 text-amber-200 rounded-lg shadow-lg w-full md:w-4/5 lg:w-3/4 xl:w-2/3 p-4 md:p-8 mt-16 md:ml-20 overflow-auto resize flex flex-col h-full"
        >
          {/* Title and Date Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="w-full md:w-1/2 px-4 py-2 border-b border-gray-800 focus:outline-none focus:ring-blue-500"
            />
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Enter Date"
              className="w-full md:w-auto px-4 py-2 border-b border-gray-800 focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Writing Area */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your letter here..."
            style={{
              fontSize: `${fontSize}px`,
              minHeight: "400px", // Default height
            }}
            className="flex-grow w-full h-auto px-4 py-2 border border-gray-800 rounded resize md:resize-y"
          ></textarea>

          {/* Save Button and Additional Options */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 w-full md:w-auto"
            >
              Save Letter
            </button>
            <div>
              <label className="block mb-2">Upload Images:</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="block"
              />
            </div>
            
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isPublic}
    onChange={(e) => setIsPublic(e.target.checked)}
  />
  Public View
</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={pin}
                onChange={(e) => setPin(e.target.checked)}
              />
              Pin
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={favourite}
                onChange={(e) => setFavourite(e.target.checked)}
              />
              Favourite
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password (Optional)"
              className="w-full md:w-auto px-4 py-2 border-b border-gray-800 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Letter;