import { Link, useNavigate } from 'react-router-dom';
import { Scissors, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { clsx } from 'clsx';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-outline-variant">
      <div className="flex items-center justify-between h-16 px-gutter max-w-[1280px] mx-auto">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-heading-md font-bold text-primary tracking-tight"
        >
          <Scissors size={20} className="text-indigo-500" />
          Snip
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-label-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <span className="text-label-sm text-on-surface-variant opacity-60 hidden lg:block">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-label-sm text-on-surface-variant hover:text-error transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-label-sm font-semibold px-5 py-2 rounded transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-on-surface-variant hover:text-on-surface p-2 rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          'md:hidden border-t border-outline-variant bg-surface transition-all duration-200',
          mobileOpen ? 'block' : 'hidden'
        )}
      >
        <div className="px-gutter py-4 flex flex-col gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="text-body-base text-on-surface"
              >
                Dashboard
              </Link>
              <p className="text-label-sm text-on-surface-variant">{user?.email}</p>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="text-body-base text-error text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-body-base text-on-surface">
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="bg-indigo-500 text-white text-label-sm font-semibold px-5 py-2.5 rounded text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
