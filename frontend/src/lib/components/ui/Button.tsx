import React from 'react';
import { cn } from '@utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] font-medium',
          'transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            'bg-brand text-white box-glow hover:brightness-110 hover:-translate-y-px': variant === 'primary',
            'border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-white hover:bg-[var(--color-surface-3)] hover:border-[var(--color-primary)]/50':
              variant === 'secondary',
            'bg-transparent text-[var(--color-muted)] hover:text-white hover:bg-[var(--color-surface-2)]': variant === 'ghost',
            'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10':
              variant === 'danger',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <span
            aria-hidden="true"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
