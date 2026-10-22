import React from 'react';
import { cn } from '@utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: React.ReactNode;
  /** Icon or text rendered inside the field on the left (e.g. a domain prefix). */
  leading?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, hint, leading, containerClassName, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className={cn('flex w-full min-w-0 max-w-full flex-col gap-1.5', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-200 truncate">
            {label}
          </label>
        )}
        <div
          className={cn(
            'group flex h-11 w-full min-w-0 max-w-full items-center overflow-hidden rounded-[var(--radius-control)] border bg-[var(--color-surface-1)] transition-all',
            'border-[var(--color-border-strong)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_4px_rgb(124_108_255/0.15)]',
            error && 'border-[var(--color-error)] focus-within:border-[var(--color-error)] focus-within:shadow-[0_0_0_4px_rgb(248_113_113/0.15)]'
          )}
        >
          {leading && (
            <span className="flex h-full shrink-0 items-center gap-1.5 sm:gap-2 border-r border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 sm:px-3 text-xs sm:text-sm text-[var(--color-muted)] max-w-[50%] overflow-hidden">
              {leading}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              'h-full w-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-gray-500 outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <span id={`${inputId}-error`} className="text-xs text-[var(--color-error)]">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-xs text-[var(--color-muted)]">
            {hint}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
