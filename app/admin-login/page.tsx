"use client";
import { API_BASE_URL } from "@/utils/api";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { roleAtom } from "../store/auth";
import { useRouter } from "next/navigation";
import { useRedirectIfAdmin } from "../hooks/useCheckIsLoggedInAdmin";

const AdminLogin = () => {
  const { checking } = useRedirectIfAdmin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [, setToken] = useAtom(tokenAtom);
  const [, setRole] = useAtom(roleAtom);
  const router = useRouter();
  // const setAuth = useSetRecoilState(authAtom);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_BASE_URL}/auth/admin/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (response) {
        const {  role } = response.data;

        // setToken(token);
        setRole(role);

        // optionally persist to localStorage
      //   localStorage.setItem("token", token);
      //   localStorage.setItem("role", role);
      }
      router.push("/admin/dashboard");

      //   setAuth({
      //   token: response.data.token,
      //   role: response.data.role,
      // });
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (checking)
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-white text-black">
        Loading...
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          {/* Logo Circle */}

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Log In to Your Account
          </h1>
          <p className="text-gray-600">
            Welcome back to{" "}
            <span className="text-teal-500 font-medium">Harsh Book Store</span>
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 outline-none"
                placeholder="Enter your Gmail address"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-teal-500 text-sm font-medium">
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3 text-base font-medium rounded-lg text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
