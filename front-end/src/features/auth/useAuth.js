import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectCurrentToken,
  selectUserRole,
  clearCredentials,
} from './authSlice';
import { useLogoutMutation } from './authApi';
import { ROLES } from '../../utils/constants';

/**
 * Hook custom centralisant l'accès à l'état d'authentification.
 * @returns {{ user, token, isAuthenticated, role, isAdmin, isAgent, logout }}
 */
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Forcer la déconnexion locale même si le serveur échoue
      dispatch(clearCredentials());
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    role,
    isAdmin: role === ROLES.ADMIN,
    isAgent: role === ROLES.AGENT || role === ROLES.ADMIN,
    logout,
  };
}
