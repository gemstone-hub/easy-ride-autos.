'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { Mail, Shield, Save, UserCircle, Loader2, CheckCircle, MessageCircle, Settings } from 'lucide-react';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatWindow from '../../src/components/chat/ChatWindow';

function AccountContent() {
  const { profile, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'support' ? 'support' : 'profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirectTo=/account');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({ full_name: profile.full_name || '' });
    }
  }, [profile]);

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'support') setActiveTab('support');
    else setActiveTab('profile');
  }, [searchParams]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="text-center">
           <Loader2 className="w-12 h-12 animate-spin text-brand-orange mx-auto mb-4" />
           <p className="text-brand-silver animate-pulse">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-3xl border transition-all ${activeTab === 'profile' ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'bg-brand-gray/20 border-brand-gray text-brand-silver hover:border-brand-orange/50'}`}
            >
              <Settings size={24} />
              <div className="text-left">
                <p className="text-sm opacity-80 uppercase tracking-widest font-bold">Manage Account</p>
                <p className="text-lg font-bold">Profile Settings</p>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('support')}
              className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-3xl border transition-all ${activeTab === 'support' ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'bg-brand-gray/20 border-brand-gray text-brand-silver hover:border-brand-orange/50'}`}
            >
              <MessageCircle size={24} />
              <div className="text-left">
                <p className="text-sm opacity-80 uppercase tracking-widest font-bold">Get Help</p>
                <p className="text-lg font-bold">Support & Chat</p>
              </div>
            </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col md:flex-row gap-12"
            >
              {/* Sidebar */}
              <div className="md:w-1/3">
                <div className="bg-brand-gray/20 rounded-3xl p-8 border border-brand-gray text-center relative overflow-hidden group h-fit">
                   <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative z-10">
                      <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange">
                        <UserCircle size={64} />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">{formData.full_name || 'User'}</h2>
                      <p className="text-brand-silver text-sm mb-6 uppercase tracking-widest">{profile?.role || 'Customer'}</p>
                      
                      <div className="space-y-4 pt-6 border-t border-brand-gray text-left">
                        <div className="flex items-center gap-3 text-brand-silver text-sm">
                            <Mail size={16} className="text-brand-orange" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-silver text-sm">
                            <Shield size={16} className="text-brand-orange" />
                            <span>Security: Verified</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Main Area */}
              <div className="md:w-2/3">
                <div className="bg-brand-gray/20 rounded-3xl p-8 md:p-10 border border-brand-gray">
                  <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <Input 
                        label="Full Name" 
                        id="full_name" 
                        value={formData.full_name} 
                        onChange={handleChange} 
                        required 
                      />
                      <div className="flex flex-col gap-2 opacity-50 cursor-not-allowed">
                        <label className="text-sm font-medium text-brand-silver">Email Address (Read Only)</label>
                        <div className="bg-brand-dark border border-brand-gray rounded-xl py-3 px-4 text-brand-silver">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-brand-gray flex items-center justify-between gap-4">
                      <div className="flex-1">
                        {success && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-green-500 font-medium"
                          >
                            <CheckCircle size={18} />
                            Profile updated successfully
                          </motion.div>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={loading}
                        className="flex items-center gap-2 min-w-[140px] justify-center"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-brand-gray/20 rounded-3xl border border-brand-gray overflow-hidden h-[600px] flex flex-col"
            >
              <div className="p-6 border-b border-brand-gray bg-brand-dark/30">
                <h2 className="text-2xl font-bold text-white">Live Support & Chat</h2>
                <p className="text-brand-silver">Chat with our team in real-time for any inquiries.</p>
              </div>
              <div className="flex-1 overflow-hidden">
                 <ChatWindow />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
