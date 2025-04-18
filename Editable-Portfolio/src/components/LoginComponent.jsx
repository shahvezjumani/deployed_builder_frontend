import React, { useRef, useEffect, useState, useContext } from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserAuthContext from "./contexts/userAuthContext";
// import useUserContext from "./contexts/UserContext";\
// import { UserAuthContext } from "./contexts/userAuthProvider";

const LoginComponent = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const { login } = useUserAuthContext();

  // Close error popup after a delay
  useEffect(() => {
    if (error) {
      setShowErrorPopup(true);
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
        setError(null);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleOnClick = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log("Email:", email, "Password:", password);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        { email, password },
        {
          withCredentials: true, // Send cookies if using sessions
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(response.data);
      setError(null);
      login();

      // dispatch(authLogin(response.data.data));
      // console.log(response.data.data.user);

      // updateUserProfile(response.data.data.user);
      navigate("/home");
      //   setFormData({ email: "", password: "" });
    } catch (err) {
      let errorMessage = "Something went wrong Shahvez";
      if (err.response?.data) {
        // Try to extract the error message from the HTML response
        const match = err.response.data.match(/<pre>(.*?)<\/pre>/);

        if (match && match[1]) {
          errorMessage = match[1].trim().replace("Error: ", "");
        }
      }

      setError(errorMessage);
      setShowErrorPopup(true);
      setResponse(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-900 relative">
      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
          <button
            className="ml-4 text-white hover:text-red-200"
            onClick={() => setShowErrorPopup(false)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="hidden md:flex w-1/2 h-full justify-center items-center">
        <img
          className="w-[55%] h-auto object-cover rounded-xl shadow-lg"
          src="/images/chen-Qtu3hGinLF8-unsplash.jpg"
          alt="AI Concept"
        />
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="bg-zinc-800/60 backdrop-blur-lg p-10 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-semibold text-zinc-200 text-center mb-6">
            Login
          </h2>
          <form onSubmit={(e) => handleOnClick(e)}>
            <div className="mb-4">
              <Input
                type={"email"}
                className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
                placeholder="Enter your email"
                label="Email"
                ref={emailRef}
                required
              />
            </div>
            <div className="mb-6">
              <Input
                type={"password"}
                className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
                placeholder="Enter your password"
                label="Password"
                ref={passwordRef}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-zinc-300 font-semibold py-2 rounded-lg hover:bg-zinc-600 transition"
            >
              Login
            </button>
            <div className="mt-6 text-center">
              <p className="text-zinc-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-red-400 hover:text-red-300 font-medium ml-1 transition"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
