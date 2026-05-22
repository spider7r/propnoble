import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronRight, Sparkles, BookOpen, Search } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useTradeMode } from '../context/TradeModeContext';
import ModeToggle from './ModeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { mode, getModePath } = useTradeMode();

  const primaryNavLinks = [
    { name: 'Home', path: getModePath('/') },
    { name: 'Offers', path: getModePath('/offers') },
    { name: 'Challenges', path: getModePath('/competitions') },
    { name: 'Best Sellers', path: getModePath('/firms') },
    { name: 'Reviews', path: getModePath('/reviews') },
    { name: 'Favorite Firms', path: getModePath('/firms') },
    { name: 'Prop Firm Rules', path: getModePath('/rules') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed z-50 top-0 left-0 right-0 w-full">
      {/* ═══════════════════ DESKTOP NAV ═══════════════════ */}
      <div className="bg-[#0a0908]/95 backdrop-blur-xl border-b border-brand-border/50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Row 1: Logo | Search | ModeToggle | Actions (Desktop) */}
          {/*         Logo | Hamburger (Mobile) */}
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to={getModePath('/')} className="flex items-center gap-2 group shrink-0">
              <img 
                src={mode === 'crypto' ? '/noble-crypto.png' : mode === 'forex' ? '/noble-forex.png' : '/noble-futures.png'} 
                alt="PropNoble" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </Link>

            {/* Search Bar (Desktop Only) */}
            <div className="hidden md:flex flex-1 max-w-xs relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-[#181611] border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-accent/50 transition-colors"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Center Toggle (Desktop Only) */}
            <div className="hidden md:flex justify-center flex-1">
               <ModeToggle />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {user ? (
                <Link to={getModePath('/dashboard')}>
                  <Button variant="secondary" size="sm" className="gap-2 bg-brand-accent/10 text-brand-accent border-brand-accent/20 hover:bg-brand-accent hover:text-white rounded-full">
                    <User size={14} /> Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to={getModePath('/login')} className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                    Log in
                  </Link>
                  <Link to={getModePath('/signup')}>
                    <Button size="sm" className="bg-brand-accent text-black font-bold hover:bg-brand-accent-hover border-none shadow-brand-glow rounded-full px-5 py-1.5">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* ═══ MOBILE: Hamburger Button Only ═══ */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* ═══ MOBILE Row 2: Mode Toggle (below logo row) ═══ */}
          <div className="md:hidden flex justify-center w-full pb-3 -mt-1">
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* ═══════════════════ DESKTOP Bottom Bar (Nav Links) ═══════════════════ */}
      <div className="hidden md:block border-b border-white/5 bg-[#0a0908]/90 backdrop-blur-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-center gap-6 h-12 overflow-x-auto no-scrollbar">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold whitespace-nowrap px-1 py-3 border-b-2 transition-colors ${isActive(link.path)
                  ? 'border-brand-accent text-white'
                  : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════ MOBILE SLIDE-DOWN MENU ═══════════════════ */}
      <div 
        className={`md:hidden fixed inset-x-0 bg-[#0a0908]/98 backdrop-blur-2xl border-b border-brand-border/50 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ top: 'auto' }}
      >
        <div className="px-5 py-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search prop firms..." 
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {link.name}
                <ChevronRight size={16} className={`${isActive(link.path) ? 'text-brand-accent' : 'text-neutral-600'}`} />
              </Link>
            ))}
          </div>



          {/* Auth Buttons */}
          <div className="pt-3 border-t border-[#2a2a2a] space-y-3">
            {user ? (
              <Link to={getModePath('/dashboard')} onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center gap-2 bg-brand-accent text-black font-bold rounded-xl py-3 border-none shadow-brand-glow">
                  <User size={18} /> Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to={getModePath('/login')} onClick={() => setIsOpen(false)} className="block">
                  <button className="w-full py-3 rounded-xl border border-[#2a2a2a] text-neutral-300 font-semibold text-sm hover:bg-white/5 transition-colors">
                    Log in
                  </button>
                </Link>
                <Link to={getModePath('/signup')} onClick={() => setIsOpen(false)} className="block">
                  <button className="w-full py-3 rounded-xl bg-brand-accent text-black font-bold text-sm shadow-brand-glow border-none">
                    Sign Up Free
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
