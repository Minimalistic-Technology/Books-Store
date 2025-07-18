
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faBookmark, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  bookTitle: string;
  publisher: string;
  author: string;
  className: string;
  message: string;
}

interface Errors {
  name: string;
  email: string;
  bookTitle: string;
  author: string;
}

const RequestBookPage: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    bookTitle: "",
    publisher: "",
    author: "",
    className: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    bookTitle: "",
    author: "",
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;

    const newErrors: Partial<Errors> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }

    if (!formData.bookTitle.trim()) {
      newErrors.bookTitle = "Book title is required";
      hasErrors = true;
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      hasErrors = true;
    }

    setErrors(newErrors as Errors);

    if (!hasErrors) {
      try {
        const response = await fetch('http://localhost:5000/api/bookstore/book-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            bookTitle: formData.bookTitle,
            publisher: formData.publisher,
            author: formData.author,
            classLevel: formData.className, // Map className to classLevel
            message: formData.message,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Request submitted:", result);
        setIsSubmitted(true);
        setApiError(null);

        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (err) {
        console.error("API error:", err);
        setApiError("Failed to submit request. Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-serif relative">
      {/* Orange Icons */}
      <div className="absolute top-10 left-10 text-orange-600 opacity-20 animate-pulse">
        <FontAwesomeIcon icon={faBookOpen} size="3x" />
      </div>
      <div className="absolute top-20 right-10 text-orange-500 opacity-20 rotate-12 animate-bounce">
        <FontAwesomeIcon icon={faBookmark} size="3x" />
      </div>
      <div className="absolute bottom-10 left-10 text-orange-600 opacity-20 -rotate-12 animate-pulse">
        <FontAwesomeIcon icon={faBookOpen} size="3x" />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-1 items-center justify-center p-6 z-10">
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl p-6 shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Harsh Book Store Logo"
                width={80}
                height={80}
                className="w-20 rounded-full hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2 text-center">
              Request a Book
            </h1>
            <p className="text-base md:text-lg text-gray-600 text-center">
              Let us know which book you'd like us to source for you.
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6">
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="3x"
                className="text-green-500 mb-4"
              />
              <p className="text-xl text-gray-900 font-semibold">
                Your request has been submitted!
              </p>
              <p className="text-base text-gray-600 mt-2">
                Redirecting to homepage...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {apiError && <p className="text-sm text-red-500 mb-4">{apiError}</p>}
              <InputField
                label="Your Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your name"
              />
              <InputField
                label="Your Email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
              />
              <InputField
                label="Mobile"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
              />
              <InputField
                label="Book Title"
                id="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                error={errors.bookTitle}
                placeholder="Enter the book title"
              />
              <InputField
                label="Publisher"
                id="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Publisher name"
              />
              <InputField
                label="Author"
                id="author"
                value={formData.author}
                onChange={handleChange}
                error={errors.author}
                placeholder="Author name"
              />
              <InputField
                label="Class"
                id="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g. 10th, 12th"
              />
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Notes
                </label>
                <textarea
                  id="message"
                  placeholder="Any specific edition, format, or notes..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 text-white rounded-full py-2 font-semibold hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 transition transform hover:scale-105"
              >
                Submit Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable InputField component
const InputField = ({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  id: keyof FormData; // Fixed to match handleChange parameter
  value: string;
  onChange: (field: keyof FormData, value: string) => void;
  error?: string;
  placeholder?: string;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default RequestBookPage;
