/**
 * Frontend-specific type re-exports and UI prop types.
 *
 * This file consolidates types used across the frontend application,
 * re-exports shared domain types, and defines UI-specific TypeScript
 * interfaces for props, state, and layout contracts.
 */

 // Re-export shared types (adjust path as needed)
 export * from '../../shared/types';

 // Frontend UI prop types
 export interface PageProps {
   /** Optional page title for SEO and browser tab */
   title?: string;
   /** Optional meta description */
   description?: string;
   /** Optional array of keywords */
   keywords?: string[];
   /** Optional open graph image */
   ogImage?: string;
   /** Optional flag to hide header */
   hideHeader?: boolean;
   /** Optional flag to hide footer */
   hideFooter?: boolean;
   /** Custom CSS class names */
   className?: string;
   /** Inline styles */
   style?: React.CSSProperties;
 }

 export interface LayoutProps {
   /** Children elements */
   children: React.ReactNode;
   /** Optional sidebar visibility */
   showSidebar?: boolean;
   /** Optional sidebar width (CSS value) */
   sidebarWidth?: string;
   /** Optional header variant */
   headerVariant?: 'default' | 'transparent' | 'solid';
   /** Optional footer variant */
   footerVariant?: 'default' | 'minimal';
 }

 export interface SeamlessScrollProps {
   /** Duration of scroll animation in ms */
   duration?: number;
   /** Easing function */
   easing?: (t: number) => number;
   /** Offset from top in pixels */
   offset?: number;
 }

 export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   /** Variant of the button */
   variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
   /** Size of the button */
   size?: 'sm' | 'md' | 'lg';
   /** Whether the button is loading */
   isLoading?: boolean;
   /** Icon to display (optional) */
   icon?: React.ReactNode;
   /** Whether to show icon only */
   iconOnly?: boolean;
 }

 export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   /** Label text */
   label?: string;
   /** Helper text */
   helperText?: string;
   /** Error message */
   error?: string;
   /** Whether input is disabled */
   disabled?: boolean;
   /** Whether input is readOnly */
   readOnly?: boolean;
   /** Input size */
   size?: 'sm' | 'md' | 'lg';
   /** Variant */
   variant?: 'filled' | 'outlined' | 'underlined';
   /** Prefix icon */
   prefixIcon?: React.ReactNode;
   /** Suffix icon */
   suffixIcon?: React.ReactNode;
 }

 export interface CardProps {
   /** Card title */
   title?: string;
   /** Card subtitle */
   subtitle?: string;
   /** Card content */
   children: React.ReactNode;
   /** Footer content */
   footer?: React.ReactNode;
   /** Image URL (optional) */
   image?: string;
   /** Image alt text */
   imageAlt?: string;
   /** Whether card is clickable */
   clickable?: boolean;
   /** Elevation/shadow level */
   elevation?: 0 | 1 | 2 | 3 | 4;
   /** Variant */
   variant?: 'default' | 'outlined' | 'raised';
   /** Custom className */
   className?: string;
   /** Inline style */
   style?: React.CSSProperties;
 }

 // Re-export Next.js specific types for convenience
 export type { NextPage } from 'next';
 export type { AppProps } from 'next/app';
 export type { ComponentType } from 'react';