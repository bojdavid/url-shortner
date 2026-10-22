import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@utils/cn';
import { copyText } from '@utils/links';

interface CopyButtonProps {
  value: string;
  /** Show a text label next to the icon. */
  label?: string;
  variant?: 'solid' | 'subtle';
  className?: string;
  id?: string;
  /** Optional custom toast message or false to suppress toast */
  toastMessage?: string | false;
}

/** Copies `value` to the clipboard, displays a toast notification, and shows visual feedback. */
export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label,
  variant = 'subtle',
  className,
  id,
  toastMessage = 'Link copied to clipboard!',
}) => {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    const ok = await copyText(value);
    if (ok) {
      setState('copied');
      if (toastMessage) {
        toast.success(toastMessage, { autoClose: 2000 });
      }
    } else {
      setState('error');
      toast.error('Failed to copy to clipboard');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 1800);
  };

  const copied = state === 'copied';
  const text = copied ? 'Copied!' : state === 'error' ? 'Failed' : label;

  return (
    <button
      id={id}
      type="button"
      onClick={handleCopy}
      aria-label={label ? undefined : copied ? 'Copied' : `Copy ${value}`}
      title={copied ? 'Copied!' : 'Copy link'}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-control)] text-sm font-medium transition-all duration-200 active:scale-95',
        variant === 'solid'
          ? cn('h-10 px-4 text-white', copied ? 'bg-[var(--color-success)]/90' : 'bg-brand box-glow hover:brightness-110')
          : cn(
              'h-9 border',
              text ? 'px-3' : 'w-9',
              copied
                ? 'border-[var(--color-success)]/40 bg-[var(--color-success)]/10 text-[var(--color-success)]'
                : 'border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-gray-300 hover:border-[var(--color-primary)]/60 hover:text-white'
            ),
        className
      )}
    >
      {copied ? (
        <Check aria-hidden="true" className="h-4 w-4 animate-pop" />
      ) : (
        <Copy aria-hidden="true" className="h-4 w-4" />
      )}
      {text && <span>{text}</span>}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </button>
  );
};
