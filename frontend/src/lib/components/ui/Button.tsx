import React from 'react';
import { cn } from '@utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-[8px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-[var(--color-primary)] text-white hover:bg-opacity-90 box-glow': variant === 'primary',
            'bg-transparent border border-[var(--color-border)] text-white hover:bg-[var(--color-surface-2)]': variant === 'secondary',
            'bg-transparent text-white hover:bg-[var(--color-surface-2)]': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
