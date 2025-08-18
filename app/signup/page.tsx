'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BookStoreSignupPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    terms: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      email: '',
      terms: '',
    };

    if (!email.trim()) {
      newErrors.email = 'This field is mandatory';
      hasErrors = true;
    } else if (!email.includes('@') || !email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
      hasErrors = true;
    }

    if (!acceptTerms) {
      newErrors.terms = 'Please accept the terms of service and privacy policy';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-serif text-gray-900">
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

        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-sm text-center mb-6">
          Join{' '}
          <Link href="/login" className="text-teal-600 hover:underline font-medium">
            Harsh Book Store
          </Link>{' '}
          to explore millions of books.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-6 shadow-md"
        >

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Gmail address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4 flex items-start">
            <input
              type="checkbox"
              id="accept-terms"
              className="h-5 w-5 text-teal-600 border-gray-300 rounded mt-0.5"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="accept-terms" className="ml-2 text-sm">
              By signing up, I accept the{' '}
              <Link href="#" className="text-teal-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-teal-600 hover:underline">
                Privacy Policy
              </Link>.
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-500 mb-4">{errors.terms}</p>
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md py-2 transition-all"
          >
            Next
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 hover:underline">
                Log in.
              </Link>
            </p>
          </div>
        </form>
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
};

export default BookStoreSignupPage;