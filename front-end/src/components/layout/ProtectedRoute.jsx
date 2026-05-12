import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../../features/auth/authSlice';
import { FullPageSpinner } from '../ui/Spinner';
import PropTypes from 'prop-types';

/**
 * Route protégée — redirige vers /login si non authentifié.
 * Si `requiredRole` est fourni, vérifie aussi le rôle.
 * @param {{ children: React.ReactNode, requiredRole?: string }} props
 */
export function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const location = useLocation();

  if (isAuthenticated === undefined) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;
