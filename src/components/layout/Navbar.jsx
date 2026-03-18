'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Heart, 
  UserCircle, 
  MessageCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const allNavLinks = [
    { name: 'Home', path: '/', public: true },
    { name: 'Available Cars', path: '/cars', public: true },
    { name: 'Gallery', path: '/gallery', public: true },
    { name: 'About Us', path: '/about', public: true },
    { name: 'Contact', path: '/contact', public: true },
  ];

  const navLinks = allNavLinks.filter(link => link.public || user);

  const isActive = (path) => {
    if (path === '/' && pathname !== '/') return false;
    if (path === '/account' && pathname.startsWith('/account')) return true;
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Signout failed:', error);
      router.push('/');
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
                <div className="relative" ref={menuRef}>
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
                    <div className="absolute right-0 mt-2 w-56 bg-brand-dark border border-brand-gray rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-brand-gray/50 mb-1">
                         <p className="text-xs text-brand-silver opacity-50 uppercase tracking-widest font-bold">My Account</p>
                      </div>
                      
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${pathname.startsWith('/admin') ? 'bg-brand-orange text-white' : 'text-brand-silver hover:text-white hover:bg-brand-gray'}`}
                        >
                          <LayoutDashboard size={18} />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <Link 
                        href="/account" 
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${pathname === '/account' ? 'bg-brand-orange text-white' : 'text-brand-silver hover:text-white hover:bg-brand-gray'}`}
                      >
                        <UserCircle size={18} />
                        Profile Settings
                      </Link>

                      <Link 
                        href="/account?tab=support" 
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${pathname.includes('tab=support') ? 'bg-brand-orange text-white' : 'text-brand-silver hover:text-white hover:bg-brand-gray'}`}
                      >
                        <MessageCircle size={18} />
                        Live Support
                      </Link>

                      <Link 
                        href="/favorites" 
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${pathname === '/favorites' ? 'bg-brand-orange text-white' : 'text-brand-silver hover:text-white hover:bg-brand-gray'}`}
                      >
                        <Heart size={18} />
                        My Favorites
                      </Link>

                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-brand-gray mt-1"
                      >
                        <LogOut size={18} />
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
              <div className="pt-4 border-t border-brand-gray grid grid-cols-2 gap-4 p-2">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center px-3 py-3 rounded-xl text-base font-medium text-brand-silver bg-brand-gray/50 border border-brand-gray"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center px-3 py-3 rounded-xl text-base font-medium text-white bg-brand-orange shadow-lg shadow-brand-orange/20"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-brand-gray space-y-1 p-2">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-brand-silver hover:text-white hover:bg-brand-gray"
                  >
                    <LayoutDashboard size={20} />
                    Admin Panel
                  </Link>
                )}
                <Link 
                  href="/account" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-brand-silver hover:text-white hover:bg-brand-gray"
                >
                  <UserCircle size={20} />
                  My Account
                </Link>
                <Link 
                  href="/account?tab=support" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-brand-silver hover:text-white hover:bg-brand-gray"
                >
                  <MessageCircle size={20} />
                  Live Support
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-500/10"
                >
                  <LogOut size={20} />
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
