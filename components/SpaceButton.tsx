
import React from 'react';

interface SpaceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'info' | 'danger' | 'warning';
}

const SpaceButton: React.FC<SpaceButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'text-white border-none py-3 px-5 rounded-md cursor-pointer text-base font-bold transition-all duration-200 ease-in-out shadow-md [text-shadow:_1px_1px_2px_black] hover:-translate-y-1 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-cyan-500 hover:bg-cyan-600',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default SpaceButton;