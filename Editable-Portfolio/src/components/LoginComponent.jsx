import { useRef, useEffect, useState } from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import useUserAuthContext from "./contexts/userAuthContext";
import Popup from "./Popup";
import { loginUser } from "../services/api.js";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const { login } = useUserAuthContext(); // login from UserAuthProvider

  // Close error popup after a delay
  useEffect(() => {
    if (error) {
      setShowErrorPopup(true);
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      setError(null);
      login(); // make the status true
      navigate("/profile/home");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setShowErrorPopup(true);
    }
  };

  const handleForgetPassword = async () => {
    // will write code here
  };

  return (
    <div className="flex h-screen w-full bg-zinc-900 relative">
      {/* Error Popup */}
      {showErrorPopup && (
        <Popup message={error} onClick={() => setShowErrorPopup(false)} />
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

          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <Input
                type={"email"}
                className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
                placeholder="Enter your email"
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <Input
                type={"password"}
                className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
                placeholder="Enter your password"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                showPasswordToggle={true}
                required
              />
              <button
                type="button"
                onClick={() => navigate("/verifyOtp/password")}
                className="text-red-400 hover:text-red-300 font-medium text-sm ml-1 transition"
              >
                Forget Password
              </button>
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
