import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeaderWithLogo from '@/components/ui/blue-header';

export default function RegisterDoctorPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderWithLogo
        title="CNS Click"
        MainTitle="Register me as Nurse"
        SubTitle="This account is invited and register by Hospice / Medical facility"
      />

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

            {/* Name fields - three columns */}
            <div className="grid grid-cols-3 gap-6 mb-6">
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

            {/* Date of Birth and Gender row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
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
            </div>

            {/* Mobile Number and Facility row */}
            <div className="grid grid-cols-2 gap-6 mb-8">
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
                  htmlFor="facility"
                  className="text-gray-600 font-normal text-sm min-w-[60px]"
                >
                  Hospice
                </Label>
                <Input
                  id="facility"
                  type="text"
                  className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                />
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">
              Professional Details
            </h3>

            {/* Three columns with specific field arrangement */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* First column: License No., Date Issue, Valid Until */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="licenseNo"
                    className="text-gray-600 font-normal text-sm min-w-[80px]"
                  >
                    License No.
                  </Label>
                  <Input
                    id="licenseNo"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="dateIssue"
                    className="text-gray-600 font-normal text-sm min-w-[80px]"
                  >
                    Date Issue
                  </Label>
                  <Input
                    id="dateIssue"
                    type="date"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="validUntil"
                    className="text-gray-600 font-normal text-sm min-w-[80px]"
                  >
                    Valid Until
                  </Label>
                  <Input
                    id="validUntil"
                    type="date"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
              </div>

              {/* Second column: Issued By, Place of Issue, Practice By */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="issuedBy"
                    className="text-gray-600 font-normal text-sm min-w-[90px]"
                  >
                    Issued By
                  </Label>
                  <Input
                    id="issuedBy"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="placeOfIssue"
                    className="text-gray-600 font-normal text-sm min-w-[90px]"
                  >
                    Place of Issue
                  </Label>
                  <Input
                    id="placeOfIssue"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="practiceBy"
                    className="text-gray-600 font-normal text-sm min-w-[80px]"
                  >
                    Practice By
                  </Label>
                  <Input
                    id="practiceBy"
                    type="text"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
              </div>

              {/* Third column: Upload ID's */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="uploadIds"
                    className="text-gray-600 font-normal text-sm min-w-[80px]"
                  >
                    Upload IDs
                  </Label>
                  <Input
                    id="uploadIds"
                    type="file"
                    className="bg-white border-gray-300 rounded-lg h-10 flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section with buttons */}
          <div className="relative pt-4">
            {/* Need Help link - positioned absolutely to the left */}
            <div className="absolute left-0 top-4">
              <Link
                href="/help"
                className="text-[#0077bb] hover:text-[#005599] text-sm"
              >
                Need Help ?
              </Link>
            </div>

            {/* Centered content with message and buttons */}
            <div className="flex flex-col items-center gap-4">
              {/* Information message */}
              <p className="text-gray-600 text-sm text-center">
                Please check the email after registration as this will be
                approve by Hospice.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  className="bg-[#0077bb] hover:bg-[#005599] text-white text-base font-medium rounded-lg h-12 px-8"
                >
                  Register
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-gray-400 hover:bg-gray-500 text-white text-base font-medium rounded-lg h-12 px-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
