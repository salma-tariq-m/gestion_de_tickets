import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import PrivateRoute from './PrivateRoute';
import { FullPageSpinner } from '../components/ui/Spinner';

// ── Lazy Pages ──────────────────────────────────────────────────────────────
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// User Pages
const UserDashboard = lazy(() => import('../pages/user/Dashboard'));
const MyTickets = lazy(() => import('../pages/user/MyTickets'));
const CreateTicket = lazy(() => import('../pages/user/CreateTicket'));
const UserTicketDetail = lazy(() => import('../pages/user/TicketDetail'));

// Agent Pages
const AgentDashboard = lazy(() => import('../pages/agent/AgentDashboard'));
const AllTickets = lazy(() => import('../pages/agent/AllTickets'));
const AgentTicketDetail = lazy(() => import('../pages/agent/TicketDetail'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'));
const Categories = lazy(() => import('../pages/admin/Categories'));

const withSuspense = (Component) => (
  <Suspense fallback={<FullPageSpinner />}>
    <Component />
  </Suspense>
);

// ── Dispatchers de rôles pour vues uniformisées ──────────────────────────────
function DashboardDispatcher() {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) return <FullPageSpinner />;
  
  const role = user.role?.toLowerCase();
  if (role === 'admin') {
    return withSuspense(AdminDashboard);
  }
  if (role === 'agent' || role === 'manager') {
    return withSuspense(AgentDashboard);
  }
  // Par défaut client / utilisateur standard
  return withSuspense(UserDashboard);
}

function TicketsDispatcher() {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <FullPageSpinner />;

  const role = user.role?.toLowerCase();
  if (role === 'agent' || role === 'manager' || role === 'admin') {
    return withSuspense(AllTickets);
  }
  return withSuspense(MyTickets);
}

function TicketDetailDispatcher() {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <FullPageSpinner />;

  const role = user.role?.toLowerCase();
  if (role === 'agent' || role === 'manager' || role === 'admin') {
    return withSuspense(AgentTicketDetail);
  }
  return withSuspense(UserTicketDetail);
}

// ── Configuration du routeur ──────────────────────────────────────────────────
const router = createBrowserRouter([
  // Routes Publiques
  { path: '/login', element: withSuspense(Login) },
  { path: '/register', element: withSuspense(Register) },
  { path: '/forgot-password', element: withSuspense(ForgotPassword) },
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Routes Privées (Layout Principal)
  {
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardDispatcher /> },
      { path: '/tickets', element: <TicketsDispatcher /> },
      { path: '/tickets/new', element: <PrivateRoute allowedRoles={['user', 'client']}>{withSuspense(CreateTicket)}</PrivateRoute> },
      { path: '/tickets/:id', element: <TicketDetailDispatcher /> },
      
      // Admin-only Routes
      { 
        path: '/admin/users', 
        element: <PrivateRoute allowedRoles={['admin']}>{withSuspense(UsersManagement)}</PrivateRoute> 
      },
      { 
        path: '/admin/categories', 
        element: <PrivateRoute allowedRoles={['admin']}>{withSuspense(Categories)}</PrivateRoute> 
      },
      
      // Paramètres (Commun)
      {
        path: '/settings',
        element: (
          <div className="tf-card" style={{ padding: 'var(--spacing-xl)' }}>
            <h2>Paramètres Profil</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Cette section vous permet de modifier les préférences de votre compte TicketFlow. (Bientôt disponible)
            </p>
          </div>
        )
      },
      // Mock sections for Sidebar
      {
        path: '/teams',
        element: (
          <div className="tf-card" style={{ padding: 'var(--spacing-xl)' }}>
            <h2>Équipes Support</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Consultez les membres de l'équipe d'assistance et gérez les plannings de garde.
            </p>
          </div>
        )
      },
      {
        path: '/kb',
        element: (
          <div className="tf-card" style={{ padding: 'var(--spacing-xl)' }}>
            <h2>Base de Connaissances</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Accédez aux guides de dépannage rapide et à la documentation interne de support.
            </p>
          </div>
        )
      },
      {
        path: '/reports',
        element: (
          <div className="tf-card" style={{ padding: 'var(--spacing-xl)' }}>
            <h2>Rapports & KPIs</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Visualisez le taux de résolution du support client et les statistiques d'atteinte SLA.
            </p>
          </div>
        )
      }
    ],
  },

  // 404 Fallback
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
