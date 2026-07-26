import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  /**
   * Content to display inside the badge
   */
  children: React.ReactNode;
  /**
   * Variant of the badge: determines colors and styling
   * 'genre' - for movie/series genres
   * 'status' - for release status (e.g., Ongoing, Completed)
   * 'default' - neutral styling
   */
  variant?: 'genre' | 'status' | 'default';
  /**
   * Optional className for further customization
   */
  className?: string;
}

/**
 * Badge component used for displaying genres and statuses.
 * Responsive and SSR-friendly (no window dependencies).
 */
const Badge = ({
  children,
  variant = 'default',
  className,
}: BadgeProps) => {
  // Base styles
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors';

  // Variant-specific styles
  const variantClasses = {
    genre: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    status: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  }[variant];

  return (
    <span className={cn(baseClasses, variantClasses, className)}>
      {children}
    </span>
  );
};

export default Badge;