import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import axios from "axios";
import { useEffect } from "react";
import Popup from "./Popup";

const SignupComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [flag, setFlag] = useState(false);
  const [message, setMessage] = useState("");

  // Close error popup after a delay
  useEffect(() => {
    if (message) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        setMessage(null);
        setFlag(false);
      }, 2000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    // Email validation
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setError(null);
      // setShowPopup(true);
      // setMessage("Check your email and Get OTP for verification");
      // setFlag(true);
      // navigate("/");
      navigate(`/verifyOtp/${response.data?.data?.slug}`);
      // setTimeout(() => {
      //   navigate(`/verifyOtp/${response.data?.data?.slug}`);
      // }, 4000);
    } catch (err) {
      setShowPopup(true);
      setMessage(err.response?.data?.message || "Something went wrong");
      // setError(err.response?.data?.message || "Something went wrong");
      setResponse(null);
    }
  };
  console.log(response);

  return (
    <div className="flex h-screen w-full bg-zinc-900">
      {showPopup && (
        <Popup
          message={message}
          onClick={() => setShowPopup(false)}
          flag={flag}
        />
      )}

      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="bg-zinc-800/60 backdrop-blur-lg p-10 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-semibold text-zinc-200 text-center mb-6">
            Create an Account
          </h2>

          <form onSubmit={(e) => handleFormSubmit(e)}>
            <div className="mb-4">
              <Input
                type={"text"}
                className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
                placeholder="Enter your username"
                label="Username"
                required
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                type={"email"}
                className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
                placeholder="Enter your email"
                label="Email"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>
            <div className="mb-6">
              <Input
                type={"password"}
                className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
                placeholder="Enter your password"
                label="Password"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                showPasswordToggle={true}
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-zinc-300 font-semibold py-2 rounded-lg hover:bg-zinc-600 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 h-full justify-center items-center">
        <img
          className="w-[55%] h-auto object-cover rounded-xl shadow-lg"
          src="/images/chen-Qtu3hGinLF8-unsplash.jpg"
          alt="AI Concept"
        />
      </div>
    </div>
  );
};

export default SignupComponent;
