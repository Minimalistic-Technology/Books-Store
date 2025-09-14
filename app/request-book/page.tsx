
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faBookmark, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from '../../utils/api';

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
  mobile: string;
  bookTitle: string;
  publisher: string;
  author: string;
  className: string;
  message: string;
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
    mobile: "",
    bookTitle: "",
    publisher: "",
    author: "",
    className: "",
    message: "",
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;

    const newErrors: Partial<Errors> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      hasErrors = true;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name should contain only letters and spaces";
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Invalid email address";
      hasErrors = true;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      hasErrors = true;
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Mobile number must be a valid 10-digit number starting with 6, 7, 8, or 9";
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

    if (formData.publisher && !formData.publisher.trim()) {
      newErrors.publisher = "Publisher cannot be empty if provided";
      hasErrors = true;
    }

    if (formData.className && !formData.className.trim()) {
      newErrors.className = "Class cannot be empty if provided";
      hasErrors = true;
    }

    if (formData.message && !formData.message.trim()) {
      newErrors.message = "Message cannot be empty if provided";
      hasErrors = true;
    }

    setErrors(newErrors as Errors);

    if (!hasErrors) {
      try {
        
        const response = await fetch(`${API_BASE_URL}/book-requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            bookTitle: formData.bookTitle.trim(),
            publisher: formData.publisher.trim(),
            author: formData.author.trim(),
            classLevel: formData.className.trim().toLowerCase(),
            message: formData.message.trim(),
          }),
          credentials:"include"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // const result = await response.json();
        
        setIsSubmitted(true);
        setApiError(null);

        setTimeout(() => {
          router.push("/profile?tab=requests");
        }, 3000);
      } catch  {
        
        setApiError("Failed to submit request. Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white  relative">
      <div className="absolute top-10 left-10 text-orange-600 opacity-20 animate-pulse">
        <FontAwesomeIcon icon={faBookOpen} size="3x" />
      </div>
      <div className="absolute top-20 right-10 text-orange-500 opacity-20 rotate-12 animate-bounce">
        <FontAwesomeIcon icon={faBookmark} size="3x" />
      </div>
      <div className="absolute bottom-10 left-10 text-orange-600 opacity-20 -rotate-12 animate-pulse">
        <FontAwesomeIcon icon={faBookOpen} size="3x" />
      </div>

      <div className="relative flex flex-1 items-center justify-center p-6 z-10">
        <div className="w-full max-w-lg  border border-gray-200 rounded-xl p-6 shadow-xl">
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
              Let us know which book you&apos;d like us to source for you.
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
                required
              />
              <InputField
                label="Your Email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
                required
              />
              <InputField
                label="Mobile"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                error={errors.mobile}
                placeholder="Enter your mobile number"
                required
              />
              <InputField
                label="Book Title"
                id="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                error={errors.bookTitle}
                placeholder="Enter the book title"
                required
              />
              <InputField
                label="Publisher"
                id="publisher"
                value={formData.publisher}
                onChange={handleChange}
                error={errors.publisher}
                placeholder="Publisher name"
              />
              <InputField
                label="Author"
                id="author"
                value={formData.author}
                onChange={handleChange}
                error={errors.author}
                placeholder="Author name"
                required
              />
              <InputField
                label="Class"
                id="className"
                value={formData.className}
                onChange={handleChange}
                error={errors.className}
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
                {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
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

const InputField = ({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}: {
  label: string;
  id: keyof FormData;
  value: string;
  onChange: (field: keyof FormData, value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
      required={required}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default RequestBookPage;