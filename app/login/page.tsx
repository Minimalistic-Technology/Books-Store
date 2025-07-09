'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../components/header/page';
import Footer from '../components/footer/page';

const BookStoreLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface LoginResponse {
    accessToken?: string;
    message?: string;
    error?: string;
    [key: string]: any;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const loginResponse = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const responseText = await loginResponse.text();
      let loginData: LoginResponse;

      try {
        loginData = JSON.parse(responseText);
      } catch {
        setError('Server returned an invalid response. Please try again.');
        return;
      }

      if (!loginResponse.ok) {
        setError(loginData.error || 'Login failed. Please check your credentials.');
        return;
      }

      if (!loginData.accessToken) {
        setError('No access token received from server.');
        return;
      }

      localStorage.setItem('accessToken', loginData.accessToken);
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    } catch (error) {
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-serif text-gray-900">

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-4 text-center">
          <div className="flex flex-col items-center mb-6">
                    <Image
                      src="/images/logo.png"
                      alt="Harsh Book Store Logo"
                      width={64}
                      height={64}
                      className="mb-2"
                    />
                    
                  </div>
          <h1 className="text-3xl font-bold mt-2">Welcome Back</h1>
          <p className="text-sm text-gray-600 mt-1">
            Log in to{' '}
            <Link href="/" className="text-teal-600 font-medium hover:underline">
              Harsh Book Store
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-4"
        >
          {error && (
            <p className="text-red-500 text-center text-sm" aria-live="polite">
              {error}
            </p>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute top-8 right-3 text-sm text-teal-600"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md py-2 transition-all disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>

          {/* Links */}
          <div className="text-center text-sm mt-2">
            <Link href="/forgot-credentials" className="text-teal-600 hover:underline">
              Forgot username or password?
            </Link>
          </div>
          <div className="text-center text-sm mt-2">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-teal-600 hover:underline">
              Create one now.
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default BookStoreLoginPage;
