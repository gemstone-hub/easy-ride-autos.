'use client';
import React from 'react';
import { Shield, Target, Users, Gem } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="w-8 h-8 text-brand-orange" />,
      title: "Integrity",
      description: "We provide complete auction and repair history for every vehicle we sell."
    },
    {
      icon: <Target className="w-8 h-8 text-brand-orange" />,
      title: "Quality Focus",
      description: "Our restoration process strictly adheres to manufacturer specifications."
    },
    {
      icon: <Users className="w-8 h-8 text-brand-orange" />,
      title: "Customer First",
      description: "Your peace of mind is our priority, from the first contact to handing over the keys."
    },
    {
      icon: <Gem className="w-8 h-8 text-brand-orange" />,
      title: "Value",
      description: "Premium quality imported vehicles at highly competitive market rates."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Redefining Auto Imports in Nigeria</h1>
          <div className="space-y-4 text-lg text-brand-silver leading-relaxed flex flex-col gap-2">
            <p>
              Easy Ride Autos was founded with a singular mission: to eliminate the ambiguity and hidden risks traditionally associated with importing used vehicles into Nigeria.
            </p>
            <p>
              We source high-potential vehicles directly from US auctions, handle all shipping logistics, and perform professional, meticulous repairs before a vehicle ever reaches the showroom floor.
            </p>
            <p>
              By handling the entire lifecycle—from the auction block to the final polish—we ensure unparalleled quality control and pass significant savings directly to our customers.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border-2 border-brand-gray/50 relative z-10">
            <Image 
              src="/about-us.jpg" 
              alt="Founder of Easy Ride Autos" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className="text-center text-brand-silver mt-4 italic font-medium relative z-10">"My mission is to eliminate the hidden risks of imported used vehicles."</p>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl z-0"></div>
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-brand-silver/10 rounded-full blur-2xl z-0"></div>
        </motion.div>
      </div>

      <div className="mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
          <p className="text-brand-silver">The principles that guide every vehicle we import and repair.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-brand-gray/30 p-8 rounded-2xl border border-brand-gray hover:border-brand-orange/50 transition-colors"
            >
              <div className="bg-brand-dark w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-brand-silver text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
