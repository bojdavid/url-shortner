import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--color-primary)] box-glow">
              <span className="text-white text-lg font-mono leading-none">S</span>
            </div>
            <span>Snip</span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
