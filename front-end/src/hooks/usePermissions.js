import { useSelector } from 'react-redux';
import { selectUserRole } from '../features/auth/authSlice';
import { ROLES } from '../utils/constants';

/**
 * Hook de vérification des permissions selon le rôle.
 * @returns {{ role, isAdmin, isAgent, isUser, can }}
 */
export function usePermissions() {
  const role = useSelector(selectUserRole);

  /**
   * Vérifie si l'utilisateur possède au moins l'un des rôles fournis.
   * @param {...string} roles
   * @returns {boolean}
   */
  const can = (...roles) => roles.includes(role);

  return {
    role,
    isAdmin: role === ROLES.ADMIN,
    isAgent: role === ROLES.AGENT || role === ROLES.ADMIN,
    isUser: role === ROLES.USER,
    can,
  };
}
