import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, Link2, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useAuthStore } from '@stores/auth.store';
import { toast } from 'react-toastify';
import { Logo } from '@components/common/Brand';
import { cn } from '@utils/cn';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/urls', icon: Link2, label: 'Links' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: UserRound, label: 'Profile' },
];

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Close the drawer on navigation
  useEffect(() => setOpen(false), [location.pathname]);

  // Escape to close, make the page behind inert while the drawer is open
  useEffect(() => {
    if (mainRef.current) mainRef.current.inert = open;
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/auth/login');
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-2 pb-8">
        <Logo to="/dashboard" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="cursor-pointer rounded-lg p-1.5 text-[var(--color-muted)] hover:text-white lg:hidden"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Main" className="flex-1">
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                id={`nav-${label.toLowerCase()}`}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[var(--color-primary)]/12 text-white'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span aria-hidden="true" className="bg-brand absolute inset-y-2 left-0 w-[3px] rounded-full" />
                    )}
                    <Icon
                      aria-hidden="true"
                      className={cn('h-[18px] w-[18px] transition-colors', isActive && 'text-[var(--color-primary)]')}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 border-t border-[var(--color-border)] pt-4">
        <div className="mb-2 flex items-center gap-3 rounded-[var(--radius-control)] px-2 py-2">
          <span className="bg-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.email ?? 'Signed in'}</p>
            <p className="text-xs text-[var(--color-muted)]">Free plan</p>
          </div>
        </div>
        <button
          id="logout-button"
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)]"
        >
          <LogOut aria-hidden="true" className="h-[18px] w-[18px]" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh max-w-full overflow-x-hidden lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="glass sticky top-0 hidden h-dvh border-r border-[var(--color-border)] p-4 lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <aside
        id="mobile-drawer"
        aria-label="Navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[min(18rem,82dvw)] border-r border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full invisible'
        )}
      >
        {sidebar}
      </aside>

      <div ref={mainRef} className="flex min-w-0 max-w-full flex-1 flex-col overflow-x-hidden">
        {/* Mobile top bar */}
        <header className="glass sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 lg:hidden">
          <Logo to="/dashboard" />
          <button
            ref={menuBtnRef}
            id="mobile-menu-button"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="cursor-pointer rounded-lg border border-[var(--color-border-strong)] p-2 text-gray-300 hover:text-white"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        <main className="layout-container flex-1 min-w-0 max-w-full py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
