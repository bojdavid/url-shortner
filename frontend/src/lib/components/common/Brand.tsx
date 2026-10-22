import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';

export const Logo: React.FC<{ className?: string; to?: string }> = ({ className, to = '/' }) => (
  <Link to={to} className={cn('inline-flex items-center gap-2.5', className)} aria-label="Snip home">
    <span className="bg-brand box-glow flex h-9 w-9 items-center justify-center rounded-xl">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
      </svg>
    </span>
    <span className="text-xl font-extrabold tracking-tight text-white">Snip</span>
  </Link>
);

export const PageHeader: React.FC<{ title: string; description?: string; actions?: React.ReactNode }> = ({
  title,
  description,
  actions,
}) => (
  <header className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between min-w-0 max-w-full">
    <div className="min-w-0 flex-1">
      <h1 className="heading-xl truncate">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-[var(--color-muted)] sm:text-base">{description}</p>}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </header>
);

export const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  tone?: 'primary' | 'accent' | 'success' | 'warning';
  style?: React.CSSProperties;
}> = ({ label, value, icon: Icon, tone = 'primary', style }) => {
  const tones = {
    primary: 'text-[var(--color-primary)] bg-[var(--color-primary)]/12 border-[var(--color-primary)]/25',
    accent: 'text-[var(--color-accent)] bg-[var(--color-accent)]/10 border-[var(--color-accent)]/25',
    success: 'text-[var(--color-success)] bg-[var(--color-success)]/10 border-[var(--color-success)]/25',
    warning: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10 border-[var(--color-warning)]/25',
  };
  return (
    <div
      style={style}
      className="animate-fade-up glass group relative min-w-0 max-w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] p-3.5 sm:p-5 transition-colors hover:border-[var(--color-border-strong)]"
    >
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
        <p className="truncate text-[11px] sm:text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
        <span className={cn('flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border', tones[tone])}>
          <Icon aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
      </div>
      <p className="mt-2 sm:mt-3 truncate text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
};

export const EmptyState: React.FC<{ icon: React.ElementType; title: string; description: string; action?: React.ReactNode }> = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] px-6 py-14 text-center">
    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
      <Icon aria-hidden="true" className="h-6 w-6" />
    </span>
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-[var(--color-muted)]">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
