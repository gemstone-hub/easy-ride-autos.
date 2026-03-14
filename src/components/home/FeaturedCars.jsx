import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import CarCard from '../ui/CarCard';
import Button from '../ui/Button';
import Link from 'next/link';

const FeaturedCars = ({ cars = [], favoriteIds = new Set() }) => {
  return (
    <section className="py-24 bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-brand-orange font-bold tracking-widest uppercase text-sm mb-4">
              <Star size={16} fill="currentColor" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured <span className="text-brand-orange">Arrivals</span></h2>
            <p className="text-brand-silver text-lg max-w-2xl">
              Explore our hand-picked selection of premium vehicles, each having undergone our rigorous multi-point inspection and restoration process.
            </p>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <Button href="/cars" variant="secondary" className="flex items-center gap-2 group">
              View All Inventory
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.length > 0 ? (
            cars.slice(0, 6).map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CarCard car={car} isFavorited={favoriteIds.has(car.id)} />
              </motion.div>
            ))
          ) : (
             <div className="col-span-full text-center py-20 bg-brand-gray/10 rounded-3xl border border-dashed border-brand-gray">
                <p className="text-brand-silver">No featured vehicles available at the moment.</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
