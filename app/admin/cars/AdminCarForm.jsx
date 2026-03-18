'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import Input from '../../../src/components/ui/Input';
import Button from '../../../src/components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminCarForm({ carId, onComplete, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price: '',
    year: '',
    transmission: 'Auto',
    mileage: '',
    status: 'Available',
    description: '',
    features: '',
    image: ''
  });

  useEffect(() => {
    const fetchCar = async () => {
      const { data } = await supabase.from('cars').select('*').eq('id', carId).single();
      if (data) {
        setFormData({
          ...data,
          features: data.features?.join(', ') || ''
        });
      }
    };

    if (carId) {
      fetchCar();
    }
  }, [carId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const carData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };

    try {
      if (carId) {
        const { error: updateError } = await supabase.from('cars').update(carData).eq('id', carId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('cars').insert([carData]);
        if (insertError) throw insertError;
      }

      toast.success(carId ? 'Vehicle updated successfully' : 'Vehicle added successfully');
      onComplete();
    } catch (saveError) {
      toast.error('Error saving car: ' + saveError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-gray/20 p-8 rounded-2xl border border-brand-gray"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-brand-gray rounded-full transition-colors text-brand-silver">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">{carId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Vehicle Title" id="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Toyota Camry SE" />
          <Input label="Subtitle / Specs" id="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="e.g., 2.5L I4 F DOHC 16V" />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Input label="Price (₦)" id="price" value={formData.price} onChange={handleChange} required placeholder="18,500,000" />
          <Input label="Year" id="year" value={formData.year} onChange={handleChange} required placeholder="2020" />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-brand-silver">Transmission</label>
            <select 
              id="transmission" 
              className="bg-brand-dark border border-brand-gray rounded-lg py-2 px-4 text-white focus:border-brand-orange outline-none"
              value={formData.transmission}
              onChange={handleChange}
            >
              <option value="Auto">Auto</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-brand-silver">Status</label>
            <select 
              id="status" 
              className="bg-brand-dark border border-brand-gray rounded-lg py-2 px-4 text-white focus:border-brand-orange outline-none"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Incoming">Incoming</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Mileage" id="mileage" value={formData.mileage} onChange={handleChange} placeholder="e.g., 45K mi" />
          <Input label="Image URL" id="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
        </div>

        <Input 
          as="textarea" 
          label="Description" 
          id="description" 
          value={formData.description} 
          onChange={handleChange} 
          rows={4} 
          placeholder="Brief overview of the vehicle..." 
        />

        <Input 
          label="Features (comma separated)" 
          id="features" 
          value={formData.features} 
          onChange={handleChange} 
          placeholder="Bluetooth, Backup Camera, Leather Seats..." 
        />

        <div className="flex justify-end gap-4 pt-4 border-t border-brand-gray">
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={loading} className="flex items-center gap-2">
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Vehicle'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
