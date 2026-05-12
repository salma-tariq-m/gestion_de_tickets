import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { FullPageSpinner } from '../components/ui/Spinner';
import { ROLES } from '../utils/constants';

// ── Lazy pages ──────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const TicketListPage = lazy(() => import('../features/tickets/TicketListPage'));
const TicketCreatePage = lazy(() => import('../features/tickets/TicketCreatePage'));
const TicketDetailPage = lazy(() => import('../features/tickets/TicketDetailPage'));
const UsersPage = lazy(() => import('../features/admin/UsersPage'));
const CategoriesPage = lazy(() => import('../features/admin/CategoriesPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<FullPageSpinner />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────────────
  { path: '/login', element: withSuspense(LoginPage) },
  { path: '/register', element: withSuspense(RegisterPage) },
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // ── Protected routes ───────────────────────────────────────────────────
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: withSuspense(DashboardPage) },
      { path: '/tickets', element: withSuspense(TicketListPage) },
      { path: '/tickets/new', element: withSuspense(TicketCreatePage) },
      { path: '/tickets/:id', element: withSuspense(TicketDetailPage) },

      // ── Admin routes ─────────────────────────────────────────────────
      {
        path: '/admin/users',
        element: (
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            {withSuspense(UsersPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/categories',
        element: (
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            {withSuspense(CategoriesPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/settings',
        element: (
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <div className="p-8 text-gray-500 text-sm">Paramètres système — à venir.</div>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ── 404 fallback ───────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
