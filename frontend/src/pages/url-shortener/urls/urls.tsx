import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link2, Search, SearchX } from 'lucide-react';
import { toast } from 'react-toastify';
import { urlsApi, type Url } from '@api/urls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { EmptyState, PageHeader } from '@components/common/Brand';
import { CreateLinkForm } from '@components/links/CreateLinkForm';
import { LinkCard, LinkCardSkeleton } from '@components/links/LinkCard';
import { getErrorMessage, isExpired } from '@utils/links';
import { cn } from '@utils/cn';

type Filter = 'all' | 'active' | 'expired';
type Sort = 'newest' | 'clicks';

export const UrlsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');

  const { data: urls = [], isLoading, isError, error } = useQuery({ queryKey: ['urls'], queryFn: urlsApi.findAll });

  const deleteMutation = useMutation({
    mutationFn: urlsApi.remove,
    onSuccess: (_, code) => {
      queryClient.setQueryData<Url[]>(['urls'], (old) => old?.filter((u) => u.code !== code));
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast.success('Link deleted successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Could not delete link'));
    },
  });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return urls
      .filter((u) => (filter === 'all' ? true : filter === 'expired' ? isExpired(u) : !isExpired(u)))
      .filter((u) => !q || u.code.toLowerCase().includes(q) || u.originalUrl.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === 'clicks' ? b.clicks - a.clicks : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [urls, query, filter, sort]);

  const counts = useMemo(
    () => ({ all: urls.length, active: urls.filter((u) => !isExpired(u)).length, expired: urls.filter(isExpired).length }),
    [urls]
  );

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 max-w-full">
      <PageHeader title="Links" description="Create, copy and manage all of your short links." />

      <Card className="animate-fade-up min-w-0 max-w-full">
        <CardHeader>
          <CardTitle>Create a new link</CardTitle>
          <CardDescription>Add a custom alias to make it memorable, and an expiry if it&apos;s temporary.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateLinkForm />
        </CardContent>
      </Card>

      <section aria-labelledby="links-heading" className="space-y-4 min-w-0 max-w-full">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 id="links-heading" className="text-lg font-semibold">
            Your links <span className="text-[var(--color-muted)]">({urls.length})</span>
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative block sm:w-64">
              <span className="sr-only">Search links</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                id="links-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search alias or URL"
                className="h-10 w-full rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] pl-9 pr-3 text-sm outline-none transition-all placeholder:text-gray-500 focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgb(124_108_255/0.15)]"
              />
            </label>
            <div className="flex gap-2">
              <div role="tablist" aria-label="Filter links" className="flex flex-1 rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] p-1">
                {(['all', 'active', 'expired'] as Filter[]).map((f) => (
                  <button
                    key={f}
                    id={`filter-${f}`}
                    type="button"
                    role="tab"
                    aria-selected={filter === f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md px-3 py-1 text-xs font-medium capitalize transition-all',
                      filter === f ? 'bg-[var(--color-surface-3)] text-white' : 'text-[var(--color-muted)] hover:text-white'
                    )}
                  >
                    {f} <span className="opacity-60">{counts[f]}</span>
                  </button>
                ))}
              </div>
              <label className="sr-only" htmlFor="links-sort">Sort links</label>
              <select
                id="links-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-10 cursor-pointer rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] px-3 text-xs font-medium outline-none focus:border-[var(--color-primary)]"
              >
                <option value="newest">Newest</option>
                <option value="clicks">Most clicks</option>
              </select>
            </div>
          </div>
        </div>

        {deleteMutation.isError && (
          <div role="alert" className="rounded-[var(--radius-control)] border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-3 py-2.5 text-sm text-[var(--color-error)]">
            {getErrorMessage(deleteMutation.error, 'Could not delete link')}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LinkCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className="rounded-[var(--radius-card)] border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 p-5 text-sm text-[var(--color-error)]">
            {getErrorMessage(error, 'Failed to load links')}
          </div>
        ) : urls.length === 0 ? (
          <EmptyState icon={Link2} title="No links yet" description="Create your first short link using the form above." />
        ) : visible.length === 0 ? (
          <EmptyState icon={SearchX} title="No matches" description="Try a different search term or filter." />
        ) : (
          <ul className="space-y-3">
            {visible.map((url, i) => (
              <li key={url.id}>
                <LinkCard
                  url={url}
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                  onDelete={(code) => deleteMutation.mutate(code)}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === url.code}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
