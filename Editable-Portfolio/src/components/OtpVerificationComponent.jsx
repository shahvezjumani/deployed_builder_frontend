import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "./Popup";

const OtpVerificationComponent = ({ path, data }) => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // console.log(window.location.pathname);
  // const location = useLocation();

  console.log(location.pathname, "location");

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      if (index < inputRefs.current.length) {
        inputRefs.current[index].value = value;
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    console.log(e.target.value, "key");

    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    console.log(e.clipboardData.getData("text"), "data");

    const paste = e.clipboardData.getData("text").trim();
    if (/^\d+$/.test(paste)) {
      paste.split("").forEach((char, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = char;
          inputRefs.current[i + 1]?.focus();
        }
      });
      // inputRefs.current[]?.focus(); // move focus to the last input
    }
    e.preventDefault(); // prevent default paste
  };

  useEffect(() => {
    if (message) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        setMessage(null);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleVerify = async () => {
    try {
      const otp = inputRefs.current.map((ref) => ref.value).join("");
      console.log("OTP Entered:", otp);
      console.log(data, "I am the data");
      // Add your verification logic here
      // code for OTP verification will write here in future

      // use response.data._id instead of data here as we are passing data from login page
      if (path === "password") {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify-reset-otp`,
          { otp, email: data },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response?.data?.data, "response");
        navigate(`/changePassword/${data}`);
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify-email`,
          { otp, email: data },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response?.data?.data, "response");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong");
      setShowPopup(true);
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {showPopup && (
          <Popup message={message} onClick={() => setShowPopup(false)} />
        )}
        <h1 className="text-4xl font-bold">Verify OTP</h1>
        <p className="text-sm text-gray-300">
          Enter the 6-digit code sent to your given email
        </p>

        <div className="flex gap-3">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined} // only first input handles paste
              className="w-12 h-12 text-center text-lg font-semibold text-zinc-900 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationComponent;
