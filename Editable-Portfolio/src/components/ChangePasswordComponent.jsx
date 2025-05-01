import React, { useState } from "react";
import Input from "./Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePasswordComponent = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let valid = true;
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        valid = false;
      } else {
        setPasswordError("");
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError(
          "Password and Confirm Password does not match."
        );
        valid = false;
      } else {
        setConfirmPasswordError("");
      }
      if (!valid) {
        return;
      }
      // check code in future when backend will perfectly work

      // const response = await axios.post(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/change-password`,
      //   { password, confirmPassword },
      //   {
      //     withCredentials: true,
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen w-full bg-zinc-900">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-zinc-50 mb-7">
          Change Password
        </h1>
        <form action="" className="flex flex-col" onSubmit={handleFormSubmit}>
          <div className="mb-6">
            <Input
              type={"password"}
              className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
              placeholder="Enter your password"
              label="New Password"
              showPasswordToggle={true}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>
          <div className="mb-6">
            <Input
              type={"password"}
              className={`w-full px-4 py-2 bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-zinc-500`}
              placeholder="Enter your password"
              label="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              value={confirmPassword}
            />
            {setConfirmPasswordError && (
              <p className="text-red-500">{confirmPasswordError}</p>
            )}
          </div>
          <button
            type="submit"
            onClick={null}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm ml-1 px-4 py-2 rounded transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordComponent;
