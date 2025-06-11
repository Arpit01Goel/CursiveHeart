import React from "react"
import Main from "./Pages/Main.jsx"
import Authentication from "./Pages/Authentication.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 
import Profile from "./Components/Profile.jsx";
import Letter from "./Components/Letter.jsx";
import Welcome from "./Components/Welcome.jsx";

function App() {
  
  return (
    <Router>
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