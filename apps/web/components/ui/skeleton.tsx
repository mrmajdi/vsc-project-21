import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  /** Width of the skeleton (e.g., 'full', '1/2', '3/4', or any CSS value) */
  width?: string | number;
  /** Height of the skeleton (e.g., '4', '8', '16', or any CSS value) */
  height?: string | number;
  /** Border radius (e.g., 'none', 'sm', 'md', 'lg', 'full', or any CSS value) */
  radius?: string | number;
  /** Optional custom className */
  className?: string;
  /** Whether the skeleton should animate (default: true) */
  animate?: boolean;
}

/**
 * Skeleton placeholder component.
 * Useful for showing loading state while content is being fetched.
 *
 * Example:
 *   <Skeleton width="full" height={4} radius="md" />
 */
export function Skeleton({
  width = 'full',
  height = 4,
  radius = 'md',
  className,
  animate = true,
}: SkeletonProps) {
  // Convert numeric values to Tailwind spacing (assuming rem)
  const getValue = (val: string | number): string =>
    typeof val === 'number' ? `${val}` : val;

  const wrapperCls = cn(
    'bg-muted',
    animate ? 'animate-pulse' : '',
    'rounded',
    radius === 'none' ? 'rounded-none' : '',
    radius === 'sm' ? 'rounded-sm' : '',
    radius === 'md' ? 'rounded-md' : '',
    radius === 'lg' ? 'rounded-lg' : '',
    radius === 'full' ? 'rounded-full' : '',
    typeof radius === 'string' && !['none', 'sm', 'md', 'lg', 'full'].includes(radius)
      ? `rounded-${radius}`
      : typeof radius === 'number'
      ? `rounded-${radius}`
      : '',
    className
  );

  return (
    <div
      className={wrapperCls}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}