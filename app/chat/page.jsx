'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { Send, Loader2, User, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../src/components/ui/Button';
import Link from 'next/link';

export default function ChatPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`chat:${user.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chats',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('chats')
        .insert([{
          user_id: user.id,
          sender_role: 'user',
          content: newMessage.trim(),
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark p-4">
        <MessageCircle size={64} className="text-brand-orange mb-6" />
        <h1 className="text-2xl font-bold text-white mb-4">Sign in to Chat</h1>
        <p className="text-brand-silver mb-8 text-center max-w-md">
          Please log in to your account to start a conversation with our support team.
        </p>
        <Link href="/login">
          <Button variant="primary">Log In Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-silver hover:text-brand-orange transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-sm text-brand-silver font-medium">Support Online</span>
        </div>
      </div>

      <div className="bg-brand-gray/20 rounded-3xl border border-brand-gray flex-1 flex flex-col overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="p-6 border-b border-brand-gray bg-brand-dark/50 flex items-center gap-4">
          <div className="bg-brand-orange/10 p-3 rounded-2xl text-brand-orange">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Chat with Support</h2>
            <p className="text-xs text-brand-silver">Typically replies in a few minutes</p>
          </div>
        </div>

        {/* Messages area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-brand-silver opacity-50 text-center p-6">
               <MessageCircle size={48} className="mb-4" />
               <p className="text-lg font-medium">Start a conversation!</p>
               <p className="text-sm">Ask us anything about our cars or services.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isAdmin = msg.sender_role === 'admin';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-lg ${
                      isAdmin 
                        ? 'bg-brand-gray/40 text-white rounded-bl-none border border-brand-gray/50' 
                        : 'bg-brand-orange text-white rounded-br-none shadow-brand-orange/20'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[10px] opacity-60 block mt-2 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-brand-dark/50 border-t border-brand-gray">
          <form onSubmit={handleSendMessage} className="flex gap-3">
             <input 
              type="text" 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              className="flex-1 bg-brand-gray/20 border border-brand-gray rounded-2xl py-3 px-6 text-white outline-none focus:border-brand-orange transition-all placeholder:text-brand-silver/50"
             />
             <Button 
              type="submit" 
              variant="primary" 
              disabled={sending || !newMessage.trim()}
              className="px-6 rounded-2xl flex items-center justify-center gap-2"
             >
                {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
             </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
