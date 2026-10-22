import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, Link2, MousePointerClick, Trophy } from 'lucide-react';
import { urlsApi } from '@api/urls';
import { useAuthStore } from '@stores/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { CopyButton } from '@components/ui/CopyButton';
import { EmptyState, PageHeader, StatCard } from '@components/common/Brand';
import { CreateLinkForm } from '@components/links/CreateLinkForm';
import { buildShortUrl, displayShortUrl, formatNumber, hostnameOf, isExpired } from '@utils/links';

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { data: urls = [], isLoading } = useQuery({ queryKey: ['urls'], queryFn: urlsApi.findAll });

  const stats = useMemo(() => {
    const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);
    const active = urls.filter((u) => !isExpired(u)).length;
    const top = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    return { totalClicks, active, top, best: top[0]?.clicks ?? 0 };
  }, [urls]);

  const maxClicks = Math.max(1, stats.best);
  const name = user?.email?.split('@')[0];

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 max-w-full">
      <PageHeader
        title={name ? `Hey ${name} 👋` : 'Dashboard'}
        description="Shorten a link or check how your existing links are performing."
      />

      <section aria-label="Overview" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 min-w-0 max-w-full">
        <StatCard label="Total links" value={isLoading ? '—' : formatNumber(urls.length)} icon={Link2} tone="primary" />
        <StatCard label="Total clicks" value={isLoading ? '—' : formatNumber(stats.totalClicks)} icon={MousePointerClick} tone="accent" style={{ animationDelay: '60ms' }} />
        <StatCard label="Active links" value={isLoading ? '—' : formatNumber(stats.active)} icon={CheckCircle2} tone="success" style={{ animationDelay: '120ms' }} />
        <StatCard label="Best link" value={isLoading ? '—' : formatNumber(stats.best)} icon={Trophy} tone="warning" style={{ animationDelay: '180ms' }} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] min-w-0 max-w-full">
        <Card className="animate-fade-up min-w-0 max-w-full">
          <CardHeader>
            <CardTitle>Shorten a link</CardTitle>
            <CardDescription>Paste a long URL, optionally pick your own alias.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateLinkForm compact />
          </CardContent>
        </Card>

        <Card className="animate-fade-up min-w-0 max-w-full" style={{ animationDelay: '80ms' }}>
          <CardHeader className="flex-row items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <CardTitle>Top links</CardTitle>
              <CardDescription className="truncate">Ranked by total clicks</CardDescription>
            </div>
            <Link to="/urls" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#b3a8ff] hover:text-white">
              View all <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-14" />
                ))}
              </div>
            ) : stats.top.length === 0 ? (
              <EmptyState icon={Link2} title="No links yet" description="Your most clicked links will show up here." />
            ) : (
              <ol className="space-y-2 min-w-0">
                {stats.top.map((url, i) => (
                  <li
                    key={url.id}
                    className="group relative min-w-0 overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface-1)]/60 p-3 transition-colors hover:border-[var(--color-border-strong)]"
                  >
                    <div
                      aria-hidden="true"
                      className="bg-brand absolute inset-y-0 left-0 opacity-[0.08] transition-all duration-700"
                      style={{ width: `${(url.clicks / maxClicks) * 100}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-2.5 sm:gap-3 min-w-0">
                      <span className="w-4 shrink-0 text-center font-mono text-xs text-[var(--color-muted)]">{i + 1}</span>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <Link
                          to={`/analytics?code=${encodeURIComponent(url.code)}`}
                          className="block truncate font-mono text-sm text-[#b3a8ff] hover:text-white"
                        >
                          {displayShortUrl(url.code)}
                        </Link>
                        <p className="truncate text-xs text-[var(--color-muted)]">{hostnameOf(url.originalUrl)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold tabular-nums">{formatNumber(url.clicks)}</p>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">clicks</p>
                      </div>
                      <div className="shrink-0">
                        <CopyButton value={buildShortUrl(url.code)} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
