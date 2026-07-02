import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link2, BarChart2, Zap } from 'lucide-react';
import { useAuthStore } from '@stores/authStore';
import { ShortenForm } from './ShortenForm';
import { LinkTable } from './LinkTable';
import { StatsDrawer } from '@features/analytics/StatsDrawer';
import type { Url } from '@app-types/index';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [statsUrl, setStatsUrl] = useState<Url | null>(null);
  const qc = useQueryClient();

  // Derive summary stats from cached urls
  const urls: Url[] = qc.getQueryData(['urls']) ?? [];
  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);
  const activeLinks = urls.filter(
    (u) => !u.expiresAt || new Date(u.expiresAt) >= new Date()
  ).length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Dashboard content starts below fixed navbar */}
      <main className="pt-24 pb-16 px-gutter max-w-[1280px] mx-auto space-y-stack-lg">

        {/* Welcome line */}
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Dashboard</h1>
          <p className="text-body-base text-on-surface-variant mt-1">
            Welcome back, <span className="text-primary">{user?.email}</span>
          </p>
        </div>

        {/* Stats cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-gutter" aria-label="Summary statistics">
          <StatCard
            label="Total Links"
            value={totalLinks.toLocaleString()}
            icon={<Link2 size={20} />}
            sub="created"
          />
          <StatCard
            label="Total Clicks"
            value={totalClicks.toLocaleString()}
            icon={<BarChart2 size={20} />}
            sub="all time"
          />
          <StatCard
            label="Active Links"
            value={activeLinks.toLocaleString()}
            icon={<Zap size={20} />}
            sub={`${totalLinks - activeLinks} expired`}
          />
        </section>

        {/* Shorten form */}
        <ShortenForm />

        {/* Link table */}
        <LinkTable onViewStats={setStatsUrl} />
      </main>

      {/* Stats drawer — slide in from right */}
      <StatsDrawer url={statsUrl} onClose={() => setStatsUrl(null)} />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}

function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <div className="bg-surface-container-low p-6 rounded-md border border-outline-variant/30 flex flex-col justify-between h-32 relative overflow-hidden">
      <div className="z-10">
        <p className="text-on-surface-variant text-label-sm uppercase tracking-wider">{label}</p>
        <h2 className="text-headline-lg font-bold mt-1 tabular-nums">{value}</h2>
      </div>
      {sub && (
        <div className="flex items-center text-on-surface-variant gap-1 z-10">
          <span className="text-label-sm">{sub}</span>
        </div>
      )}
      {/* Background icon watermark */}
      <div className="absolute -right-3 -bottom-3 opacity-5 text-on-surface" aria-hidden="true">
        <div className="w-24 h-24">{icon}</div>
      </div>
    </div>
  );
}
