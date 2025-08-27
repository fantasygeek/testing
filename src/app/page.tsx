'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/ui/header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const baseUrl = 'https://cnsclick-api.azurewebsites.net';
      if (!baseUrl) {
        throw new Error('API base URL is not defined');
      }
      const res = await fetch(`${baseUrl}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const result = await res.json();

      if (result.success && result.data) {
        const { jwtToken, roles } = result.data;
        localStorage.setItem('jwtToken', jwtToken);

        if (roles.includes('DOCTOR')) {
          router.push('/doctor');
        } else if (roles.includes('ADMIN')) {
          router.push('/admin');
        }
      } else {
        alert(result.messages?.[0] || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blue header */}
      <Header title="CNS Click" leftTitle="" />
      {/* Main content */}
      <div className="flex items-center justify-center font-medium py-8 px-10 mx-0">
        <div className="w-full max-w-lg">
          {/* Login form container */}
          <div className="bg-[#eaeaea] p-8 shadow-sm py-5 px-24">
            <h2 className="text-2xl font-bold text-black mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-4">
                {/* Email field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-gray-500 font-normal text-sm"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="username"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={username}
                    className="bg-white border-gray-300 h-10 rounded-lg w-80"
                    required
                  />
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="password"
                    className="text-gray-500 font-normal text-sm"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="bg-white border-gray-300 rounded-lg h-10 w-80 text-left"
                    required
                  />
                </div>

                {/* Forgot password link */}
                <div className="text-right pt-0">
                  <Link
                    href="/forgot-password"
                    className="text-[#0077bb] hover:text-[#005599] text-sm text-left"
                  >
                    Forgot Password
                  </Link>
                </div>

                {/* Login button */}
                <div className="pt-3">
                  <Button
                    type="submit"
                    className="bg-[#0077bb] hover:bg-[#005599] text-white h-12 text-base font-medium rounded-lg w-full"
                  >
                    Log In
                  </Button>
                </div>

                {/* Create account link */}
                <div className="text-center pt-0 leading-7">
                  <Link
                    href="/register"
                    className="text-[#0077bb] hover:text-[#005599] text-base"
                  >
                    Create Account
                  </Link>
                </div>

                {/* Need help link */}
                <div className="text-left pt-4">
                  <Link
                    href="/admin/doctor"
                    className="text-[#0077bb] hover:text-[#005599] text-sm leading-7 text-left"
                  >
                    Need Help ?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
