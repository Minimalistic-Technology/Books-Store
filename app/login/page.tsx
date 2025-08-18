'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../../utils/api';

interface JwtPayload {
  id: string;
  role: 'User' | 'Admin';
}

const BookStoreLoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'User' | 'Admin'>('User');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    role: '',
    apiError: '',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      email: '',
      password: '',
      role: '',
      apiError: '',
    };

    if (!email.trim()) {
      newErrors.email = 'This field is mandatory';
      hasErrors = true;
    } else if (!email.includes('@') || !email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
      hasErrors = true;
    }

    if (!password.trim()) {
      newErrors.password = 'This field is mandatory';
      hasErrors = true;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      hasErrors = true;
    }

    if (!role) {
      newErrors.role = 'Please select a role';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        const loginData = {
          email: email.trim().toLowerCase(),
          password: password.trim(),
          role,
        };

        console.log('Sending login request with:', loginData); 

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        const data = await response.json();
        console.log('Login response:', data); 

        if (!response.ok) {
          throw new Error(data.message || 'Login failed. Please try again.');
        }
        const decodedToken: JwtPayload = jwtDecode(data.token);
        localStorage.setItem('token', data.token);

        alert('Login successful!');
        if (decodedToken.role === 'Admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors((prev) => ({
          ...prev,
          apiError: (error as Error).message || 'An error occurred during login. Please try again.',
        }));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-serif text-gray-900">
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
        <h1 className="text-3xl font-bold mb-2">Log In to Your Account</h1>
        <p className="text-sm text-center mb-6">
          Welcome back to{' '}
          <Link href="/" className="text-teal-600 hover:underline font-medium">
            Harsh Book Store
          </Link>
        </p>
        <form
          onSubmit={handleLogin}
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

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-teal-600"
              >
                {showPassword ? 'Hide' : 'Show'}
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
              onChange={(e) => setRole(e.target.value as 'User' | 'Admin')}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role}</p>
            )}
          </div>

          {errors.apiError && (
            <p className="text-center text-sm text-red-600 mb-4">
              {errors.apiError}
            </p>
          )}

          <div className="mb-4 text-center">
            <Link href="/forgot-password" className="text-sm text-teal-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md py-2 transition-all"
          >
            Log In
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Don’t have an account?{' '}
              <Link href="/signup" className="text-teal-600 hover:underline">
                Sign up.
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

export default BookStoreLoginPage;