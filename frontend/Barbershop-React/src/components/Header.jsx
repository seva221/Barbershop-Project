import React, { useState } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

export default function Header({ onBookNow }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-amber-600 p-2 rounded-lg">
              <Scissors size={24} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tighter">THE BARBERSHOP</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-slate-300 hover:text-white transition-colors">Services</a>
            <a href="#gallery" className="text-slate-300 hover:text-white transition-colors">Gallery</a>
            <a href="#barbers" className="text-slate-300 hover:text-white transition-colors">Team</a>
            <button 
              onClick={onBookNow} 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-transform active:scale-95"
            >
              Book Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">Services</a>
            <a href="#gallery" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">Gallery</a>
            <button 
              onClick={() => {
                onBookNow();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-amber-600 text-white hover:bg-amber-700 mt-4"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}