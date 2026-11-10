import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Sparkles, PlusCircle, LayoutDashboard, Menu, X, Gift } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // If we are on public recipient page /b/:slug, Navbar is omitted to give recipient an immersive surprise!
  if (location.pathname.startsWith('/b/')) {
    return null;
  }

  const navLinks = [
    { label: 'Create Surprise', path: '/create', icon: PlusCircle, primary: true },
    { label: 'My Celebrations', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Demo', path: '/b/abhi-celebration', icon: Gift },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-100/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-rose-400 rounded-xl p-1"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-300/40 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
              <Sparkles className="w-3.5 h-3.5 text-amber-200 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
                Heartfelt
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-rose-500 -mt-1 hidden sm:block">
                Birthday Surprises
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/b/abhi-celebration"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50/70 rounded-full transition-all flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4 text-rose-400" />
              <span>See Demo</span>
            </Link>

            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50/70 rounded-full transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-rose-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/create"
              className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-300/40 hover:shadow-lg hover:shadow-rose-300/60 transform hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create a Surprise</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all ${
                  link.primary
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/40'
                    : 'text-stone-700 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${link.primary ? 'text-white' : 'text-rose-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

