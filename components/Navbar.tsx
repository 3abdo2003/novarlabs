import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { region, setRegion } = useRegion();
  const { itemCount, openCart } = useCart();

  const navLinks = [
    { name: 'Peptides', path: '/peptides' },
    { name: 'Validation', path: '/validate' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md py-4 lg:py-6 px-6 lg:px-12 border-b border-gray-100 rounded-bl-[1.5rem] lg:rounded-bl-[2.5rem] rounded-br-[1.5rem] lg:rounded-br-[2.5rem] shadow-xl shadow-black/5">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Novara Labs" className="h-16 lg:h-28 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
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

          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-full border border-gray-100 ml-4">
            <button
              type="button"
              onClick={() => setRegion('EG')}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${region === 'EG' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-black'}`}
            >
              Egypt
            </button>
            <button
              type="button"
              onClick={() => setRegion('WORLDWIDE')}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${region === 'WORLDWIDE' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-black'}`}
            >
              Worldwide
            </button>
          </div>

          {region === 'EG' && (
            <button
              onClick={openCart}
              className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all border border-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-black" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          )}
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

            <div className="pt-6 border-t border-gray-100">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Region</div>
              <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setRegion('EG')}
                  className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${region === 'EG' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400'}`}
                >
                  Egypt
                </button>
                <button
                  type="button"
                  onClick={() => setRegion('WORLDWIDE')}
                  className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${region === 'WORLDWIDE' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400'}`}
                >
                  Worldwide
                </button>
              </div>
            </div>

            {region === 'EG' && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openCart();
                }}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl px-4 py-4 min-h-[56px] w-full text-left border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-black" />
                  <span className="text-sm font-black uppercase tracking-tight">Cart</span>
                </div>
                <span className="text-xs font-black text-white bg-orange-500 rounded-full px-3 py-1 shadow-lg shadow-orange-500/20">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
