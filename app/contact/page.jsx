'use client';
import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Instagram, 
  Facebook, 
  CheckCircle2,
  Loader2 
} from 'lucide-react';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: `[${formData.subject}]\nPhone: ${formData.phone}\n\n${formData.message}`
        }]);

      if (insertError) throw insertError;
      
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      const errorMessage = err.message || err.details || (typeof err === 'string' ? err : 'Submission failed');
      toast.error(`Error: ${errorMessage}`);
      console.error('Contact error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 md:py-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center bg-brand-gray/20 p-12 rounded-3xl border border-brand-gray"
        >
          <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Message Sent Successfully!</h1>
          <p className="text-brand-silver text-lg mb-8">
            Thank you for reaching out to Easy Ride Autos. One of our representatives will contact you shortly regarding your {formData.subject.toLowerCase()}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={() => setSubmitted(false)}>Send Another Message</Button>
            <Button href="/" variant="secondary">Back to Home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-brand-silver mb-12">
            Have questions about a vehicle or our restoration process? Reach out to us today.
          </p>

          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-6 group">
              <div className="bg-brand-gray/30 p-4 rounded-xl border border-brand-gray group-hover:bg-brand-orange/20 transition-colors">
                <Phone className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                <p className="text-brand-silver">+234 915 077 6062</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="bg-brand-gray/30 p-4 rounded-xl border border-brand-gray group-hover:bg-brand-orange/20 transition-colors">
                <Mail className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                <p className="text-brand-silver">sales@easyrideautos.com</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="bg-brand-gray/30 p-4 rounded-xl border border-brand-gray group-hover:bg-brand-orange/20 transition-colors">
                <MapPin className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Visit Our Showroom</h3>
                <p className="text-brand-silver">Victoria Island, Lagos, Nigeria</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-brand-gray/30 p-4 rounded-full border border-brand-gray text-brand-silver hover:text-brand-orange hover:border-brand-orange transition-all">
                <Instagram size={24} />
              </a>
              <a href="#" className="bg-brand-gray/30 p-4 rounded-full border border-brand-gray text-brand-silver hover:text-brand-orange hover:border-brand-orange transition-all">
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-gray/30 p-8 md:p-12 rounded-3xl border border-brand-gray"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="John Doe" 
              />
              <Input 
                label="Email" 
                type="email" 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com" 
              />
              <Input 
                label="Phone Number" 
                id="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 08123456789" 
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-brand-silver">Subject</label>
                <select 
                  id="subject"
                  className="bg-brand-dark border border-brand-gray rounded-xl py-3 px-4 text-white focus:border-brand-orange outline-none transition-all"
                  value={formData.subject}
                  onChange={handleChange}
                >
                    <option>General Inquiry</option>
                    <option>Vehicle Inquiry</option>
                    <option>Restoration Quote</option>
                    <option>Finance Options</option>
                  </select>
              </div>
            </div>

            <Input 
              as="textarea" 
              label="How can we help?" 
              id="message" 
              rows={4} 
              value={formData.message} 
              onChange={handleChange} 
              required 
              placeholder="Tell us what you're looking for..." 
            />

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-orange/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
