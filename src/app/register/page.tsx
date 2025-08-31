'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  const [userType, setUserType] = useState('doctor');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState('');

  const router = useRouter();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  const validateForm = () => {
    const newErrors: {
      email?: string;
      confirmEmail?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Clear previous errors
    setGeneralError('');
    setErrors({});

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Confirm email validation
    if (!confirmEmail) {
      newErrors.confirmEmail = 'Please confirm your email';
    } else if (email !== confirmEmail) {
      newErrors.confirmEmail = 'Email addresses do not match';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,72}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Password does not meet complexity requirements';
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueClick = () => {
    if (!validateForm()) {
      setGeneralError('Please fix the errors above before continuing');
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userType', userType);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      }

      // Conditional navigation based on selected value
      if (userType === 'doctor') {
        router.push('/register/doctor');
      } else if (userType === 'hospice') {
        router.push('/register/hospice');
      } else if (userType === 'pharmacist') {
        router.push('/register/pharmacist');
      }
    } catch (error) {
      console.error('An error occurred.:', error);
      setGeneralError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blue header */}
      <div className="bg-[#1e4b7b] text-white px-6 py-4">
        <h1 className="text-xl font-medium">Login</h1>
      </div>

      {/* Logo section - positioned in upper right */}
      <div className="flex justify-end pr-8 pt-4">
        <div className="flex flex-col items-center">
          <Image
            src="/images/cns-logo.png"
            alt="CNS Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center font-medium py-8 px-10 mx-0">
        <div className="w-full max-w-4xl">
          {/* Registration form container */}
          <div className="bg-[#eaeaea] p-8 shadow-sm px-36">
            <h2 className="text-2xl font-bold text-black mb-2">
              Register for an Account
            </h2>
            <p className="text-black text-sm mb-6">
              Please create your own account and do not create an account on
              behalf of someone else.
            </p>

            {/* General Error Message */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {generalError}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Register Me As section */}
              <div>
                <label className="text-gray-600 font-normal text-sm mb-3 block">
                  Register Me As:
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="userType"
                        value="doctor"
                        className="sr-only peer"
                        defaultChecked
                        onChange={handleRadioChange}
                      />
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                      </div>
                    </div>
                    <span className="text-black text-sm ml-2">Doctor</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="userType"
                        value="hospice"
                        className="sr-only peer"
                        onChange={handleRadioChange}
                      />
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                      </div>
                    </div>
                    <span className="text-black text-sm ml-2">Hospice</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="userType"
                        value="pharmacist"
                        className="sr-only peer"
                        onChange={handleRadioChange}
                      />
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                      </div>
                    </div>
                    <span className="text-black text-sm ml-2">Pharmacist</span>
                  </label>
                </div>
              </div>

              {/* Email and Password fields in two columns */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      tabIndex={1}
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className={`bg-white border rounded-lg px-3 h-10 w-72 ${
                        errors.email
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        errors.email
                          ? 'focus:ring-red-400'
                          : 'focus:ring-blue-500'
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      tabIndex={3}
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className={`bg-white border rounded-lg px-3 h-10 w-72 ${
                        errors.password
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        errors.password
                          ? 'focus:ring-red-400'
                          : 'focus:ring-blue-500'
                      }`}
                      required
                    />
                    {errors.password && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="confirmEmail"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Confirm Email
                    </label>
                    <input
                      id="confirmEmail"
                      type="email"
                      tabIndex={2}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      value={confirmEmail}
                      className={`bg-white border rounded-lg px-3 h-10 w-72 ${
                        errors.confirmEmail
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        errors.confirmEmail
                          ? 'focus:ring-red-400'
                          : 'focus:ring-blue-500'
                      }`}
                      required
                    />
                    {errors.confirmEmail && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.confirmEmail}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="confirmPassword"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      tabIndex={4}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      className={`bg-white border rounded-lg px-3 h-10 w-72 ${
                        errors.confirmPassword
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        errors.confirmPassword
                          ? 'focus:ring-red-400'
                          : 'focus:ring-blue-500'
                      }`}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password requirements and Continue button section */}
              <div className="flex justify-between items-start pt-4">
                {/* Password requirements */}
                <div>
                  <h3 className="text-black font-bold text-sm mb-2">
                    Password Must:
                  </h3>
                  <ul className="text-black text-xs space-y-1">
                    <li>• Minimum of 8 characters</li>
                    <li>• Contain one upper case letter</li>
                    <li>• Contain one lower case letter</li>
                    <li>• Contain one special character (! @ # $ etc.)</li>
                    <li>• Maximum of 72 characters</li>
                  </ul>
                </div>

                {/* Continue button */}
                <div className="ml-8">
                  <button
                    type="submit"
                    tabIndex={5}
                    onClick={handleContinueClick}
                    className="bg-[#0077bb] hover:bg-[#005599] text-white text-base font-medium rounded-lg border-0 h-12 w-44 px-8 text-center transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>

              {/* Need help link */}
              <div className="text-left pt-2">
                <Link
                  href="/help"
                  className="text-[#0077bb] hover:text-[#005599] text-sm"
                >
                  Need Help ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
