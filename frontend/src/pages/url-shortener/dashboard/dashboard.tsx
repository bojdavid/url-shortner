import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { urlsApi } from '@api/urls';
import { Card, CardContent, } from '@components/ui/Card';
import { BarChart2, Link2, MousePointerClick } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: urls = [], isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: urlsApi.findAll,
  });

  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  // Sort by clicks to get top performers
  const topUrls = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) => (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-[8px] bg-[var(--color-surface-2)] flex items-center justify-center border border-[var(--color-border)] text-[var(--color-primary)]">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back. Here's what's happening with your links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Links" value={isLoading ? '-' : totalUrls} icon={Link2} />
        <StatCard title="Total Clicks" value={isLoading ? '-' : totalClicks} icon={MousePointerClick} />
        <StatCard title="Avg Clicks / Link" value={isLoading || totalUrls === 0 ? '-' : Math.round(totalClicks / totalUrls)} icon={BarChart2} />
      </div>

      <h2 className="text-xl font-bold tracking-tight mt-12 mb-4">Top Performing Links</h2>
      <Card>
        <div className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Loading top links...</div>
          ) : topUrls.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No links available.</div>
          ) : (
            topUrls.map((url) => (
              <div key={url.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-surface-2)] transition-colors">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-sm font-medium text-white truncate">{url.originalUrl}</p>
                  <p className="text-xs text-[var(--color-primary)] font-mono mt-1 truncate">/{url.code}</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className="text-sm font-bold">{url.clicks}</p>
                  <p className="text-xs text-gray-500">clicks</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

