import React from "react";
import {   Routes, Route } from "react-router-dom";
import Login from "../Components/Login.jsx";
import SignUp from "../Components/SignUp.jsx";
import Root from "../Components/Root.jsx";
import Navbar from "../Components/Navbar.jsx";


function Authentication() {
    
    return (
      
        <>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Root />} />
  
          
        </Routes>
        </>
    );
  }


export default Authentication;