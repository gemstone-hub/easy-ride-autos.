'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '../../../src/lib/supabase';
import { 
  ArrowLeft, 
  Calendar, 
  Settings, 
  BarChart3, 
  CheckCircle2, 
  MessageCircle, 
  CalendarCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../../src/components/ui/Button';

export default function CarDetailsPage({ params }) {
  const { id } = use(params);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCar = async () => {
      setLoading(true);

      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setCar(data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${car.title} (${car.year}) listed for ₦${car.price}.`);
    window.open(`https://wa.me/2349150776062?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Vehicle not found</h2>
        <Link href="/cars">
          <Button variant="primary">Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Link href="/cars" className="inline-flex items-center gap-2 text-brand-silver hover:text-brand-orange transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Inventory
      </Link>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Images/Main Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8"
        >
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-brand-gray mb-8 relative group">
            <img src={car.image} alt={car.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${
                car.status === 'Available' ? 'bg-green-500/90 text-white' : 'bg-brand-orange/90 text-white'
              }`}>
                {car.status}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-brand-gray pb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{car.title}</h1>
              <p className="text-brand-silver text-xl">{car.subtitle}</p>
            </div>
            <div className="text-3xl font-bold text-brand-orange">₦{car.price}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-brand-gray/30 p-4 rounded-xl border border-brand-gray text-center">
              <Calendar className="w-6 h-6 text-brand-orange mx-auto mb-2" />
              <div className="text-xs text-brand-silver mb-1">Year</div>
              <div className="text-white font-bold">{car.year}</div>
            </div>
            <div className="bg-brand-gray/30 p-4 rounded-xl border border-brand-gray text-center">
              <BarChart3 className="w-6 h-6 text-brand-orange mx-auto mb-2" />
              <div className="text-xs text-brand-silver mb-1">Mileage</div>
              <div className="text-white font-bold">{car.mileage}</div>
            </div>
            <div className="bg-brand-gray/30 p-4 rounded-xl border border-brand-gray text-center">
              <Settings className="w-6 h-6 text-brand-orange mx-auto mb-2" />
              <div className="text-xs text-brand-silver mb-1">Transmission</div>
              <div className="text-white font-bold">{car.transmission}</div>
            </div>
            <div className="bg-brand-gray/30 p-4 rounded-xl border border-brand-gray text-center">
              <CheckCircle2 className="w-6 h-6 text-brand-orange mx-auto mb-2" />
              <div className="text-xs text-brand-silver mb-1">Status</div>
              <div className="text-white font-bold">{car.status}</div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-12 text-brand-silver leading-relaxed text-lg">
            <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-brand-orange pl-4">Description</h3>
            <p>{car.description}</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-brand-orange pl-4">Key Features</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {car.features?.map((feature) => (
                <div key={feature} className="flex items-center gap-3 bg-brand-gray/20 p-4 rounded-lg text-brand-silver transition-colors hover:bg-brand-gray/40">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-gray/30 rounded-xl p-6 border border-brand-gray flex items-start gap-4 mt-12">
            <AlertCircle className="w-6 h-6 text-brand-orange flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white mb-1">Vehicle Transparency</h4>
              <p className="text-sm text-brand-silver">
                We provide full auction history, repair documentation, and pre-purchase inspection details upon request.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="bg-brand-gray/30 p-8 rounded-2xl border border-brand-gray sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Interested?</h3>
            <div className="space-y-4">
              <Button 
                variant="primary" 
                className="w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-orange/20"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="w-6 h-6" />
                WhatsApp Chat
              </Button>
              <Link href="/contact" className="block">
                <Button variant="secondary" className="w-full py-4 text-lg flex items-center justify-center gap-3">
                  <CalendarCheck className="w-6 h-6 text-brand-orange" />
                  Schedule Visit
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-brand-gray">
              <div className="text-sm text-brand-silver mb-4">Showroom Location</div>
              <p className="text-white font-medium">Lagos Island, Nigeria</p>
              <p className="text-brand-silver text-sm">Mon-Sat: 9am - 6pm</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
