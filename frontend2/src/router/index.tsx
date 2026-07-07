import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { AuthLayout } from '@components/common/layout/AuthLayout';
import { LoginPage } from '@pages/auth/login/login';
import { RegisterPage } from '@pages/auth/register/register';
import { DashboardLayout } from '@components/common/layout/DashboardLayout';
import { ProtectedRoute } from '@components/common/layout/ProtectedRoute';
import { DashboardPage } from '@pages/url-shortener/dashboard/dashboard';
import { UrlsPage } from '@pages/url-shortener/urls/urls';
import { AnalyticsPage } from '@pages/url-shortener/analytics/analytics';
import { TeamsPage } from '@pages/url-shortener/teams/teams';
import { SettingsPage } from '@pages/url-shortener/settings/settings';
import { ProfilePage } from '@pages/url-shortener/profile/profile';
import PageNotFound from '@pages/PageNotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'urls', element: <UrlsPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'teams', element: <TeamsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      // Must be last
      {
        path: '*',
        element: <PageNotFound />,
      }
    ],
  },
]);

