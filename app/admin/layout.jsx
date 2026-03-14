'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  Image as ImageIcon, 
  MessageSquare, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AdminLayout({ children }) {
  const { signOut, profile, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Simple protection check in the layout
  React.useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, loading, router]);

  const handleSignOut = () => {
    try {
      signOut();
      setTimeout(() => {
        window.location.href = '/';
      }, 200);
    } catch (error) {
       console.error('Signout failed:', error);
       window.location.href = '/';
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Car size={20} />, label: 'Cars', path: '/admin/cars' },
    { icon: <ImageIcon size={20} />, label: 'Gallery', path: '/admin/gallery' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/admin/messages' },
  ];

  if (loading) return null;
  if (!isAdmin) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-brand-dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-gray bg-brand-dark/50 hidden md:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Admin Panel</h2>
              <p className="text-brand-silver text-xs">{profile?.full_name || 'Administrator'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                      : 'text-brand-silver hover:text-white hover:bg-brand-gray'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-brand-gray">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Navigation Header */}
          <div className="md:hidden flex items-center justify-between mb-8 bg-brand-gray/30 p-4 rounded-2xl border border-brand-gray">
             <div className="flex items-center gap-3">
                <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange">
                  <User size={20} />
                </div>
                <span className="text-white font-bold">Admin</span>
             </div>
             <div className="flex gap-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`p-2 rounded-lg transition-all ${
                        isActive ? 'bg-brand-orange text-white' : 'text-brand-silver hover:bg-brand-gray'
                      }`}
                    >
                      {item.icon}
                    </Link>
                  );
                })}
             </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
