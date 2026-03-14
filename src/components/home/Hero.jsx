import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Hero = ({ cars = [] }) => {
  return (
    <div className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-brand-dark">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-brand-orange/10 to-transparent opacity-50 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-silver/5 rounded-full blur-[60px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold tracking-widest uppercase mb-6"
            >
              Premium Auto Imports
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Drive Your <span className="text-brand-orange">Dream</span> Car Today
            </h1>
            <p className="text-xl text-brand-silver mb-10 max-w-xl leading-relaxed">
              We import the finest US-spec vehicles, restore them to peak condition, and deliver unmatched value to the Nigerian market.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button href="/cars" variant="primary" className="px-8 py-4 text-lg group">
                Browse Inventory
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="/about" variant="secondary" className="px-8 py-4 text-lg">
                Our Process
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-brand-gray/50 shadow-2xl">
              <img 
                src={cars[0]?.image || "/images/hero-suv.png"} 
                alt="Premium Vehicle" 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xl">{cars[0]?.title || "BMW 5 Series"}</h3>
                    <p className="text-brand-silver text-sm">{cars[0]?.year || "2020"} • {cars[0]?.mileage || "24k Miles"}</p>
                  </div>
                  <div className="text-brand-orange font-bold text-lg">
                    ₦{cars[0]?.price || "28,500,000"}
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/20 rounded-full blur-[40px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-silver/10 rounded-full blur-[60px] -z-10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
