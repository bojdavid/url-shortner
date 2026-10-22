import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Fingerprint, LogOut, Mail } from 'lucide-react';
import { urlsApi } from '@api/urls';
import { useAuthStore } from '@stores/auth.store';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CopyButton } from '@components/ui/CopyButton';
import { PageHeader } from '@components/common/Brand';
import { formatNumber } from '@utils/links';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: urls = [] } = useQuery({ queryKey: ['urls'], queryFn: urlsApi.findAll });
  const totalClicks = urls.reduce((s, u) => s + u.clicks, 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Your account details." />

      <Card className="animate-fade-up overflow-hidden">
        <div className="bg-brand h-24 opacity-80 sm:h-28" />
        <CardContent className="-mt-10 pt-0 sm:-mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[var(--color-surface-1)] bg-[var(--color-surface-3)] text-3xl font-bold sm:h-24 sm:w-24">
                {user?.email?.[0]?.toUpperCase() ?? '?'}
              </span>
              <div className="min-w-0 pb-1">
                <p className="truncate text-lg font-semibold">{user?.email}</p>
                <p className="text-sm text-[var(--color-muted)]">
                  {formatNumber(urls.length)} links · {formatNumber(totalClicks)} clicks
                </p>
              </div>
            </div>
            <Button
              id="profile-logout"
              variant="secondary"
              onClick={() => {
                logout();
                toast.info('Logged out');
                navigate('/auth/login');
              }}
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-up" style={{ animationDelay: '60ms' }}>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Information associated with your login.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-[var(--color-border)]">
            <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <dt className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <Mail aria-hidden="true" className="h-4 w-4" /> Email
              </dt>
              <dd className="truncate text-sm font-medium">{user?.email}</dd>
            </div>
            {user?.id && (
              <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <dt className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <Fingerprint aria-hidden="true" className="h-4 w-4" /> User ID
                </dt>
                <dd className="flex min-w-0 items-center gap-2">
                  <code className="truncate font-mono text-xs text-gray-300">{user.id}</code>
                  <CopyButton value={user.id} />
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};
