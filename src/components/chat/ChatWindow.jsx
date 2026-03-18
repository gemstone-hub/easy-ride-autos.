'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Loader2, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function ChatWindow({ user }) {
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
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-brand-silver">
        <Loader2 className="animate-spin mr-2" /> Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border border-brand-gray rounded-2xl overflow-hidden bg-brand-dark/20 shadow-inner">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-brand-silver/50 italic text-sm text-center px-4">
             <MessageCircle size={32} className="mb-2 opacity-20" />
             <p>No messages yet. Send a message to start a conversation with our team.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.sender_role === 'admin';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    isAdmin 
                      ? 'bg-brand-gray/40 text-white rounded-bl-none' 
                      : 'bg-brand-orange text-white rounded-br-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-[9px] opacity-60 block mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-brand-dark/30 border-t border-brand-gray">
        <form onSubmit={handleSendMessage} className="flex gap-2">
           <input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            className="flex-1 bg-brand-gray/20 border border-brand-gray rounded-xl py-2 px-4 text-white outline-none focus:border-brand-orange text-sm"
           />
           <Button 
            type="submit" 
            variant="primary" 
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 rounded-xl"
           >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
           </Button>
        </form>
      </div>
    </div>
  );
}
