'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/contexts/AuthContext';
import CarCard from '../../src/components/ui/CarCard';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setCars(data || []);

        if (user) {
          const { data: favs } = await supabase
            .from('favorites')
            .select('car_id')
            .eq('user_id', user.id);
          
          if (favs) {
            setFavoriteIds(new Set(favs.map(f => f.car_id)));
          }
        }
      } catch (error) {
        console.error('Error fetching cars:', error.message || error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchCars();
  }, [user]);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || car.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Our Inventory</h1>
          <p className="text-brand-silver">Premium imported vehicles, fully inspected and ready for the road.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-silver w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search model, make..." 
              className="w-full bg-brand-gray/30 border border-brand-gray rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-orange outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-brand-gray/30 p-1 rounded-xl border border-brand-gray">
            {['All', 'Available', 'Incoming'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeFilter === filter 
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                    : 'text-brand-silver hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-brand-silver gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
          <p className="font-medium animate-pulse">Loading the showroom...</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CarCard car={car} isFavorited={favoriteIds.has(car.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!loading && filteredCars.length === 0 && (
            <div className="text-center py-20 bg-brand-gray/10 rounded-3xl border border-dashed border-brand-gray">
              <p className="text-brand-silver text-lg">No vehicles found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveFilter('All');}}
                className="text-brand-orange font-bold mt-4 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
