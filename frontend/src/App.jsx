import React from "react"
import Main from "./Pages/Main.jsx"
import Authentication from "./Pages/Authentication.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./Components/Profile.jsx";
import Letter from "./Components/Letter.jsx";
import Welcome from "./Components/Welcome.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import Root from "./Components/Root.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Welcome /> },
  { 
    path: "/Auth", 
    element: <Authentication />,
    children: [
      { path: "", element: <Root /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ]
  },
  { path: "/home/*", element: <Main /> },
  { path: "/letter", element: <Letter /> },
  { path: "/profile", element: <Profile /> }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;