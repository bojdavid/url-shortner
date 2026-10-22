import React from 'react';
import { cn } from '@utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-sm text-white placeholder:text-gray-500',
            'focus:outline-none focus:border-[var(--color-primary)] focus:box-glow transition-all',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_12px_rgba(239,68,68,0.3)]',
            className
          )}
          {...props}
        />
        {error && <span className="text-[var(--color-error)] text-xs">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
