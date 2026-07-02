import { useState } from 'react';
import { Copy, BarChart2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { urlsApi } from '@lib/api/urls';
import { useToast } from '@components/ui/Toast';
import type { Url } from '@app-types/index';

interface LinkRowProps {
  url: Url;
  onViewStats: (url: Url) => void;
  onDeleteRequest: (url: Url) => void;
}

export function LinkRow({ url, onViewStats, onDeleteRequest }: LinkRowProps) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${window.location.origin}/${url.code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  const expiryLabel = url.expiresAt
    ? new Date(url.expiresAt) < new Date()
      ? 'Expired'
      : new Date(url.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Never';

  const isExpired = url.expiresAt ? new Date(url.expiresAt) < new Date() : false;

  return (
    <tr className="hover:bg-surface-container/50 transition-colors group border-b border-outline-variant/10 last:border-0">
      {/* Short code */}
      <td className="px-gutter py-4">
        <div className="flex items-center gap-2">
          <span className="text-primary font-mono font-medium text-label-sm">
            {url.code}
          </span>
          <button
            onClick={handleCopy}
            title="Copy short URL"
            className="opacity-0 group-hover:opacity-100 transition-all text-outline hover:text-primary"
            aria-label="Copy short URL"
          >
            {copied
              ? <CheckCircle size={15} className="text-tertiary" />
              : <Copy size={15} />
            }
          </button>
        </div>
      </td>

      {/* Original URL */}
      <td className="px-gutter py-4 max-w-[280px] hidden sm:table-cell">
        <p className="truncate text-on-surface-variant text-label-sm" title={url.originalUrl}>
          {url.originalUrl}
        </p>
      </td>

      {/* Clicks */}
      <td className="px-gutter py-4 text-right">
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold tabular-nums">
          {url.clicks.toLocaleString()}
        </span>
      </td>

      {/* Expires */}
      <td className="px-gutter py-4 hidden md:table-cell">
        <span
          className={`text-label-sm flex items-center gap-1 ${
            isExpired ? 'text-error' : url.expiresAt ? 'text-on-surface-variant' : 'text-tertiary'
          }`}
        >
          {url.expiresAt ? <Clock size={13} /> : <CheckCircle size={13} />}
          {expiryLabel}
        </span>
      </td>

      {/* Actions */}
      <td className="px-gutter py-4 text-right">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onViewStats(url)}
            title="View analytics"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-container"
            aria-label={`View analytics for ${url.code}`}
          >
            <BarChart2 size={16} />
          </button>
          <button
            onClick={() => onDeleteRequest(url)}
            title="Delete link"
            className="p-2 text-on-surface-variant hover:text-error transition-colors rounded hover:bg-surface-container"
            aria-label={`Delete ${url.code}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Skeleton row ────────────────────────────────────────────────────────────
export function LinkRowSkeleton() {
  return (
    <tr className="border-b border-outline-variant/10">
      <td className="px-gutter py-4"><div className="h-4 w-24 skeleton rounded" /></td>
      <td className="px-gutter py-4 hidden sm:table-cell"><div className="h-4 w-56 skeleton rounded" /></td>
      <td className="px-gutter py-4 text-right"><div className="h-5 w-12 skeleton rounded-full ml-auto" /></td>
      <td className="px-gutter py-4 hidden md:table-cell"><div className="h-4 w-16 skeleton rounded" /></td>
      <td className="px-gutter py-4 text-right"><div className="h-7 w-16 skeleton rounded ml-auto" /></td>
    </tr>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────
interface DeleteModalProps {
  url: Url | null;
  onClose: () => void;
}

export function DeleteModal({ url, onClose }: DeleteModalProps) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => urlsApi.remove(url!.code),
    onSuccess: () => {
      toast('Link deleted', 'success');
      qc.invalidateQueries({ queryKey: ['urls'] });
      onClose();
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md bg-surface-container rounded-md border border-outline-variant shadow-xl animate-fade-in">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center">
              <Trash2 size={18} className="text-error" />
            </div>
            <h2 className="text-heading-md font-semibold text-on-surface">Delete Link</h2>
          </div>
          <p className="text-body-base text-on-surface-variant">
            Are you sure you want to delete{' '}
            <span className="text-primary font-mono font-medium">{url.code}</span>?
            This action is permanent and all analytics data will be lost.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors text-label-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => mutate()}
              disabled={isPending}
              className="flex-1 py-2.5 rounded bg-error/20 text-error hover:bg-error/30 transition-colors text-label-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
