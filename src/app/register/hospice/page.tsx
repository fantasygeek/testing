import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function RegisterHospicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Blue header */}
      <div className="bg-[#1e4b7b] text-white px-6 py-4">
        <h1 className="text-xl font-medium">Login</h1>
      </div>

      {/* Main content with logo and form */}
      <div className="flex">
        {/* Left side - Title and description */}
        <div className="flex-1 px-8 py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-4">
              Register as Hospice
            </h2>
            <p className="text-black text-base">
              Please create your own account as medical facilities.
            </p>
          </div>
        </div>
        {/* Right side - Logo */}
        <div className="flex justify-end pr-8 pt-6">
          <div className="flex flex-col items-center">
            <Image
              src="/images/cns-logo.png"
              alt="CNS Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Large gray form section */}
      <div className="bg-[#eaeaea] mx-0 px-8 py-8 min-h-[600px]">
        <div className="max-w-6xl mx-auto">
          {/* Personal Details Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">
              Personal Details
            </h3>

            {/* ID field - full width */}
            <div className="mb-6 flex items-center gap-2">
              <Label
                htmlFor="id"
                className="text-gray-600 font-normal text-sm min-w-[60px]"
              >
                ID
              </Label>
              <Input
                id="id"
                type="text"
                className="bg-white border-gray-300 rounded-lg h-10 w-full max-w-md"
              />
            </div>

            {/* Three columns layout */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* First column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-600 font-normal text-sm min-w-[80px]"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-gray-600 font-normal text-sm min-w-[90px]"
                  >
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="mobileNumber"
                    className="text-gray-600 font-normal text-sm min-w-[100px]"
                  >
                    Mobile Number
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="address"
                    className="text-gray-600 font-normal text-sm min-w-[60px]"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
              </div>

              {/* Second column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="middleName"
                    className="text-gray-600 font-normal text-sm min-w-[90px]"
                  >
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-600 font-normal text-sm min-w-[60px]">
                    Gender
                  </Label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                        </div>
                      </div>
                      <span className="text-gray-600 text-sm ml-2">Male</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                        </div>
                      </div>
                      <span className="text-gray-600 text-sm ml-2">Female</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="facility"
                    className="text-gray-600 font-normal text-sm min-w-[60px]"
                  >
                    Facility
                  </Label>
                  <Input
                    id="facility"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="phone"
                    className="text-gray-600 font-normal text-sm min-w-[60px]"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
              </div>

              {/* Third column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-600 font-normal text-sm min-w-[80px]"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms and conditions checkbox */}
          <div className="flex justify-center mb-6">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="terms" className="sr-only peer" />
                <div className="w-4 h-4 border-2 border-gray-400 rounded peer-checked:border-[#0077bb] peer-checked:bg-[#0077bb] flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-gray-600 text-sm ml-2">
                I hereby accept terms and conditions.
              </span>
            </label>
          </div>

          {/* Bottom section with buttons */}
          <div className="relative pt-4">
            {/* Buttons - centered */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                type="button"
                className="bg-[#0077bb] hover:bg-[#005599] text-white text-base font-medium rounded-lg h-12 px-8"
              >
                Register
              </Button>
              <Link href="../register">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-gray-400 hover:bg-gray-500 text-white text-base font-medium rounded-lg h-12 px-8"
                >
                  Cancel
                </Button>
              </Link>
            </div>
            {/* Need Help link - positioned below buttons */}
            <div className="flex justify-start">
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
  );
}
