import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, CalendarDays, ExternalLink, Globe2, MousePointerClick, TrendingUp } from 'lucide-react';
import { urlsApi } from '@api/urls';
import { analyticsApi } from '@api/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { CopyButton } from '@components/ui/CopyButton';
import { EmptyState, PageHeader, StatCard } from '@components/common/Brand';
import { buildShortUrl, displayShortUrl, formatNumber, getErrorMessage, hostnameOf } from '@utils/links';
import { cn } from '@utils/cn';

const RANGES = [7, 30, 90] as const;

const toKey = (d: Date) => d.toISOString().slice(0, 10);

/** Fill every day in the window so days without clicks render as zero bars. */
const fillDays = (rows: { date: string; clicks: number }[], days: number) => {
  const map = new Map(rows.map((r) => [String(r.date).slice(0, 10), r.clicks]));
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (days - 1 - i)));
    const key = toKey(d);
    return { key, date: d, clicks: map.get(key) ?? 0 };
  });
};

export const AnalyticsPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);

  const { data: urls = [], isLoading: urlsLoading } = useQuery({ queryKey: ['urls'], queryFn: urlsApi.findAll });
  const activeCode = params.get('code') || urls[0]?.code || '';
  const activeUrl = urls.find((u) => u.code === activeCode);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['analytics', activeCode, days],
    queryFn: () => analyticsApi.getAnalytics(activeCode, days),
    enabled: !!activeCode,
  });

  const series = useMemo(() => fillDays(data?.byDay ?? [], days), [data, days]);
  const periodClicks = series.reduce((s, d) => s + d.clicks, 0);
  const peak = series.reduce((best, d) => (d.clicks > best.clicks ? d : best), series[0] ?? { clicks: 0, date: new Date(), key: '' });
  const maxDay = Math.max(1, peak?.clicks ?? 0);
  const referers = data?.byReferer ?? [];
  const maxRef = Math.max(1, ...referers.map((r) => r.clicks));
  const topRef = referers[0];

  const fmtDay = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 max-w-full">
      <PageHeader title="Analytics" description="Daily clicks and traffic sources for each of your links." />

      {urlsLoading ? (
        <div className="skeleton h-28" />
      ) : urls.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Nothing to analyse yet"
          description="Create a link and share it — clicks will appear here."
          action={
            <Link to="/urls" className="bg-brand box-glow inline-flex h-10 items-center rounded-[var(--radius-control)] px-4 text-sm font-medium text-white">
              Create a link
            </Link>
          }
        />
      ) : (
        <>
          {/* Link picker + range */}
          <Card className="animate-fade-up">
            <CardContent className="flex flex-col gap-4 pt-5 sm:pt-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1 space-y-1.5">
                <label htmlFor="analytics-link-select" className="text-sm font-medium text-gray-200">Link</label>
                <select
                  id="analytics-link-select"
                  value={activeCode}
                  onChange={(e) => setParams({ code: e.target.value })}
                  className="h-11 w-full cursor-pointer rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] px-3 font-mono text-sm outline-none focus:border-[var(--color-primary)] lg:max-w-md"
                >
                  {urls.map((u) => (
                    <option key={u.code} value={u.code}>
                      /s/{u.code} — {hostnameOf(u.originalUrl)}
                    </option>
                  ))}
                </select>
              </div>
              <div role="tablist" aria-label="Date range" className="flex rounded-[var(--radius-control)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] p-1">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    id={`range-${r}`}
                    type="button"
                    role="tab"
                    aria-selected={days === r}
                    onClick={() => setDays(r)}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-all',
                      days === r ? 'bg-brand text-white shadow' : 'text-[var(--color-muted)] hover:text-white'
                    )}
                  >
                    {r}d
                  </button>
                ))}
              </div>
            </CardContent>
            {activeUrl && (
              <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                <div className="min-w-0 flex-1">
                  <a href={buildShortUrl(activeUrl.code)} target="_blank" rel="noreferrer" className="text-gradient block truncate font-mono text-base font-medium">
                    {displayShortUrl(activeUrl.code)}
                  </a>
                  <a href={activeUrl.originalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-gray-200">
                    <span className="truncate">{activeUrl.originalUrl}</span>
                    <ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0" />
                  </a>
                </div>
                <CopyButton id="analytics-copy" value={buildShortUrl(activeUrl.code)} label="Copy link" />
              </div>
            )}
          </Card>

          {isError ? (
            <div role="alert" className="rounded-[var(--radius-card)] border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 p-5 text-sm text-[var(--color-error)]">
              {getErrorMessage(error, 'Failed to load analytics')}
            </div>
          ) : (
            <>
              <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 min-w-0 max-w-full">
                <StatCard label="All-time clicks" value={isLoading ? '—' : formatNumber(data?.totalClicks ?? 0)} icon={MousePointerClick} tone="primary" />
                <StatCard label={`Last ${days} days`} value={isLoading ? '—' : formatNumber(periodClicks)} icon={CalendarDays} tone="accent" style={{ animationDelay: '60ms' }} />
                <StatCard
                  label="Peak day"
                  value={isLoading ? '—' : peak && peak.clicks > 0 ? <span>{formatNumber(peak.clicks)} <span className="text-sm font-medium text-[var(--color-muted)]">{fmtDay(peak.date)}</span></span> : '0'}
                  icon={TrendingUp}
                  tone="success"
                  style={{ animationDelay: '120ms' }}
                />
                <StatCard
                  label="Top source"
                  value={<span className="block truncate text-lg sm:text-xl">{isLoading ? '—' : topRef ? (topRef.referer ? hostnameOf(topRef.referer) : 'Direct') : '—'}</span>}
                  icon={Globe2}
                  tone="warning"
                  style={{ animationDelay: '180ms' }}
                />
              </section>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] min-w-0 max-w-full">
                <Card className="animate-fade-up min-w-0 max-w-full">
                  <CardHeader>
                    <CardTitle>Clicks over time</CardTitle>
                    <CardDescription>{data?.period ?? `Last ${days} days`} · UTC</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="skeleton h-56" />
                    ) : (
                      <figure>
                        <div className="relative h-56">
                          {/* grid lines */}
                          <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between">
                            {[0, 1, 2, 3].map((i) => (
                              <div key={i} className="border-t border-dashed border-[var(--color-border)]" />
                            ))}
                          </div>
                          <div
                            className="relative flex h-full items-end"
                            style={{ gap: days > 30 ? '1px' : days > 7 ? '3px' : '10px' }}
                            role="img"
                            aria-label={`Bar chart of daily clicks over the last ${days} days, ${periodClicks} total`}
                          >
                            {series.map((d) => (
                              <div key={d.key} className="group relative flex h-full flex-1 items-end">
                                <div
                                  className={cn(
                                    'w-full rounded-t-[3px] transition-all duration-500',
                                    d.clicks > 0 ? 'bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-accent)] group-hover:brightness-125' : 'bg-[var(--color-surface-3)]'
                                  )}
                                  style={{ height: d.clicks > 0 ? `${Math.max(4, (d.clicks / maxDay) * 100)}%` : '2px' }}
                                />
                                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                  <strong>{d.clicks}</strong> · {fmtDay(d.date)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <figcaption className="mt-2 flex justify-between text-[11px] text-[var(--color-muted)]">
                          <span>{series[0] && fmtDay(series[0].date)}</span>
                          <span>Peak {formatNumber(maxDay === 1 && !peak?.clicks ? 0 : maxDay)}</span>
                          <span>{series.at(-1) && fmtDay(series.at(-1)!.date)}</span>
                        </figcaption>
                      </figure>
                    )}
                  </CardContent>
                </Card>

                <Card className="animate-fade-up" style={{ animationDelay: '80ms' }}>
                  <CardHeader>
                    <CardTitle>Top referrers</CardTitle>
                    <CardDescription>Where your clicks come from (all time)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-9" />)}
                      </div>
                    ) : referers.length === 0 ? (
                      <p className="py-10 text-center text-sm text-[var(--color-muted)]">No clicks recorded yet.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {referers.map((r, i) => {
                          const label = r.referer ? hostnameOf(r.referer) : 'Direct / none';
                          return (
                            <li key={`${r.referer}-${i}`} className="relative overflow-hidden rounded-lg border border-[var(--color-border)] px-3 py-2">
                              <div aria-hidden="true" className="absolute inset-y-0 left-0 bg-[var(--color-accent)]/10" style={{ width: `${(r.clicks / maxRef) * 100}%` }} />
                              <div className="relative flex items-center justify-between gap-3 text-sm">
                                <span className="truncate" title={r.referer ?? undefined}>{label}</span>
                                <span className="font-semibold tabular-nums">{formatNumber(r.clicks)}</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
