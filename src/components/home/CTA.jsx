import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-orange rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-dark/20 rounded-full translate-x-1/3 translate-y-1/3 blur-[100px]" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-brand-dark mb-8 leading-tight">
              Ready to Upgrade Your Drive?
            </h2>
            <p className="text-brand-dark/80 text-xl font-medium mb-12">
              Whether you're looking for your next vehicle or need expert restoration services, our team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button href="/cars" className="bg-brand-dark text-white hover:bg-brand-dark/90 px-10 py-5 text-lg shadow-2xl flex items-center gap-2 group">
                Explore Showroom
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="/contact" variant="outline" className="border-brand-dark/20 text-brand-dark hover:bg-brand-dark/5 px-10 py-5 text-lg flex items-center gap-3">
                <MessageCircle size={20} />
                Contact Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
