'use client';
import React from 'react';

const Input = ({ label, id, error, as = 'input', ...props }) => {
  const Component = as;
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-brand-silver mb-1">
          {label}
        </label>
      )}
      <Component
        id={id}
        className={`w-full px-4 py-3 bg-brand-dark border ${
          error ? 'border-red-500' : 'border-brand-gray'
        } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
