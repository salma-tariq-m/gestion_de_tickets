import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FullPageSpinner } from '../components/ui/Spinner';
import PropTypes from 'prop-types';

/**
 * Garde de route (PrivateRoute) conforme à la structure de fichiers TicketFlow
 */
export function PrivateRoute({ children, allowedRoles = [] }) {
  const { token, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading && !user) {
    return <FullPageSpinner />;
  }

  // Si pas connecté
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles autorisés si fournis
  if (allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    
    // Si l'utilisateur est client ou user, on considère qu'il a le rôle 'user' ou 'client'
    const hasRole = allowedRoles.map(r => r.toLowerCase()).includes(userRole);
    
    if (!hasRole) {
      // Redirection intelligente selon le rôle de l'utilisateur
      if (userRole === 'admin') return <Navigate to="/dashboard" replace />;
      if (userRole === 'agent' || userRole === 'manager') return <Navigate to="/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
