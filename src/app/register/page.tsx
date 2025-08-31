'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

export default function RegisterPage() {
  const [userType, setUserType] = useState('doctor'); // default value
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  const handleContinueClick = () => {
    // Basic email match check
    if (email !== confirmEmail) {
      alert('Email addresses do not match');
      return;
    }

    // Basic password match check
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,72}$/;
    if (!passwordRegex.test(password)) {
      alert('Password does not meet complexity requirements');
      return;
    }

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

            <div className="space-y-6">
              {/* Register Me As section */}
              <div>
                <Label className="text-gray-600 font-normal text-sm mb-3 block">
                  Register Me As:
                </Label>
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
                    <Label
                      htmlFor="email"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="bg-white border-gray-300 rounded-lg px-0 h-10 w-72"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="password"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className="bg-white border-gray-300 rounded-lg h-10 w-72"
                      required
                    />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="confirmEmail"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Confirm Email
                    </Label>
                    <Input
                      id="confirmEmail"
                      type="email"
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      value={confirmEmail}
                      className="bg-white border-gray-300 h-10 rounded-lg w-72"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-gray-600 font-normal text-sm"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      className="bg-white border-gray-300 rounded-lg h-10 w-72"
                      required
                    />
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
                  <Button
                    type="submit"
                    onClick={handleContinueClick}
                    className="bg-[#0077bb] hover:bg-[#005599] text-white text-base font-medium rounded-lg border-0 h-12 w-44 px-8 text-center"
                  >
                    Continue
                  </Button>
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
