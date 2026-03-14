'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';
import CarCard from '../../src/components/ui/CarCard';
import { Heart, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../src/components/ui/Button';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      setLoading(true);

      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            car_id,
            cars (*)
          `)
          .eq('user_id', user.id);
        
        if (error) throw error;
        setFavorites(data.map(fav => fav.cars).filter(car => car !== null));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <div className="bg-brand-orange/10 p-3 rounded-2xl text-brand-orange">
                <Heart size={32} fill="currentColor" />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-white">My Favorites</h1>
                <p className="text-brand-silver">Vehicles you are currently tracking.</p>
            </div>
        </div>

        <AnimatePresence mode="popLayout">
          {favorites.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-brand-gray/10 rounded-3xl border border-dashed border-brand-gray"
            >
              <Heart size={48} className="mx-auto text-brand-gray mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
              <p className="text-brand-silver mb-8 max-w-md mx-auto">
                Save vehicles you like to your favorites list and track their availability and price changes.
              </p>
              <Link href="/cars">
                <Button variant="primary" className="flex items-center gap-2 mx-auto">
                   Browse Inventory
                   <ArrowRight size={18} />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((car, index) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
