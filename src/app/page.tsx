import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function LoginPage() {
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
          <p className="text-[#0077bb] mt-1 text-3xl font-normal">Click</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center font-medium py-8 px-10 mx-0">
        <div className="w-full max-w-lg">
          {/* Login form container */}
          <div className="bg-[#eaeaea] p-8 shadow-sm py-5 px-24">
            <h2 className="text-2xl font-bold text-black mb-6">Login</h2>

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
                  id="email"
                  type="email"
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
                  href="/create-account"
                  className="text-[#0077bb] hover:text-[#005599] text-base"
                >
                  Create Account
                </Link>
              </div>

              {/* Need help link */}
              <div className="text-left pt-4">
                <Link
                  href="/help"
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
