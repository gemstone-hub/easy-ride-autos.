'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Calendar, Navigation, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from './Button';

const CarCard = ({ car, isFavorited: initialFavorited = false }) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);

  // Sync with prop changes (e.g. when favorites are loaded in bulk)
  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save favorites');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorited) {
        const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('car_id', car.id);
        if (error) throw error;
        setIsFavorited(false);
      } else {
        const { error } = await supabase.from('favorites').insert([{ user_id: user.id, car_id: car.id }]);
        if (error) throw error;
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Favorite error:', error);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="bg-brand-gray/20 rounded-2xl overflow-hidden border border-brand-gray transition-all duration-300 hover:border-brand-orange/50 hover:shadow-2xl hover:shadow-brand-orange/10 flex flex-col h-full relative group">
      {/* Image Container - Wraps image in a Link for navigation */}
      <div className="aspect-[16/10] overflow-hidden relative">
        <Link href={`/cars/${car.id}`} className="block h-full w-full">
          <img 
            src={car.image} 
            alt={car.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            car.status === 'Available' ? 'bg-green-500 text-white' : 'bg-brand-orange text-white'
          }`}>
            {car.status}
          </span>
        </div>
        <button 
          onClick={toggleFavorite}
          disabled={favLoading}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all shadow-lg z-20 ${
            isFavorited ? 'bg-brand-orange text-white' : 'bg-brand-dark/40 text-white hover:bg-brand-orange/20'
          }`}
        >
          {favLoading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />}
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link href={`/cars/${car.id}`}>
              <h3 className="text-xl font-bold text-white mb-1 hover:text-brand-orange transition-colors cursor-pointer">{car.title}</h3>
            </Link>
            <p className="text-brand-silver text-sm">{car.subtitle}</p>
          </div>
          <div className="text-lg font-bold text-brand-orange">₦{car.price}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-brand-silver text-xs">
            <Calendar size={14} className="text-brand-orange" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-silver text-xs">
            <Navigation size={14} className="text-brand-orange" />
            <span>{car.mileage}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-silver text-xs">
            <Settings size={14} className="text-brand-orange" />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button href={`/cars/${car.id}`} variant="secondary" className="w-full py-2.5 text-sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
