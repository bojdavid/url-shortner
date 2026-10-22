import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { ArrowRight, CalendarClock, ExternalLink, Link2, Sparkles, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { urlsApi, type Url } from '@api/urls';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { CopyButton } from '@components/ui/CopyButton';
import { buildShortUrl, displayShortUrl, getErrorMessage, getShortBase } from '@utils/links';
import { cn } from '@utils/cn';

const ALIAS_PATTERN = /^[A-Za-z0-9_-]{3,32}$/;

const EXPIRY_OPTIONS: { label: string; days?: number }[] = [
  { label: 'Never' },
  { label: '1 day', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

interface CreateLinkFormProps {
  /** Compact variant hides the description text (used on the dashboard). */
  compact?: boolean;
}

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ compact }) => {
  const queryClient = useQueryClient();
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<number | undefined>(undefined);
  const [aliasError, setAliasError] = useState<string>();
  const [created, setCreated] = useState<Url | null>(null);

  // Fetch current user's URLs to check if the URL already exists before creating
  const { data: existingUrls = [] } = useQuery({
    queryKey: ['urls'],
    queryFn: urlsApi.findAll,
  });

  const mutation = useMutation({
    mutationFn: urlsApi.create,
    onSuccess: (url) => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      setCreated(url);
      setOriginalUrl('');
      setAlias('');
      setExpiresInDays(undefined);
      toast.success('Short link generated successfully!');
    },
    onError: (err) => {
      const msg = getErrorMessage(err, 'Could not shorten that link');
      if (isAxiosError(err) && err.response?.status === 409) {
        setAliasError(msg);
        toast.warning(msg, { autoClose: 5000 });
      } else {
        toast.error(msg);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawUrl = originalUrl.trim();
    if (!rawUrl) return;

    // Normalize URL to match backend storage
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

    // Check if the URL already exists in the user's active links
    const duplicate = existingUrls.find((u) => {
      const uNorm = u.originalUrl.replace(/\/+$/, '').toLowerCase();
      const inNorm = normalized.replace(/\/+$/, '').toLowerCase();
      const isNotExpired = !u.expiresAt || new Date(u.expiresAt).getTime() >= Date.now();
      return uNorm === inNorm && isNotExpired;
    });

    if (duplicate) {
      toast.warning(`This URL already exists as: ${displayShortUrl(duplicate.code)}`, {
        autoClose: 5000,
      });
      return;
    }

    const trimmedAlias = alias.trim();
    if (trimmedAlias && !ALIAS_PATTERN.test(trimmedAlias)) {
      setAliasError('Use 3–32 letters, numbers, "-" or "_"');
      return;
    }
    setAliasError(undefined);

    mutation.mutate({
      originalUrl: rawUrl,
      ...(trimmedAlias ? { customCode: trimmedAlias } : {}),
      ...(expiresInDays ? { expiresInDays } : {}),
    });
  };

  const generalError =
    mutation.isError && !(isAxiosError(mutation.error) && mutation.error.response?.status === 409)
      ? getErrorMessage(mutation.error, 'Could not shorten that link')
      : undefined;

  const shortBaseLabel = getShortBase().replace(/^https?:\/\//, '');

  return (
    <div className="space-y-5 min-w-0 max-w-full">
      <form onSubmit={handleSubmit} className="space-y-4 min-w-0 max-w-full" noValidate>
        <Input
          id="create-original-url"
          label="Destination URL"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com/a/really/long/link"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          leading={<Link2 aria-hidden="true" className="h-4 w-4 shrink-0" />}
          required
        />

        <div
          className={cn(
            'grid gap-4 min-w-0',
            compact
              ? 'grid-cols-1'
              : 'grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'
          )}
        >
          <Input
            id="create-custom-alias"
            label="Custom alias (optional)"
            placeholder="my-brand"
            value={alias}
            maxLength={32}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => {
              setAlias(e.target.value.replace(/\s/g, ''));
              if (aliasError) setAliasError(undefined);
            }}
            leading={<span className="truncate font-mono text-xs">{shortBaseLabel}</span>}
            error={aliasError}
            hint={compact ? undefined : 'Leave blank to generate a random 6-character code.'}
          />

          <fieldset className="flex flex-col gap-1.5 min-w-0">
            <legend className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-200">
              <CalendarClock aria-hidden="true" className="h-4 w-4 text-[var(--color-muted)] shrink-0" />
              Expires
            </legend>
            <div className="flex flex-wrap gap-1.5 min-w-0" role="radiogroup" aria-label="Link expiry">
              {EXPIRY_OPTIONS.map((opt) => {
                const active = expiresInDays === opt.days;
                return (
                  <button
                    key={opt.label}
                    id={`expiry-${opt.days ?? 'never'}`}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setExpiresInDays(opt.days)}
                    className={cn(
                      'h-9 cursor-pointer rounded-full border px-3 text-xs font-medium transition-all',
                      active
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-white'
                        : 'border-[var(--color-border-strong)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/50 hover:text-white'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {generalError && (
          <div
            role="alert"
            className="rounded-[var(--radius-control)] border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-3 py-2.5 text-sm text-[var(--color-error)]"
          >
            {generalError}
          </div>
        )}

        <Button
          id="create-link-submit"
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          isLoading={mutation.isPending}
          disabled={!originalUrl.trim()}
        >
          {!mutation.isPending && <Sparkles aria-hidden="true" className="h-4 w-4" />}
          Shorten link
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </form>

      {created && (
        <div
          role="status"
          className="animate-fade-up relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/[0.07] p-4 sm:p-5"
        >
          <div aria-hidden="true" className="bg-brand pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl" />
          <div className="mb-3 flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-[var(--color-success)]">Your short link is ready</p>
            <button
              type="button"
              onClick={() => setCreated(null)}
              aria-label="Dismiss"
              className="cursor-pointer rounded-md p-1 text-[var(--color-muted)] hover:text-white"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center min-w-0">
            <a
              href={buildShortUrl(created.code)}
              target="_blank"
              rel="noreferrer"
              className="text-gradient min-w-0 flex-1 truncate font-mono text-base font-medium sm:text-lg"
            >
              {displayShortUrl(created.code)}
            </a>
            <div className="flex gap-2 shrink-0">
              <CopyButton id="created-link-copy" value={buildShortUrl(created.code)} label="Copy link" variant="solid" className="flex-1 sm:flex-none" />
              <a
                href={buildShortUrl(created.code)}
                target="_blank"
                rel="noreferrer"
                aria-label="Open short link"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] text-gray-300 transition-colors hover:text-white"
              >
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
          <p className="mt-2 truncate text-xs text-[var(--color-muted)] min-w-0">→ {created.originalUrl}</p>
        </div>
      )}
    </div>
  );
};
