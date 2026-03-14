'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import BeforeAfter from '../../src/components/ui/BeforeAfter';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Button from '../../src/components/ui/Button';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchGallery = async () => {
      setLoading(true);

      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching gallery:', error.message || error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Restoration Gallery</h1>
        <p className="text-xl text-brand-silver">
          See the transformation. We meticulously restore high-potential auction vehicles to pristine showroom condition.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-silver gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
          <p className="font-medium animate-pulse">Loading restoration projects...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {items.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-brand-silver">{project.description}</p>
              </div>
              <BeforeAfter 
                beforeImage={project.before_image} 
                afterImage={project.after_image} 
              />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-20 bg-brand-gray/10 rounded-3xl border border-dashed border-brand-gray">
          <p className="text-brand-silver text-lg">No restoration projects found in the gallery.</p>
        </div>
      )}

      <div className="mt-24 bg-brand-gray/20 rounded-3xl p-12 text-center border border-brand-gray relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-brand-orange/10 transition-colors" />
        <h2 className="text-3xl font-bold text-white mb-6">Have a specific car in mind?</h2>
        <p className="text-brand-silver mb-8 max-w-2xl mx-auto">
          We can source your desired vehicle directly from US auctions and handle the entire restoration process to your specifications.
        </p>
        <Link href="/contact">
          <Button variant="primary" className="px-10 py-4 text-lg">Discuss Your Requirements</Button>
        </Link>
      </div>
    </div>
  );
}
