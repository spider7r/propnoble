import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useTradeMode } from '../context/TradeModeContext';
import ModeToggle from './ModeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { mode, getModePath } = useTradeMode();

  const navLinks = [
    { name: 'Browse Firms', path: getModePath('/firms') },
    { name: 'Competitions', path: getModePath('/competitions') },
    { name: 'Offers', path: getModePath('/offers') },
    { name: 'Reviews', path: getModePath('/reviews') },
    { name: 'Blog', path: getModePath('/blog') },
    { name: '⚡ Noble AI', path: getModePath('/noble-ai') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed z-50 transition-all duration-500 ease-in-out top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[90%] max-w-7xl bg-[#181611]/80 backdrop-blur-xl border border-brand-border/50 rounded-2xl py-2 shadow-glow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={getModePath('/')} className="flex items-center gap-2 group">
            <img src={mode === 'futures' ? '/nobelf-logo.png' : '/nobel-logo.png'} alt="PropNoble" className="h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => (
              (link as any).external ? (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium px-5 py-2 rounded-full transition-all text-brand-muted hover:text-white hover:bg-white/5"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium px-5 py-2 rounded-full transition-all ${isActive(link.path)
                    ? 'bg-brand-accent text-white shadow-lg shadow-brand-glow'
                    : 'text-brand-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            
            {user ? (
              <Link to={getModePath('/dashboard')}>
                <Button variant="secondary" size="sm" className="gap-2 bg-brand-accent/10 text-brand-accent border-brand-accent/20 hover:bg-brand-accent hover:text-white">
                  <User size={16} /> Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to={getModePath('/login')} className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
                  Log In
                </Link>
                <Link to={getModePath('/signup')}>
                  <Button size="sm" className="bg-brand-accent text-white hover:bg-white hover:text-black border-none shadow-brand-glow">
                    Get Funded
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-brand-border">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              (link as any).external ? (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-brand-muted hover:text-brand-primary hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-brand-muted hover:text-brand-primary hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="pt-2 pb-4">
              <ModeToggle />
            </div>

            <div className="pt-4 border-t border-brand-border mt-4 space-y-3">
              {user ? (
                <Link to={getModePath('/dashboard')} onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center gap-2 bg-brand-accent text-white">
                    <User size={18} /> Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to={getModePath('/login')} onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center border-brand-charcoal hover:bg-brand-charcoal">
                      Log In
                    </Button>
                  </Link>
                  <Link to={getModePath('/signup')} onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center bg-brand-accent text-white border-none shadow-brand-glow">
                      Get Funded
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
