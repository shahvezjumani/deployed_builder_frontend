import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "lenis/dist/lenis.css";
import UserAuthProvider from "./components/contexts/userAuthProvider.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      <Route path="/profile/home" element={<App />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/:slug" element={<Profile />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserAuthProvider>
      <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
    </UserAuthProvider>
  </StrictMode>
);
