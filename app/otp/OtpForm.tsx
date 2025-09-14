"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({
    otp: "",
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

  if (!isMounted) {
    return null;
  }

  const handleVerifyOtp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      otp: "",
    };

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
      hasErrors = true;
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be a 6-digit number";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      router.push(`/password?email=${encodeURIComponent(email)}`);
    }
  };

  const handleResendCode = () => {
    
    alert(`A new OTP has been sent to ${email}`);
  };
  const currentDateTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-white to-gray-50 ">
      <div className="flex flex-col md:flex-row flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8">
          <div className="mb-4 xs:mb-6 sm:mb-8">
            <Link href="/">
              <img
                src="/images/logo.png"
                alt="Book Haven Logo"
                width={80}
                height={80}
                className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
                // priority
              />
            </Link>
          </div>
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
            Verify Your Email
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-gray-900 mb-4 xs:mb-6 sm:mb-8 text-center">
            Enter the 6-digit code we sent to{" "}
            <span className="font-medium">{email}</span>
          </p>
          <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-lg p-3 xs:p-4 sm:p-6 shadow-none xs:shadow-sm">
            <div className="mb-3 xs:mb-4">
              <label
                htmlFor="otp"
                className="block text-xs xs:text-sm sm:text-base text-gray-700 mb-1"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full border border-gray-300 rounded-md px-3 xs:px-4 py-2 text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 text-gray-900 text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                aria-invalid={!!errors.otp}
                aria-describedby={errors.otp ? "otp-error" : undefined}
              />
              {errors.otp && (
                <p id="otp-error" className="mt-1 text-xs xs:text-sm sm:text-base text-red-500" aria-live="polite">
                  {errors.otp}
                </p>
              )}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-teal-600 text-white rounded-full py-2 min-h-10 text-xs xs:text-sm sm:text-base font-semibold hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
            >
              Verify OTP
            </button>
            <div className="mt-3 xs:mt-4 text-center">
              <p className="text-xs xs:text-sm sm:text-base text-gray-700">
                Didn’t receive a code?{" "}
                <button
                  onClick={handleResendCode}
                  className="text-teal-600 hover:underline focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  Resend code
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full border-t border-gray-200 py-4 text-center text-sm text-gray-700">
        <div className="flex flex-col items-center space-y-1">
          <span className="font-semibold uppercase text-md underline">
            Legal restrictions and terms of use applicable to this site
          </span>
          <span className="text-gray-400">
            Use of this site signifies your agreement to the terms of use.
          </span>
          <span>© 1998 - 2025 Book Haven. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}