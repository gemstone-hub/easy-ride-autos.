'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut, loading } = useAuth();

  const allNavLinks = [
    { name: 'Home', path: '/', public: true },
    { name: 'Available Cars', path: '/cars', public: false },
    { name: 'Gallery', path: '/gallery', public: false },
    { name: 'About Us', path: '/about', public: false },
    { name: 'Contact', path: '/contact', public: false },
  ];

  const navLinks = allNavLinks.filter(link => link.public || user);

  const isActive = (path) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      // 1. Call the auth context signout and AWAIT it
      await signOut();
      
      // 2. Close all UI menus immediately
      setShowUserMenu(false);
      setIsOpen(false);
      
      // 3. Force a hard redirect to home to ensure fresh state
      window.location.href = '/';
    } catch (error) {
      console.error('Signout failed:', error);
      window.location.href = '/'; // Fallback redirect
    }
  };

  return (
    <header className="fixed w-full z-50 bg-brand-dark/95 backdrop-blur-md border-b border-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Easy Ride Autos" className="h-12 sm:h-14 object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-brand-orange ${
                    isActive(link.path) ? 'text-brand-orange' : 'text-brand-silver'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center gap-4 pl-4 border-l border-brand-gray ml-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin"></div>
              ) : user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-brand-silver hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center text-brand-orange">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium hidden lg:block">
                      {profile?.full_name?.split(' ')[0] || 'Member'}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-brand-dark border border-brand-gray rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-brand-silver hover:text-white hover:bg-brand-gray transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Link 
                        href="/account" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-brand-silver hover:text-white hover:bg-brand-gray transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <Link 
                        href="/favorites" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-brand-silver hover:text-white hover:bg-brand-gray transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        My Favorites
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-brand-gray mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-medium text-brand-silver hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-brand-orange text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-all shadow-lg shadow-brand-orange/20">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-silver hover:text-white hover:bg-brand-gray focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-brand-gray overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-brand-orange bg-brand-gray/50'
                    : 'text-brand-silver hover:text-white hover:bg-brand-gray'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {loading ? (
              <div className="pt-4 border-t border-brand-gray flex justify-center py-4">
                <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin"></div>
              </div>
            ) : !user ? (
              <div className="pt-4 border-t border-brand-gray grid grid-cols-2 gap-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center px-3 py-2 rounded-md text-base font-medium text-brand-silver bg-brand-gray"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center px-3 py-2 rounded-md text-base font-medium text-white bg-brand-orange"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-brand-gray space-y-1">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-brand-silver hover:text-white"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link 
                  href="/account" 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-silver hover:text-white"
                >
                  My Account
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
