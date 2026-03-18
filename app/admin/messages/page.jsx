'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { Mail, Trash2, Search, Loader2, MessageSquare, Clock, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      setInquiries(inquiries.filter(i => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Inbox</h1>
          <p className="text-brand-silver">Manage and reply to customer inquiries via email.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-brand-gray/20 border border-brand-gray rounded-2xl flex flex-col h-[650px] overflow-hidden">
          <div className="p-4 border-b border-brand-gray bg-brand-dark/50">
            <h2 className="font-semibold text-white">Recent Inquiries</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-brand-orange" />
              </div>
            ) : (
              <div className="divide-y divide-brand-gray/30">
                {inquiries.map((inq) => (
                  <button
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`w-full text-left p-4 hover:bg-brand-gray/30 transition-all ${selectedInquiry?.id === inq.id ? 'bg-brand-orange/10 border-l-4 border-brand-orange' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-white truncate max-w-[120px]">{inq.name}</span>
                      <span className="text-[10px] text-brand-silver">{formatDate(inq.created_at)}</span>
                    </div>
                    <p className="text-xs text-brand-silver truncate">{inq.message}</p>
                  </button>
                ))}
                {inquiries.length === 0 && (
                   <div className="p-10 text-center text-brand-silver italic text-sm">No inquiries found.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content View */}
        <div className="lg:col-span-2 bg-brand-gray/20 border border-brand-gray rounded-2xl flex flex-col h-[650px] overflow-hidden">
          {selectedInquiry ? (
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-brand-gray bg-brand-dark/30 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedInquiry.name}</h2>
                  <p className="text-brand-silver">{selectedInquiry.email}</p>
                </div>
                <button 
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)} 
                  className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="flex-1 p-8 overflow-y-auto text-brand-silver whitespace-pre-wrap leading-relaxed custom-scrollbar">
                {selectedInquiry.message}
              </div>
              <div className="p-6 border-t border-brand-gray">
                 <a 
                  href={`mailto:${selectedInquiry.email}`} 
                  className="w-full bg-brand-orange text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand-orange/20"
                 >
                   <Reply size={20} /> Reply via Email
                 </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-silver opacity-40">
              <MessageSquare size={48} className="mb-4" />
              <p>Select an inquiry to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
