import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  HardHat,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 lg:px-8">
      <div className={`max-w-7xl mx-auto backdrop-blur-md rounded-2xl border transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/90 border-slate-700/70 shadow-2xl shadow-slate-950 hover:border-blue-500/40' 
          : 'bg-white/95 border-slate-200/90 shadow-md shadow-slate-950/10 hover:border-slate-300'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand */}
            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
              <img
                src="/logo-1.png"
                alt="Atemzy Hitech"
                className="w-11 h-11 rounded-full object-contain group-hover:scale-105 transition-transform drop-shadow-md"
              />
              <div>
                <span className={`block text-xl font-black tracking-tight transition-colors ${
                  isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-950 group-hover:text-blue-700'
                }`}>
                  ATEMZY <span className="text-blue-600">HITECH</span>
                </span>
                <span className={`block text-[10px] font-semibold tracking-widest uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Engineering Services Ltd
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Controls: Theme Button + Quote */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Theme Toggle Button (The Odin Project style - icon only) */}
              <button
                onClick={toggleTheme}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isDark
                    ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200 hover:border-amber-400/40 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:text-slate-950 hover:border-slate-400 shadow-sm'
                }`}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle site theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-300 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>

              <Link
                to="/quote"
                className="btn-3d text-xs py-2.5 px-5"
              >
                <span>Request a Quote</span>
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </Link>
            </div>

            {/* Mobile Controls: Theme + Menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                type="button"
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                  isDark
                    ? 'bg-slate-800/90 text-amber-300 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle site theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <button
                onClick={toggleMenu}
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-xl focus:outline-none ${
                  isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className={`lg:hidden border-t px-4 pt-3 pb-6 space-y-3 rounded-b-2xl ${
            isDark 
              ? 'border-slate-700/60 bg-slate-900/95' 
              : 'border-slate-200 bg-white/98'
          }`} id="mobile-menu">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-base font-semibold ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/quote"
                onClick={closeMenu}
                className="btn-3d w-full text-center text-xs py-3"
              >
                <span>Request a Quote</span>
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
