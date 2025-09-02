// components/HeaderWithLogo.tsx
import Image from 'next/image';

interface HeaderWithLogoProps {
  title: string;
  logoSrc?: string;
  MainTitle?: string;
  SubTitle?: string;
}

const HeaderWithLogo: React.FC<HeaderWithLogoProps> = ({
  title,
  logoSrc = '/images/cns-logo.png',
  MainTitle = '',
  SubTitle = '',
}) => {
  return (
    <div>
      {/* Blue header */}
      <div className="bg-[#1e4b7b] text-white px-6 py-4">
        <h1 className="text-xl font-medium">{title}</h1>
      </div>

      {/* Logo section - positioned in upper right */}
      <div className="flex justify-end pr-8 pt-4">
        {/* Left side - Title and description */}
        <div className="flex-1 px-8 py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-4">{MainTitle}</h2>
            <p className="text-black text-base">{SubTitle}</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={logoSrc}
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderWithLogo;
