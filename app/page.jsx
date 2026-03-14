'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Hero from '../src/components/home/Hero';
import FeaturedCars from '../src/components/home/FeaturedCars';
import WhyChooseUs from '../src/components/home/WhyChooseUs';
import CTA from '../src/components/home/CTA';

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .limit(6)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setFeaturedCars(data || []);

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
        console.error('Error fetching featured cars:', error.message || error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [user]);

  return (
    <div className="overflow-hidden">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark">
          <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
        </div>
      ) : (
        <>
          <Hero cars={featuredCars.slice(0, 3)} />
          <FeaturedCars cars={featuredCars} favoriteIds={favoriteIds} />
          <WhyChooseUs />
          <CTA />
        </>
      )}
    </div>
  );
}
