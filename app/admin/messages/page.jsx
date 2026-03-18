'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { Mail, Trash2, Send, Search, Loader2, MessageSquare, Clock, User, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMessagesPage() {
  const [viewMode, setViewMode] = useState('inquiries'); // 'inquiries' or 'chats'
  const [inquiries, setInquiries] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchInitialData();

    // Global subscription for new messages to update the user list in real-time
    const globalChannel = supabase
      .channel('admin_global_chats')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chats' 
      }, () => {
        // Refresh the user list when any new message arrives
        fetchChatUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchInquiries(), fetchChatUsers()]);
    setLoading(false);
  };

  const fetchInquiries = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setInquiries(data || []);
  };

  const fetchChatUsers = async () => {
    try {
      // Fetch users who have chats
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*, chats!inner(created_at)')
        .order('id', { foreignTable: 'chats', ascending: false });
      
      const uniqueUsers = [];
      const userIds = new Set();
      if (usersData) {
        usersData.forEach(u => {
          if (!userIds.has(u.id)) {
            userIds.add(u.id);
            uniqueUsers.push(u);
          }
        });
      }
      setChatUsers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };

  // Chat messages subscription for the SELECTED user
  useEffect(() => {
    if (!selectedChatUser) {
      setChatMessages([]);
      return;
    }

    const fetchChatMessages = async () => {
      const { data } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', selectedChatUser.id)
        .order('created_at', { ascending: true });
      setChatMessages(data || []);
    };

    fetchChatMessages();

    const channel = supabase
      .channel(`admin_chat:${selectedChatUser.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chats',
        filter: `user_id=eq.${selectedChatUser.id}`
      }, (payload) => {
        setChatMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChatUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedChatUser) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('chats')
        .insert([{
          user_id: selectedChatUser.id,
          sender_role: 'admin',
          content: newMessage.trim(),
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending admin chat:', error);
    } finally {
      setSending(false);
    }
  };

  const handleReplyViaChat = async (email) => {
    let user = chatUsers.find(u => u.email === email);
    
    if (!user) {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      setLoading(false);

      if (data) {
        user = data;
        setChatUsers(prev => [user, ...prev]);
      }
    }

    if (user) {
      setSelectedChatUser(user);
      setViewMode('chats');
    } else {
      alert('This user is not registered on the platform. Please reply via email.');
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
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Inbox & Chat</h1>
          <p className="text-brand-silver">Manage customer inquiries and real-time chats.</p>
        </div>
        
        <div className="flex bg-brand-gray/20 p-1 rounded-xl border border-brand-gray">
          <button 
            onClick={() => setViewMode('inquiries')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'inquiries' ? 'bg-brand-orange text-white shadow-lg' : 'text-brand-silver hover:text-white'}`}
          >
            Inquiries
          </button>
          <button 
            onClick={() => setViewMode('chats')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'chats' ? 'bg-brand-orange text-white shadow-lg' : 'text-brand-silver hover:text-white'}`}
          >
            Live Chat
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-brand-gray/20 border border-brand-gray rounded-2xl flex flex-col h-[650px] overflow-hidden">
          <div className="p-4 border-b border-brand-gray bg-brand-dark/50">
            <h2 className="font-semibold text-white">{viewMode === 'inquiries' ? 'Recent Inquiries' : 'Active Chats'}</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-brand-orange" /></div>
            ) : (
              <div className="divide-y divide-brand-gray/30">
                {viewMode === 'inquiries' ? (
                  inquiries.map((inq) => (
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
                  ))
                ) : (
                  chatUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setSelectedChatUser(u)}
                      className={`w-full text-left p-4 hover:bg-brand-gray/30 transition-all ${selectedChatUser?.id === u.id ? 'bg-brand-orange/10 border-l-4 border-brand-orange' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                            <User size={20} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold truncate text-sm">{u.full_name}</h4>
                            <p className="text-xs text-brand-silver truncate">{u.email}</p>
                         </div>
                      </div>
                    </button>
                  ))
                )}
                {(viewMode === 'inquiries' ? inquiries : chatUsers).length === 0 && (
                   <div className="p-10 text-center text-brand-silver italic text-sm">Nothing found.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content View */}
        <div className="lg:col-span-2 bg-brand-gray/20 border border-brand-gray rounded-2xl flex flex-col h-[650px] overflow-hidden">
          {viewMode === 'inquiries' ? (
            selectedInquiry ? (
              <div className="flex flex-col h-full">
                <div className="p-8 border-b border-brand-gray bg-brand-dark/30 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedInquiry.name}</h2>
                    <p className="text-brand-silver">{selectedInquiry.email}</p>
                  </div>
                  <button onClick={() => handleDeleteInquiry(selectedInquiry.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg"><Trash2 size={20} /></button>
                </div>
                <div className="flex-1 p-8 overflow-y-auto text-brand-silver whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
                <div className="p-6 border-t border-brand-gray flex flex-col sm:flex-row gap-4">
                   <a href={`mailto:${selectedInquiry.email}`} className="flex-1 bg-brand-gray/30 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-gray/50 transition-all border border-brand-gray"><Reply size={20} /> Reply via Email</a>
                   <button 
                    onClick={() => handleReplyViaChat(selectedInquiry.email)}
                    className="flex-1 bg-brand-orange text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-brand-orange/20"
                   >
                     <MessageSquare size={20} /> Reply via Live Chat
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-brand-silver opacity-40">
                <MessageSquare size={48} className="mb-4" />
                <p>Select an inquiry to read</p>
              </div>
            )
          ) : (
            selectedChatUser ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-brand-gray bg-brand-dark/30">
                  <h3 className="text-xl font-bold text-white">{selectedChatUser.full_name}</h3>
                  <p className="text-xs text-brand-silver tracking-wider uppercase font-medium">Real-time Support Session</p>
                </div>
                <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                  {chatMessages.map(msg => {
                    const isAdmin = msg.sender_role === 'admin';
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isAdmin ? 'bg-brand-orange text-white rounded-br-none' : 'bg-brand-gray text-brand-silver rounded-bl-none'}`}>
                          {msg.content}
                          <span className="block text-[9px] opacity-60 mt-1">{formatDate(msg.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={handleSendChat} className="p-4 border-t border-brand-gray flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type reply..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-brand-dark border border-brand-gray rounded-xl px-4 py-2 text-white outline-none focus:border-brand-orange"
                  />
                  <button disabled={sending || !newMessage} type="submit" className="bg-brand-orange text-white p-3 rounded-xl"><Send size={20} /></button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-brand-silver opacity-40">
                <User size={48} className="mb-4" />
                <p>Select a user to start chatting</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
