import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { CartSidebar } from './CartSidebar';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Store', href: '#store' },
    { label: 'The Tea Encyclopedia', href: '#encyclopedia' },
    { label: 'About', href: '#about' },
    { label: 'Producers', href: '#producers' }
  ];

  return (
    <>
      <header className={`self-stretch flex w-full items-center justify-between text-sm font-normal leading-none px-4 md:px-8 lg:px-[150px] py-3 border-[rgba(239,239,239,1)] border-b ${className}`}>
        {/* Logo */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/7d22d1b387c53084b9023edc3e88327476f862b4?placeholderIfAbsent=true"
          alt="Tea Company Logo"
          className="aspect-[4.37] object-contain w-20 md:w-[90px] lg:w-[105px] flex-shrink-0"
        />
        
        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 text-black text-center">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center gap-2.5 justify-center px-3 py-1.5 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Side - Icons */}
        <div className="flex items-center gap-2 md:gap-3 text-[rgba(76,76,76,1)]">
          {/* Language Dropdown - Show on tablet+ */}
          <div className="hidden md:flex items-center gap-[3px] pl-2 md:pl-3 pr-1 md:pr-1.5 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-xs md:text-sm">{selectedLanguage}</span>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/cbbb23b1d46a928bedc44136fefc0297f6355812?placeholderIfAbsent=true"
              alt="Language dropdown"
              className="aspect-[1] object-contain w-2.5 md:w-3"
            />
          </div>
          
          {/* Search Icon - Show on tablet+ */}
          <button className="hidden md:block aspect-[1] object-contain w-5 md:w-6 hover:opacity-70 transition-opacity">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/dbe42f7a2a6777f499b0c6e0cb6e210b255341e3?placeholderIfAbsent=true"
              alt="Search"
              className="w-full h-full"
            />
          </button>
          
          {/* User Account - Show on tablet+ */}
          <button 
            onClick={() => navigate('/auth')}
            className="hidden md:block aspect-[1] object-contain w-5 md:w-6 hover:opacity-70 transition-opacity"
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f6d00f3370ac259b02aa149455d071c73852c30a?placeholderIfAbsent=true"
              alt="User account"
              className="w-full h-full"
            />
          </button>
          
          {/* Cart Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative aspect-[1] object-contain w-5 md:w-6 hover:opacity-70 transition-opacity"
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/98f20a3e4542a7e60e90d13193239cb2efd2290d?placeholderIfAbsent=true"
              alt="Shopping cart"
              className="w-full h-full"
            />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1.5 md:-top-2 -right-1.5 md:-right-2 bg-[rgba(173,29,24,1)] text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-medium">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* Mobile & Tablet Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/7d22d1b387c53084b9023edc3e88327476f862b4?placeholderIfAbsent=true"
                alt="Tea Company Logo"
                className="aspect-[4.37] object-contain w-20"
              />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 flex flex-col p-4 space-y-2">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center p-4 text-lg hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile Footer Actions */}
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-center gap-6">
                <button className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/dbe42f7a2a6777f499b0c6e0cb6e210b255341e3?placeholderIfAbsent=true"
                    alt="Search"
                    className="w-5 h-5"
                  />
                  <span>Axtarış</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/f6d00f3370ac259b02aa149455d071c73852c30a?placeholderIfAbsent=true"
                    alt="User account"
                    className="w-5 h-5"
                  />
                  <span>Hesab</span>
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span>{selectedLanguage}</span>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/cbbb23b1d46a928bedc44136fefc0297f6355812?placeholderIfAbsent=true"
                    alt="Language dropdown"
                    className="w-3 h-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};
