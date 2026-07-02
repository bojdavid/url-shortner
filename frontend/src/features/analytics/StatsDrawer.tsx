import { useEffect } from 'react';
import { X, ExternalLink, MousePointerClick } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { analyticsApi } from '@lib/api/analytics';
import type { Url } from '@app-types/index';
import { clsx } from 'clsx';

interface StatsDrawerProps {
  url: Url | null;
  onClose: () => void;
}

export function StatsDrawer({ url, onClose }: StatsDrawerProps) {
  const open = !!url;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', url?.code],
    queryFn: () => analyticsApi.getAnalytics(url!.code, 30),
    enabled: !!url,
  });

  const topClick = Math.max(...(data?.byReferer.map((r) => r.clicks) ?? [1]));

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[50] bg-surface-container-lowest/70 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        className={clsx(
          'fixed top-0 right-0 h-full w-full max-w-[480px] bg-surface-container-lowest border-l border-outline-variant z-[60] flex flex-col shadow-drawer transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Link statistics"
        role="complementary"
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
              <MousePointerClick size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-heading-md font-semibold text-on-surface font-mono">
                {url?.code ?? '—'}
              </h2>
              <p className="text-label-sm text-on-surface-variant">Link Analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant"
            aria-label="Close analytics panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-stack-lg">

          {/* Quick stats */}
          <section className="grid grid-cols-3 gap-3">
            <QuickStat
              label="Total Clicks"
              value={isLoading ? '…' : (data?.totalClicks ?? url?.clicks ?? 0).toLocaleString()}
              accent
            />
            <QuickStat
              label="Created"
              value={url ? new Date(url.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            />
            <QuickStat
              label="Expires"
              value={
                url?.expiresAt
                  ? new Date(url.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Never'
              }
            />
          </section>

          {/* Original URL */}
          {url && (
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-label-sm text-on-surface-variant hover:text-primary transition-colors truncate group"
            >
              <ExternalLink size={13} className="shrink-0" />
              <span className="truncate">{url.originalUrl}</span>
            </a>
          )}

          {/* Clicks over time chart */}
          <section className="space-y-3">
            <h3 className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Clicks Over Time (30 days)
            </h3>

            {isLoading ? (
              <div className="h-40 skeleton rounded-md" />
            ) : data && data.byDay.length > 0 ? (
              <div className="h-44 bg-surface-container-high/30 rounded-md border border-outline-variant overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.byDay} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tick={{ fill: '#c7c4d7', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fill: '#c7c4d7', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#171f33',
                        border: '1px solid #464554',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#dae2fd',
                      }}
                      cursor={{ fill: 'rgba(192,193,255,0.05)' }}
                    />
                    <Bar dataKey="clicks" radius={[3, 3, 0, 0]} maxBarSize={24}>
                      {data.byDay.map((_, i) => (
                        <Cell key={i} fill="rgba(192,193,255,0.6)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-on-surface-variant text-label-sm bg-surface-container-high/20 rounded-md border border-outline-variant">
                No click data yet
              </div>
            )}
          </section>

          {/* Top referrers */}
          <section className="space-y-3">
            <h3 className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Top Referrers
            </h3>

            {isLoading ? (
              <div className="space-y-3">
                {[80, 55, 30].map((w, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 skeleton rounded" style={{ width: `${w}%` }} />
                    <div className="h-1.5 skeleton rounded-full w-full" />
                  </div>
                ))}
              </div>
            ) : data && data.byReferer.length > 0 ? (
              <div className="space-y-4">
                {data.byReferer.map((r, i) => {
                  const pct = topClick > 0 ? Math.round((r.clicks / topClick) * 100) : 0;
                  const label = r.referer
                    ? new URL(r.referer.startsWith('http') ? r.referer : `https://${r.referer}`).hostname
                    : 'Direct / Unknown';
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-label-sm">
                        <span className="font-medium text-on-surface truncate">{label}</span>
                        <span className="text-on-surface-variant ml-2 shrink-0">{r.clicks.toLocaleString()} clicks</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-label-sm text-on-surface-variant">No referrer data yet</p>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}

function QuickStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="p-4 bg-surface-container-low rounded-md border border-outline-variant">
      <span className="text-label-sm text-on-surface-variant block mb-1">{label}</span>
      <p className={clsx('text-heading-md font-semibold', accent ? 'text-primary' : 'text-on-surface')}>
        {value}
      </p>
    </div>
  );
}
