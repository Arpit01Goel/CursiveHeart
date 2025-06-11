import React from "react"
import Main from "./Pages/Main.jsx"
import Authentication from "./Pages/Authentication.jsx";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // 
import Profile from "./Components/Profile.jsx";
import Letter from "./Components/Letter.jsx";
import Welcome from "./Components/Welcome.jsx";

function App() {
  // console.log("hello");
  // console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL); // Log the API base URL for debugging
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/Auth/*" element={<Authentication />} />
        <Route path="/home/*" element={<Main />} />
        <Route path="/letter" element={<Letter />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;