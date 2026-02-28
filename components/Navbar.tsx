import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Peptides', path: '/peptides' },
    { name: 'Validation', path: '/validate' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white py-4 lg:py-6 px-6 lg:px-12 border-b border-gray-100 rounded-bl-[1.5rem] lg:rounded-bl-[2.5rem] rounded-br-[1.5rem] lg:rounded-br-[2.5rem] shadow-xl shadow-black/5">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Novara Labs" className="h-12 lg:h-20 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${location.pathname === link.path ? 'text-orange-500' : 'text-gray-400 hover:text-black'}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-500 transition-all group-hover:w-full ${location.pathname === link.path ? 'w-full' : 'w-0'}`}></span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 focus:outline-none z-[60]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[2px] rounded-full bg-black transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
          <span className={`block w-6 h-[2px] rounded-full bg-black transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'opacity-0 translate-x-2' : ''}`}></span>
          <span className={`block w-6 h-[2px] rounded-full bg-black transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-8 lg:p-12 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300 rounded-bl-[1.5rem] rounded-br-[1.5rem] shadow-2xl">
          <div className="flex flex-col space-y-6 lg:space-y-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-lg font-black uppercase tracking-tight py-2 min-h-[44px] flex items-center ${location.pathname === link.path ? 'text-orange-500' : 'text-gray-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
