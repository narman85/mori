import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Search Popup */}
      <div className={`fixed top-0 left-0 right-0 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        
        {/* Header with Search Input */}
        <div className="flex items-center gap-4 p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Çay axtarın..."
              className="w-full pl-10 pr-4 py-3 focus:outline-none text-lg bg-transparent"
              autoFocus
            />
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Content */}
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {searchTerm.trim() !== '' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                "{searchTerm}" üçün nəticələr
              </h3>
              <div className="text-gray-500 text-center py-8">
                Axtarış funksiyası hələ hazırlanmaqdadır...
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};