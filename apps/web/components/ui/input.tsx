import React, { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional additional className
   */
  className?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether the input is readOnly
   */
  readOnly?: boolean;
  /**
   * Show clear button when input has value (only for text-like inputs)
   */
  clearable?: boolean;
}

/**
 * A styled, accessible input component.
 * Supports all standard input props, ref forwarding, and optional clearable behavior.
 */
const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, disabled, readOnly, clearable = false, ...props }, ref) => {
  const handleClear = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    if (props.onChange) {
      props.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
    // Focus input after clearing
    ref.current?.focus();
  };

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        className={cn(
          'block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          disabled && 'cursor-not-allowed opacity-50',
          readOnly && 'bg-muted',
          className
        )}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
      {clearable && props.value && (
        <span
          onClick={handleClear}
          className={cn(
            'absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none',
            'hover:pointer-events-all'
          )}
          aria-label="Clear input"
        >
          {/* Simple X icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-muted-foreground hover:text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;