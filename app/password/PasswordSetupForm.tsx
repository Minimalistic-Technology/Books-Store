// app/password/PasswordSetupForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "../../utils/api";

export default function PasswordSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"User" | "Admin">("User");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    password: "",
    role: "",
    apiError: "",
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const emailFromParams = searchParams.get("email") || "";
    setEmail(emailFromParams);

    if (!emailFromParams) {
      router.push("/signup");
    }
  }, [isMounted, searchParams, router]);

  if (!isMounted) return null;

  interface PasswordStrength {
    label: string;
    width: string;
    color: string;
  }

  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (pwd.length === 0) return { label: "", width: "0%", color: "" };

    let types = 0;
    if (/[a-z]/.test(pwd)) types++;
    if (/[A-Z]/.test(pwd)) types++;
    if (/[0-9]/.test(pwd)) types++;
    if (/[^a-zA-Z0-9]/.test(pwd)) types++;

    if (types === 1) {
      if (pwd.length >= 14) return { label: "Good", width: "60%", color: "bg-yellow-500" };
      else if (pwd.length >= 10) return { label: "Poor", width: "40%", color: "bg-orange-500" };
      else if (pwd.length >= 8) return { label: "Very Poor", width: "20%", color: "bg-red-500" };
    }

    if (types === 2 && pwd.length >= 8) return { label: "Good", width: "60%", color: "bg-yellow-500" };
    if (types === 3 && pwd.length >= 8) return { label: "Strong", width: "80%", color: "bg-blue-500" };
    if (types === 4 && pwd.length >= 8) return { label: "Very Strong", width: "100%", color: "bg-green-500" };

    return { label: "Very Poor", width: "20%", color: "bg-red-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      fullName: "",
      password: "",
      role: "",
      apiError: "",
    };

    if (!fullName.trim()) {
      newErrors.fullName = "This field is mandatory";
      hasErrors = true;
    }
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      hasErrors = true;
    }
    if (!role) {
      newErrors.role = "Please select a role";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: fullName.trim().toLowerCase(),
            email,
            password,
            role,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Signup failed. Please try again.");
        }

        alert("Account created successfully! Please log in.");
        router.push("/login");
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          apiError: (error as Error).message || "An error occurred during signup. Please try again.",
        }));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white  text-gray-900">
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/logo.png"
            alt="Harsh Book Store Logo"
            width={64}
            height={64}
            className="mb-2"
          />
        </div>

        <h1 className="text-3xl font-bold mb-2">Set Up Your Account</h1>
        <p className="text-sm text-center mb-6">
          Finish setting up your account at{" "}
          <Link href="/" className="text-teal-600 hover:underline font-medium">
            Harsh Book Store
          </Link>
        </p>

        <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-6 shadow-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="text"
              id="email"
              value={email}
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm text-gray-600"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-teal-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "User" | "Admin")}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="User">User</option>
              {/* <option value="Admin">Admin</option> */}
            </select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role}</p>
            )}
          </div>

          {password && (
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Password Strength: {passwordStrength.label}
              </label>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${passwordStrength.color}`}
                  style={{ width: passwordStrength.width }}
                />
              </div>
            </div>
          )}

          {errors.apiError && (
            <p className="text-center text-sm text-red-600 mb-4">
              {errors.apiError}
            </p>
          )}

          <p className="text-xs text-center text-gray-600 mb-4">
            By signing up, I accept the{" "}
            <Link href="#" className="text-teal-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-teal-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <button
            onClick={handleContinue}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md py-2 transition-all"
          >
            Continue
          </button>
        </div>
      </div>

      <footer className="text-center py-4 border-t border-gray-200 text-sm text-gray-600">
        <p className="font-medium">
          Legal restrictions and terms of use applicable to this site
        </p>
        <p className="text-gray-400">Use of this site signifies agreement to terms.</p>
        <p>© 1998 - 2025 Harsh Book Store. All rights reserved.</p>
      </footer>
    </div>
  );
}