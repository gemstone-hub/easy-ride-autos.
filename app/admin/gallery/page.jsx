'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { Plus, Edit2, Trash2, ArrowLeftRight, X, Loader2 } from 'lucide-react';
import Button from '../../../src/components/ui/Button';
import Input from '../../../src/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    before_image: '',
    after_image: ''
  });

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
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Error deleting gallery item: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .insert([formData])
        .select();

      if (error) throw error;
      
      setItems([data[0], ...items]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', before_image: '', after_image: '' });
      toast.success('Project added successfully');
    } catch (error) {
      toast.error('Failed to add project: ' + error.message);
    } finally {
      setIsSubmitting(false);
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
          onClick={() => setIsModalOpen(true)}
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
                        <div className="relative w-1/2 h-full border-r border-brand-orange/50">
                          <Image src={item.before_image || '/placeholder-car.jpg'} alt="Before" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                        </div>
                        <div className="relative w-1/2 h-full">
                          <Image src={item.after_image || '/placeholder-car.jpg'} alt="After" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                        </div>
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

      {/* Add Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-dark border border-brand-gray rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-brand-gray sticky top-0 bg-brand-dark/95 backdrop-blur-sm z-10">
                <h2 className="text-xl font-bold text-white">Add Restoration Project</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-brand-silver hover:text-white hover:bg-brand-gray rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input 
                    label="Project Title" 
                    id="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. 1969 Mustang Mach 1 Restoration"
                  />
                  
                  <Input 
                    label="Description" 
                    id="description" 
                    as="textarea"
                    rows={3}
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Brief details about the restoration work done..."
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input 
                      label="Before Image URL" 
                      id="before_image" 
                      value={formData.before_image} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="https://example.com/before.jpg"
                    />
                    <Input 
                      label="After Image URL" 
                      id="after_image" 
                      value={formData.after_image} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="https://example.com/after.jpg"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-brand-gray">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsModalOpen(false)}
                      className="border-brand-gray text-brand-silver hover:bg-brand-gray hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={isSubmitting}
                      className="flex items-center gap-2 min-w-[140px] justify-center"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Project'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
