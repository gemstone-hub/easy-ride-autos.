'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { Plus, Edit2, Trash2, ArrowLeftRight } from 'lucide-react';
import Button from '../../../src/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restoration project?')) return;

    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      alert('Error deleting gallery item: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gallery Management</h1>
          <p className="text-brand-silver">Manage before & after restoration projects.</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2 py-3"
          onClick={() => alert('Gallery Form will be implemented in next phase')}
        >
          <Plus size={20} />
          Add Project
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
             <div className="col-span-full py-20 text-center text-brand-silver italic">Loading projects...</div>
          ) : items.length === 0 ? (
             <div className="col-span-full py-20 text-center text-brand-silver italic">No projects found. Add your first one above!</div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-brand-gray/30 rounded-2xl border border-brand-gray overflow-hidden group"
              >
                <div className="relative aspect-video bg-brand-dark">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full flex">
                        <img src={item.before_image} alt="Before" className="w-1/2 h-full object-cover border-r border-brand-orange/50" />
                        <img src={item.after_image} alt="After" className="w-1/2 h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-brand-orange p-1 rounded-full text-white shadow-xl shadow-brand-orange/40">
                                <ArrowLeftRight size={16} />
                            </div>
                        </div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-brand-dark/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-brand-silver">Before</div>
                  <div className="absolute top-2 right-2 bg-brand-orange/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white">After</div>
                </div>

                <div className="p-6">
                  <h3 className="text-white font-bold mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-brand-silver text-xs line-clamp-2 mb-6 h-8">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-brand-gray/50">
                    <div className="flex gap-2">
                        <button className="p-2 text-brand-silver hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors">
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-brand-silver hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <span className="text-[10px] text-brand-silver opacity-40">ID: {item.id.slice(0, 8)}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
