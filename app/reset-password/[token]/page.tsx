"use client";
import { API_BASE_URL } from "@/utils/api";
import axios from "axios";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  
  const token = params.token || "";
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    apiError: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
      //   role: '',
      apiError: "",
    };

    // if (!email.trim()) {
    //   newErrors.email = 'This field is mandatory';
    //   hasErrors = true;
    // } else if (!email.includes('@') || !email.toLowerCase().endsWith('@gmail.com')) {
    //   newErrors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
    //   hasErrors = true;
    // }

    if (!newPassword.trim()) {
      newErrors.newPassword = "This field is mandatory";
      hasErrors = true;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
      hasErrors = true;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "This field is mandatory";
      hasErrors = true;
    } else if (confirmPassword.length < 8) {
      newErrors.confirmPassword = "Password must be at least 8 characters long";
      hasErrors = true;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Password must be same as new password";
      hasErrors = true;
    }

    // if (!role) {
    //   newErrors.role = 'Please select a role';
    //   hasErrors = true;
    // }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
         await axios.post(`${API_BASE_URL}/auth/reset-password`, {
          token,
          password: confirmPassword,
        });
        
        setSuccessMessage("Password reset successful");
       
      } catch (error) {
        
        setErrors((prev) => ({
          ...prev,
          apiError:
            (error as Error).message ||
            "An error occurred during resetting password. Please try again.",
        }));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white  text-gray-900">
      {successMessage ? (
        <div className="text-center py-10">
          <h1>{successMessage}</h1>
          <h1 className="text-teal-500">
            Switch to <Link href={"/login"}>Login</Link>
          </h1>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-10">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Harsh Book Store Logo"
              width={64}
              height={64}
              className="mb-2"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
          <p className="text-sm text-center mb-6">
            Welcome back to{" "}
            <Link
              href="/"
              className="text-teal-600 hover:underline font-medium"
            >
              Harsh Book Store
            </Link>
          </p>
          <form
            onSubmit={handleResetPassword}
            className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-6 shadow-md"
          >
            <div className="mb-4">
              <label
                htmlFor="new_password"
                className="block text-sm font-medium cursor-pointer"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your New Password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-teal-600 cursor-pointer"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium cursor-pointer"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-teal-600 cursor-pointer"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.apiError && (
              <p className="text-center text-sm text-red-600 mb-4">
                {errors.apiError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md py-2 transition-all cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      <footer className="text-center py-4 border-t border-gray-200 text-sm text-gray-600">
        <p className="font-medium">
          Legal restrictions and terms of use applicable to this site
        </p>
        <p className="text-gray-400">
          Use of this site signifies agreement to terms.
        </p>
        <p>© 1998 - 2025 Harsh Book Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;
