import React, { useState } from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const navigationItems = [
    { label: 'Store', href: '#store' },
    { label: 'The Tea Encyclopedia', href: '#encyclopedia' },
    { label: 'About', href: '#about' },
    { label: 'Producers', href: '#producers' }
  ];

  return (
    <header className={`self-stretch flex w-full items-center gap-[40px_100px] text-sm font-normal leading-none justify-between flex-wrap px-[150px] py-3 border-[rgba(239,239,239,1)] border-b max-md:max-w-full max-md:px-5 ${className}`}>
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/7d22d1b387c53084b9023edc3e88327476f862b4?placeholderIfAbsent=true"
        alt="Tea Company Logo"
        className="aspect-[4.37] object-contain w-[105px] self-stretch shrink-0 my-auto"
      />
      
      <nav className="self-stretch flex min-w-60 items-center gap-6 text-black text-center flex-wrap my-auto max-md:max-w-full">
        {navigationItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="self-stretch flex items-center gap-2.5 justify-center my-auto px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <span className="self-stretch my-auto whitespace-nowrap">
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      <div className="self-stretch flex items-center gap-3 text-[rgba(76,76,76,1)] whitespace-nowrap my-auto">
        <div className="self-stretch flex items-center gap-[3px] my-auto pl-3 pr-1.5 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="self-stretch my-auto">{selectedLanguage}</span>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/cbbb23b1d46a928bedc44136fefc0297f6355812?placeholderIfAbsent=true"
            alt="Language dropdown"
            className="aspect-[1] object-contain w-3 self-stretch shrink-0 my-auto"
          />
        </div>
        
        <button className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto hover:opacity-70 transition-opacity">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/dbe42f7a2a6777f499b0c6e0cb6e210b255341e3?placeholderIfAbsent=true"
            alt="Search"
            className="w-full h-full"
          />
        </button>
        
        <button className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto hover:opacity-70 transition-opacity">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f6d00f3370ac259b02aa149455d071c73852c30a?placeholderIfAbsent=true"
            alt="User account"
            className="w-full h-full"
          />
        </button>
        
        <button className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto hover:opacity-70 transition-opacity">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/98f20a3e4542a7e60e90d13193239cb2efd2290d?placeholderIfAbsent=true"
            alt="Shopping cart"
            className="w-full h-full"
          />
        </button>
      </div>
    </header>
  );
};
