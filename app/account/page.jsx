'use client';
import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { User, Mail, Shield, Save, UserCircle, Loader2, CheckCircle } from 'lucide-react';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import { motion } from 'framer-motion';

export default function AccountPage() {
  const { profile, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar / Info */}
          <div className="md:w-1/3">
            <div className="bg-brand-gray/20 rounded-3xl p-8 border border-brand-gray text-center relative overflow-hidden group">
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

          {/* Main Area / Form */}
          <div className="md:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-gray/20 rounded-3xl p-8 md:p-10 border border-brand-gray"
            >
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

                <div className="grid sm:grid-cols-2 gap-6">
                   <Input 
                    label="Phone Number" 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+234..." 
                  />
                  <div className="flex flex-col gap-2 opacity-50 cursor-not-allowed">
                    <label className="text-sm font-medium text-brand-silver">Account Role</label>
                    <div className="bg-brand-dark border border-brand-gray rounded-xl py-3 px-4 text-brand-silver capitalize">
                      {profile?.role}
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
