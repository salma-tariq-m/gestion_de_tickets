/** Rôles utilisateurs */
export const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  MANAGER: 'manager',
  USER: 'user',
  CLIENT: 'client',
};

/** Statuts de ticket */
export const STATUS = {
  NOUVEAU: 'nouveau',
  EN_COURS: 'en-cours',
  EN_ATTENTE: 'en-attente',
  ESCALADE: 'escalade',
  RESOLU: 'resolu',
  FERME: 'ferme',
};

/** Libellés des statuts */
export const STATUS_LABELS = {
  [STATUS.NOUVEAU]: 'Nouveau',
  [STATUS.EN_COURS]: 'En cours',
  [STATUS.EN_ATTENTE]: 'En attente',
  [STATUS.ESCALADE]: 'Escalade',
  [STATUS.RESOLU]: 'Résolu',
  [STATUS.FERME]: 'Fermé',
};

/** Priorités de ticket */
export const PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
};

/** Libellés des priorités */
export const PRIORITY_LABELS = {
  [PRIORITY.CRITICAL]: 'Critique',
  [PRIORITY.HIGH]: 'Haute',
  [PRIORITY.NORMAL]: 'Normale',
  [PRIORITY.LOW]: 'Basse',
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
};
