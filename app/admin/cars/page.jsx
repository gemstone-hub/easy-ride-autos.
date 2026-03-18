'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { Plus, Edit2, Trash2, ExternalLink, Search } from 'lucide-react';
import Button from '../../../src/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AdminCarForm from './AdminCarForm';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCarId, setEditingCarId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car? This cannot be undone.')) return;

    try {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;
      setCars(cars.filter(car => car.id !== id));
      toast.success('Car deleted successfully');
    } catch (error) {
      toast.error('Error deleting car: ' + error.message);
    }
  };

  const handleEdit = (id) => {
    setEditingCarId(id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingCarId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingCarId(null);
  };

  const handleComplete = () => {
    setIsAdding(false);
    setEditingCarId(null);
    fetchCars();
  };

  const filteredCars = cars.filter(car => 
    car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAdding || editingCarId) {
    return (
      <AdminCarForm 
        carId={editingCarId} 
        onComplete={handleComplete} 
        onCancel={handleCancel} 
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-brand-silver">Add, edit, or remove vehicles from your showroom.</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2 py-3"
          onClick={handleAdd}
        >
          <Plus size={20} />
          Add New Car
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-brand-gray/20 p-4 rounded-xl border border-brand-gray">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-silver w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by model, make, or specs..."
            className="w-full bg-brand-dark border-brand-gray rounded-lg py-2 pl-10 pr-4 text-white focus:border-brand-orange outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-brand-gray/20 rounded-2xl border border-brand-gray overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-gray/30 border-b border-brand-gray text-brand-silver text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Vehicle</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Year/Mi</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray/40">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-brand-silver italic">
                      Loading inventory...
                    </td>
                  </tr>
                ) : filteredCars.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-brand-silver italic">
                      No vehicles found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCars.map((car) => (
                    <motion.tr 
                      key={car.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-brand-gray/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-dark">
                          <Image 
                            src={car.image || '/placeholder-car.jpg'} 
                            alt={car.title} 
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                            <div className="text-white font-bold">{car.title}</div>
                            <div className="text-brand-silver text-xs truncate max-w-[200px]">{car.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">₦{car.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          car.status === 'Available' ? 'bg-green-500/10 text-green-500' :
                          car.status === 'Incoming' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-brand-silver text-sm">{car.year}</div>
                        <div className="text-brand-silver text-xs opacity-60">{car.mileage}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/cars/${car.id}`} className="p-2 text-brand-silver hover:text-white hover:bg-brand-gray rounded-lg transition-colors">
                            <ExternalLink size={18} />
                          </Link>
                          <button 
                            onClick={() => handleEdit(car.id)}
                            className="p-2 text-brand-silver hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(car.id)}
                            className="p-2 text-brand-silver hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
