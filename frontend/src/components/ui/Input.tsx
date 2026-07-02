import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, trailing, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-label-sm font-semibold text-[#213145]"
          >
            {label}
          </label>
        )}
        <div
          className={clsx(
            'relative flex items-center bg-white border rounded transition-all duration-150 input-glow',
            error ? 'border-error' : 'border-[#64748B] focus-within:border-indigo-500',
          )}
        >
          {icon && (
            <span className="absolute left-3 text-[#64748B] flex items-center pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full py-2.5 bg-transparent border-none focus:ring-0 text-[#213145] placeholder-[#908fa0] text-body-base outline-none',
              icon ? 'pl-10' : 'pl-4',
              trailing ? 'pr-12' : 'pr-4',
              className
            )}
            {...props}
          />
          {trailing && (
            <span className="absolute right-3 flex items-center">{trailing}</span>
          )}
        </div>
        {error && (
          <p className="text-label-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
