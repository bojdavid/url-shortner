import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Clock, ExternalLink, MousePointerClick, Trash2 } from 'lucide-react';
import type { Url } from '@api/urls';
import { CopyButton } from '@components/ui/CopyButton';
import { buildShortUrl, displayShortUrl, formatDate, formatNumber, hostnameOf, isExpired } from '@utils/links';
import { cn } from '@utils/cn';

interface LinkCardProps {
  url: Url;
  onDelete?: (code: string) => void;
  isDeleting?: boolean;
  style?: React.CSSProperties;
}

export const LinkCard: React.FC<LinkCardProps> = ({ url, onDelete, isDeleting, style }) => {
  const shortUrl = buildShortUrl(url.code);
  const expired = isExpired(url);
  const host = hostnameOf(url.originalUrl);

  return (
    <article
      style={style}
      className={cn(
        'animate-fade-up group glass relative min-w-0 max-w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] p-4 transition-all duration-200 sm:p-5',
        'hover:border-[var(--color-primary)]/40 hover:shadow-[0_12px_40px_-20px_rgb(124_108_255/0.5)]',
        isDeleting && 'pointer-events-none opacity-50'
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4 sm:pr-48">
        <img
          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="hidden h-10 w-10 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2 sm:block"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'min-w-0 truncate font-mono text-[15px] font-medium transition-colors',
                expired ? 'text-[var(--color-muted)] line-through' : 'text-[#b3a8ff] hover:text-white'
              )}
            >
              {displayShortUrl(url.code)}
            </a>
            {expired ? (
              <span className="rounded-full border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-error)]">
                Expired
              </span>
            ) : url.expiresAt ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-warning)]">
                <Clock aria-hidden="true" className="h-3 w-3" />
                {formatDate(url.expiresAt)}
              </span>
            ) : null}
          </div>

          <a
            href={url.originalUrl}
            target="_blank"
            rel="noreferrer"
            title={url.originalUrl}
            className="mt-1 flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-gray-200"
          >
            <span className="truncate">{url.originalUrl}</span>
            <ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0" />
          </a>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <MousePointerClick aria-hidden="true" className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              <strong className="font-semibold text-white">{formatNumber(url.clicks)}</strong> clicks
            </span>
            <span>Created {formatDate(url.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-3 sm:absolute sm:right-5 sm:top-5 sm:mt-0 sm:border-0 sm:pt-0">
        <CopyButton id={`copy-${url.code}`} value={shortUrl} label="Copy" className="flex-1 sm:flex-none" />
        <Link
          id={`analytics-${url.code}`}
          to={`/analytics?code=${encodeURIComponent(url.code)}`}
          aria-label={`Analytics for ${url.code}`}
          title="View analytics"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-gray-300 transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-accent)]"
        >
          <BarChart3 aria-hidden="true" className="h-4 w-4" />
        </Link>
        {onDelete && (
          <button
            id={`delete-${url.code}`}
            type="button"
            onClick={() => {
              if (window.confirm(`Delete ${displayShortUrl(url.code)}? This cannot be undone.`)) onDelete(url.code);
            }}
            aria-label={`Delete ${url.code}`}
            title="Delete link"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-gray-300 transition-colors hover:border-[var(--color-error)]/60 hover:text-[var(--color-error)]"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </article>
  );
};

export const LinkCardSkeleton: React.FC = () => (
  <div className="glass rounded-[var(--radius-card)] border border-[var(--color-border)] p-5">
    <div className="flex gap-4">
      <div className="skeleton hidden h-10 w-10 sm:block" />
      <div className="flex-1 space-y-2.5">
        <div className="skeleton h-4 w-48" />
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-3 w-32" />
      </div>
    </div>
  </div>
);
