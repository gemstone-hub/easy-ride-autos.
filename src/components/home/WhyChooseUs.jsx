import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Wrench, Search } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-brand-orange" />,
      title: "Hand-Picked Selection",
      description: "We source only the highest potential vehicles from US auctions with clean titles and verifiable histories."
    },
    {
      icon: <Truck className="w-8 h-8 text-brand-orange" />,
      title: "Seamless Logistics",
      description: "From the auction floor to the Nigerian port, we handle every aspect of the shipping and clearing process."
    },
    {
      icon: <Wrench className="w-8 h-8 text-brand-orange" />,
      title: "Expert Restoration",
      description: "Our team of specialized mechanics restores every vehicle to OEM standards using genuine parts."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-orange" />,
      title: "Total Transparency",
      description: "Every car comes with a full history report, itemized repair list, and a comprehensive condition guarantee."
    }
  ];

  return (
    <section className="py-24 bg-brand-gray/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gray to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gray to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            The <span className="text-brand-orange">Easy Ride</span> Advantage
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-brand-silver text-lg"
          >
            We've revolutionized the auto import process in Nigeria by prioritizing quality, transparency, and customer satisfaction at every step.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-gray/20 p-8 rounded-3xl border border-brand-gray hover:border-brand-orange/40 transition-all group"
            >
              <div className="bg-brand-dark w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-brand-silver leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
