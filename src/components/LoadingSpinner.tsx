import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
};