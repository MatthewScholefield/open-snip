import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClassMap = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  const spinnerSizeClass = sizeClassMap[size];

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <span className={`loading loading-spinner loading-lg ${spinnerSizeClass}`}></span>
    </div>
  );
};
