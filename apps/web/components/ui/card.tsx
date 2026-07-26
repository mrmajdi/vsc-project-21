import React from 'react';

interface CardProps {
  /** Optional title displayed in the card header */
  title?: string;
  /** Main content of the card */
  children: React.ReactNode;
  /** Additional Tailwind classes */
  className?: string;
  /** Visual variant of the card */
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  variant = 'default',
}) => {
  // Base styles shared across variants
  const baseClasses = 'flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden';

  // Variant-specific styles
  const variantClasses: Record<CardProps['variant'], string> = {
    default: '',
    elevated: 'shadow-lg',
    outlined: 'border-2',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 font-semibold text-lg text-gray-900 dark:text-gray-100">
          {title}
        </div>
      )}
      <div className="px-6 py-4 flex-1 text-gray-700 dark:text-gray-200">
        {children}
      </div>
    </div>
  );
};

export default Card;