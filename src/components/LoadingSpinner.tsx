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

  const spinnerSizeClass = sizeClassMap[size] || 'loading-md'; // Fallback to md if size is invalid

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <span className={`loading loading-spinner ${spinnerSizeClass}`}></span>
    </div>
  );
};
