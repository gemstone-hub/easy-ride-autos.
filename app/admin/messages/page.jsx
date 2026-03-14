'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { MessageSquare, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      alert('Error deleting message: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Customer Inquiries</h1>
        <p className="text-brand-silver">Manage messages and inquiries from your potential customers.</p>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-20 text-center text-brand-silver italic">Loading inquiries...</div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-brand-silver italic bg-brand-gray/10 rounded-2xl border border-dashed border-brand-gray">
              No inquiries received yet.
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-brand-gray/20 rounded-2xl border border-brand-gray p-6 hover:border-brand-orange/30 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-orange/10 p-3 rounded-xl text-brand-orange">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{msg.full_name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-silver">
                        <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                        {msg.phone && <span className="flex items-center gap-1"><Phone size={14} /> {msg.phone}</span>}
                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(msg.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-gray/40 text-brand-silver text-[10px] font-bold uppercase py-1 px-3 rounded-full">
                      {msg.subject}
                    </span>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-brand-silver hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-brand-dark/50 p-6 rounded-xl border border-brand-gray/50 text-brand-silver leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
