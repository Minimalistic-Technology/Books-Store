

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

const BookStoreSignupPage: React.FC = () => {
  const router = useRouter();

  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    phone: "", 
    email: "",
    password: "",
    otp: "",
    terms: "",
  });
  const [, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  
  const handleSendOtp = async () => {
    try {
      if (!email.trim()) {
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
        return;
      }
      await axios.post(`api/bookstore/send-otp`, {
        name,
        email,
      });
      

      setOtpSent(true);
      setCooldown(30);
    } catch  {
      
      setApiError("Failed to send OTP. Try again.");
    }
  };

  // ✅ Verify OTP & signup
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      password: "",
      terms: "",
      otp: "",
    };

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
      hasErrors = true;
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be a 6-digit number";
      hasErrors = true;
    }

    if (!hasErrors) {
      try {
        // Step 1: Verify OTP
        const verifyRes = await axios.post(`api/bookstore/verify-otp`, {
          email,
          otp,
        });
        if(!(verifyRes.status===200)){
          newErrors.otp="Invalid OTP"
          hasErrors = true
          return
        }

        // Step 2: Call Signup API
        await axios.post(`${API_BASE_URL}/auth/signup`, {
          username: name,
          phone, // NEW
          email,
          password,
        });

        
        router.push("/login");
      } catch  {
        
        setApiError("Signup failed. Please try again.");
      }
    }

    setErrors(newErrors);
  };

  // 🚀 Signup initial step
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      password: "",
      terms: "",
      otp: "",
    };

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasErrors = true;
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      hasErrors = true;
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      hasErrors = true;
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      hasErrors = true;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "This field is mandatory";
      hasErrors = true;
    } else if (
      !email.includes("@") ||
      !email.toLowerCase().endsWith("@gmail.com")
    ) {
      newErrors.email =
        "Please enter a valid Gmail address (e.g., example@gmail.com)";
      hasErrors = true;
    }

    // Password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 chars, include uppercase, lowercase, number & special character";
      hasErrors = true;
    }

    // Terms validation
    if (!acceptTerms) {
      newErrors.terms = "Please accept the terms of service and privacy policy";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      handleSendOtp();
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-gray-900">
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

        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-sm text-center mb-6">
          Join{" "}
          <Link
            href="/login"
            className="text-teal-600 hover:underline font-medium"
          >
            Harsh Book Store
          </Link>{" "}
          to explore millions of books.
        </p>

        <form
          onSubmit={otpSent ? handleVerifyOtp : handleSubmit}
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-6 shadow-md relative"
        >
          {/* Name */}
          {!otpSent && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Phone */}
          {!otpSent && (
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled={otpSent}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Gmail address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          {!otpSent && (
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm text-teal-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {/* Terms */}
          {!otpSent && (
            <div className="mb-4 flex items-start">
              <input
                type="checkbox"
                id="accept-terms"
                className="h-5 w-5 text-teal-600 border-gray-300 rounded mt-0.5"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="accept-terms" className="ml-2 text-sm">
                By signing up, I accept the{" "}
                <Link href="#" className="text-teal-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-teal-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
          )}
          {errors.terms && (
            <p className="text-sm text-red-500 mb-4">{errors.terms}</p>
          )}

          {/* OTP Field */}
          {otpSent && (
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
              />
              {errors.otp && (
                <p className="text-sm text-red-500 mt-1">{errors.otp}</p>
              )}

              <button
                type="button"
                disabled={cooldown > 0}
                onClick={handleSendOtp}
                className={`mt-2 text-sm font-medium ${
                  cooldown > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-teal-600 hover:underline"
                }`}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md py-2 transition-all"
          >
            {otpSent ? "Verify OTP" : "Next"}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-teal-600 hover:underline">
                Log in.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookStoreSignupPage;
