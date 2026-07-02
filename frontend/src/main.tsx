import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@lib/queryClient';
import { ToastProvider } from '@components/ui/Toast';
import { ProtectedRoute } from '@components/layout/ProtectedRoute';
import { Navbar } from '@components/layout/Navbar';

import { LandingPage } from '@features/landing/LandingPage';
import { LoginPage } from '@features/auth/LoginPage';
import { RegisterPage } from '@features/auth/RegisterPage';
import { DashboardPage } from '@features/dashboard/DashboardPage';

import './index.css';

import { RedirectPage } from '@features/dashboard/RedirectPage';

// Dashboard layout wrapper with Navbar
function DashboardLayout() {
  return (
    <>
      <Navbar />
      <DashboardPage />
    </>
  );
}

// 404 Not Found Page
function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-headline-lg md:text-[80px] font-bold text-indigo-500 mb-4">404</h1>
      <h2 className="text-heading-md text-on-surface mb-2">Page Not Found</h2>
      <p className="text-body-base text-on-surface-variant mb-8 max-w-md">
        The link you followed may be broken, or the page may have been removed.
      </p>
      <a href="/" className="bg-indigo-500 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-600 transition-colors">
        Back to Home
      </a>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />} />
            </Route>

            {/* Redirect / Short Link handler */}
            <Route path="/:code" element={<RedirectPage />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>
);
