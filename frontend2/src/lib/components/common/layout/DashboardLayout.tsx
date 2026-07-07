import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Link2, BarChart2, Users, Settings, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@stores/auth.store';
import { authApi } from '@api/auth';
import { cn } from '@utils/cn';

export const DashboardLayout: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/urls', icon: Link2, label: 'Links' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/teams', icon: Users, label: 'Teams' },
  ];

  const bottomNavItems = [
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-all',
          isActive
            ? 'bg-[var(--color-primary)] text-white box-glow'
            : 'text-gray-400 hover:bg-[var(--color-surface-2)] hover:text-white'
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[var(--color-background)]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-1)] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--color-primary)] box-glow">
            <span className="text-white text-lg font-mono leading-none">S</span>
          </div>
          <span className="text-xl font-bold tracking-tighter">Snip</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-white p-1">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 flex flex-col",
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
        "md:relative md:translate-x-0 md:z-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-8 px-2 flex items-center justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--color-primary)] box-glow">
              <span className="text-white text-lg font-mono leading-none">S</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">Snip</span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
             <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-4 border-t border-[var(--color-border)]">
          {bottomNavItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium text-gray-400 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-error)] transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="layout-container py-6 md:py-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

