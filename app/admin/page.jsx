'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { Car, Image as ImageIcon, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    cars: 0,
    gallery: 0,
    messages: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: carsCount },
          { count: galleryCount },
          { count: messagesCount },
          { count: usersCount }
        ] = await Promise.all([
          supabase.from('cars').select('*', { count: 'exact', head: true }),
          supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          cars: carsCount || 0,
          gallery: galleryCount || 0,
          messages: messagesCount || 0,
          users: usersCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Cars', value: stats.cars, icon: <Car className="text-blue-500" />, change: '+2 this week' },
    { label: 'Gallery Items', value: stats.gallery, icon: <ImageIcon className="text-purple-500" />, change: 'Up to date' },
    { label: 'New Messages', value: stats.messages, icon: <MessageSquare className="text-green-500" />, change: '4 unread' },
    { label: 'Registered Users', value: stats.users, icon: <Users className="text-brand-orange" />, change: '+12% growth' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-brand-silver">Track your business performance and inventory at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-brand-gray/30 p-6 rounded-2xl border border-brand-gray hover:border-brand-orange/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-brand-dark p-3 rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-brand-silver text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-brand-gray/20 p-8 rounded-2xl border border-brand-gray h-64 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-bold mb-2">Sales Activity</h3>
            <p className="text-brand-silver text-sm">Chart visualization will be implemented in later phases.</p>
        </div>
        <div className="bg-brand-gray/20 p-8 rounded-2xl border border-brand-gray h-64 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-bold mb-2">Recent Inquiries</h3>
            <p className="text-brand-silver text-sm">Detailed logs will appear as messages are submitted.</p>
        </div>
      </div>
    </div>
  );
}
