import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@components/common/Brand';

const PageNotFound: React.FC = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo className="mb-12" />
      <p className="text-gradient text-7xl font-extrabold tracking-tighter sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">This link went nowhere</h1>
      <p className="mt-2 max-w-sm text-[var(--color-muted)]">
        The page you&apos;re looking for doesn&apos;t exist. Short links live at <code className="font-mono text-gray-300">/s/&lt;code&gt;</code>.
      </p>
      <Link
        to="/dashboard"
        className="bg-brand box-glow mt-8 inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] px-5 text-sm font-medium text-white transition hover:brightness-110"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to dashboard
      </Link>
    </main>
  );
};

export default PageNotFound;