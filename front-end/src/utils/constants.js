/** Rôles utilisateurs */
export const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user',
};

/** Statuts de ticket */
export const STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

/** Libellés des statuts */
export const STATUS_LABELS = {
  [STATUS.OPEN]: 'Ouvert',
  [STATUS.IN_PROGRESS]: 'En cours',
  [STATUS.RESOLVED]: 'Résolu',
  [STATUS.CLOSED]: 'Fermé',
};

/** Priorités de ticket */
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

/** Libellés des priorités */
export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Basse',
  [PRIORITY.MEDIUM]: 'Moyenne',
  [PRIORITY.HIGH]: 'Haute',
};

/** Routes de l'application */
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TICKETS: '/tickets',
  TICKET_NEW: '/tickets/new',
  TICKET_DETAIL: '/tickets/:id',
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_SETTINGS: '/admin/settings',
};

/** Couleurs par statut (classes Tailwind) */
export const STATUS_COLORS = {
  [STATUS.OPEN]: 'bg-blue-100 text-blue-700 border-blue-200',
  [STATUS.IN_PROGRESS]: 'bg-orange-100 text-orange-700 border-orange-200',
  [STATUS.RESOLVED]: 'bg-green-100 text-green-700 border-green-200',
  [STATUS.CLOSED]: 'bg-gray-100 text-gray-600 border-gray-200',
};

/** Couleurs par priorité (classes Tailwind) */
export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [PRIORITY.MEDIUM]: 'bg-amber-100 text-amber-700 border-amber-200',
  [PRIORITY.HIGH]: 'bg-red-100 text-red-700 border-red-200',
};
