import React from 'react';
import Link from 'next/link';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange';
  
  const variants = {
    primary: 'text-white bg-gradient-orange hover:opacity-90',
    secondary: 'text-brand-orange bg-transparent border-brand-orange hover:bg-brand-orange/10',
    dark: 'text-white bg-brand-gray hover:bg-brand-gray/80',
    white: 'text-brand-dark bg-white hover:bg-gray-100',
  };

  const componentStyles = `${baseStyles} ${variants[variant]} ${className}`;

  if (props.href) {
    return (
      <Link {...props} className={componentStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={componentStyles} {...props}>
      {children}
    </button>
  );
};

export default Button;
