'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/ui/header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call our secure API route instead of external API directly
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Login failed');
      }

      if (result.success) {
        console.log('✅ Login successful, cookies should be set');

        // Give browser a moment to set cookies
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Verify cookies were set
        const cookiesSet = document.cookie.includes('username');

        if (cookiesSet) {
          // Redirect based on roles
          const { roles } = result.user;

          if (roles.includes('DOCTOR')) {
            router.push('/doctor');
          } else if (roles.includes('ADMIN')) {
            router.push('/admin');
          } else if (roles.includes('HOSPICE')) {
            router.push('/hospice');
          } else if (roles.includes('PHARMACIST')) {
            router.push('/pharmacist');
          } else {
            router.push('/dashboard');
          }

          router.refresh();
        } else {
          console.error('❌ Cookies not found after login');
          setError('Session setup failed. Please try again.');
        }
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="CNS Click" leftTitle="" />

      <div className="flex items-center justify-center font-medium py-8 px-10 mx-0">
        <div className="w-full max-w-lg">
          <div className="bg-[#eaeaea] p-8 shadow-sm py-5 px-24">
            <h2 className="text-2xl font-bold text-black mb-6">Login</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
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

              <div className="text-right pt-0">
                <Link
                  href="/forgot-password"
                  className="text-[#0077bb] hover:text-[#005599] text-sm text-left"
                >
                  Forgot Password
                </Link>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="bg-[#0077bb] hover:bg-[#005599] text-white h-12 text-base font-medium rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>

              <div className="text-center pt-0 leading-7">
                <Link
                  href="/register"
                  className="text-[#0077bb] hover:text-[#005599] text-base"
                >
                  Create Account
                </Link>
              </div>

              <div className="text-left pt-4">
                <Link
                  href="/admin/doctor"
                  className="text-[#0077bb] hover:text-[#005599] text-sm leading-7 text-left"
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
