import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { urlsApi } from '@api/urls';
import { analyticsApi } from '@api/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';

export const AnalyticsPage: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string>('');

  const { data: urls = [], isLoading: isLoadingUrls } = useQuery({
    queryKey: ['urls'],
    queryFn: urlsApi.findAll,
  });

  // Default to first URL if none selected
  const activeCode = selectedCode || (urls.length > 0 ? urls[0].code : '');

  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['analytics', activeCode],
    queryFn: () => analyticsApi.getAnalytics(activeCode),
    enabled: !!activeCode,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-gray-400">View detailed performance metrics for your links.</p>
      </div>

      <Card className="bg-[var(--color-surface-2)] border-none">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center">
          <label className="text-sm font-medium whitespace-nowrap">Select Link:</label>
          <select
            value={activeCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            disabled={isLoadingUrls || urls.length === 0}
            className="w-full sm:max-w-md h-10 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:box-glow transition-all"
          >
            {isLoadingUrls ? (
              <option>Loading links...</option>
            ) : urls.length === 0 ? (
              <option>No links available</option>
            ) : (
              urls.map((url) => (
                <option key={url.code} value={url.code}>
                  /{url.code} - {url.originalUrl.substring(0, 40)}{url.originalUrl.length > 40 ? '...' : ''}
                </option>
              ))
            )}
          </select>
        </CardContent>
      </Card>

      {!activeCode ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-[10px]">
          <p className="text-gray-400">No link selected for analytics.</p>
        </div>
      ) : isLoadingAnalytics ? (
        <div className="text-center py-16">
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.byDay.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-500">No click data available</div>
              ) : (
                <div className="space-y-3">
                  {analytics.byDay.map((day) => (
                    <div key={day.date} className="flex items-center gap-4 text-sm">
                      <span className="w-24 text-gray-400">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <div className="flex-1 bg-[var(--color-surface-2)] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[var(--color-primary)] h-full" 
                          style={{ width: `${Math.max(2, (day.clicks / analytics.totalClicks) * 100)}%` }} 
                        />
                      </div>
                      <span className="w-8 text-right font-medium">{day.clicks}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.byReferer.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-500">No referrer data available</div>
              ) : (
                <div className="space-y-4">
                  {analytics.byReferer.map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--color-surface-2)]">
                      <span className="text-sm font-medium">{ref.referer || 'Direct / Unknown'}</span>
                      <span className="text-sm font-bold text-[var(--color-primary)]">{ref.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

