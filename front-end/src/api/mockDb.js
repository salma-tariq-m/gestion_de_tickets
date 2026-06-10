// Base de données simulée dans le LocalStorage pour un mode démo interactif autonome.

const INITIAL_USERS = [
  { id: 1, name: "Alice Admin", email: "admin@ticketflow.com", role: "admin", status: "active" },
  { id: 2, name: "Bob Agent", email: "agent@ticketflow.com", role: "agent", status: "active" },
  { id: 3, name: "Charlie Manager", email: "manager@ticketflow.com", role: "manager", status: "active" },
  { id: 4, name: "David Client", email: "client@ticketflow.com", role: "user", status: "active" },
  { id: 5, name: "Eva Client", email: "eva@ticketflow.com", role: "client", status: "active" }
];

const INITIAL_CATEGORIES = [
  { id: 1, name: "Support Technique" },
  { id: 2, name: "Facturation & Paiement" },
  { id: 3, name: "Demande Générale" }
];

const INITIAL_TICKETS = [
  {
    id: "TKT-2026-00001",
    title: "Base de données inaccessible - Production bloquée",
    description: "Le serveur de base de données PostgreSQL ne répond plus depuis 30 minutes. Toutes les requêtes HTTP se terminent par une erreur 504 Gateway Timeout. L'équipe technique doit intervenir d'urgence.",
    priority: "critical",
    status: "escalade",
    categoryId: 1,
    creatorId: 4,
    assignedToIds: [2, 3], // Bob Agent et Charlie Manager
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 heures de moins
    slaLimitHours: 1, // SLA de 1h
    closedAt: null,
  },
  {
    id: "TKT-2026-00002",
    title: "Problème d'accès au portail de facturation",
    description: "Impossible de télécharger nos dernières factures. Une erreur de permission apparaît dès qu'on clique sur le bouton de téléchargement PDF. Merci de vérifier nos droits d'accès.",
    priority: "high",
    status: "en-cours",
    categoryId: 2,
    creatorId: 5,
    assignedToIds: [2],
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4h de moins
    slaLimitHours: 5, // SLA de 5h -> 4h écoulées = 80% (SLA à risque orange)
    closedAt: null,
  },
  {
    id: "TKT-2026-00003",
    title: "Demande d'explications sur les formules d'abonnement",
    description: "Bonjour, nous aimerions obtenir plus de détails concernant la formule d'abonnement Enterprise et l'inclusion des heures de support. Avez-vous une plaquette commerciale détaillée ?",
    priority: "normal",
    status: "nouveau",
    categoryId: 3,
    creatorId: 4,
    assignedToIds: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30min de moins
    slaLimitHours: 8, // SLA de 8h -> 30min écoulées = 6.25% (SLA vert)
    closedAt: null,
  },
  {
    id: "TKT-2026-00004",
    title: "Mise à jour des coordonnées de l'entreprise",
    description: "Veuillez mettre à jour l'adresse de facturation de notre compte entreprise : 12 Ruelle des Marguerites, 75001 Paris. Merci !",
    priority: "low",
    status: "resolu",
    categoryId: 3,
    creatorId: 5,
    assignedToIds: [2],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // 2 jours de moins
    slaLimitHours: 24,
    closedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  }
];

const INITIAL_COMMENTS = [
  {
    id: 1,
    ticketId: "TKT-2026-00001",
    authorId: 4,
    content: "Nous subissons des pertes de vente à cause de cela. Pouvez-vous nous aider ?",
    isInternal: false,
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    ticketId: "TKT-2026-00001",
    authorId: 3,
    content: "Le cluster primaire PostgreSQL semble figé. Je tente un redémarrage forcé.",
    isInternal: true,
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    ticketId: "TKT-2026-00001",
    authorId: 2,
    content: "Le redémarrage a échoué. Le service de stockage réseau rencontre également des latences. J'escalade le ticket aux administrateurs systèmes.",
    isInternal: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    ticketId: "TKT-2026-00002",
    authorId: 2,
    content: "Bonjour. J'ai bien reçu votre demande. Je vérifie les habilitations de votre entreprise dans la console Stripe.",
    isInternal: false,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  }
];

const INITIAL_NOTIFS = [
  {
    id: 1,
    userId: 2, // Agent Bob
    message: "Nouveau ticket critique assigné d'urgence : #TKT-2026-00001",
    type: "critical", // dot #E24B4A
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 2,
    userId: 2,
    message: "Alerte SLA : Le ticket #TKT-2026-00002 approche de sa limite.",
    type: "sla_risk", // dot #EF9F27
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    userId: 4, // David Client
    message: "Votre ticket #TKT-2026-00004 a été marqué comme résolu.",
    type: "resolved", // dot #639922
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

// Initialisation des données locales
export const initMockDb = () => {
  if (!localStorage.getItem("tf_users")) {
    localStorage.setItem("tf_users", JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem("tf_categories")) {
    localStorage.setItem("tf_categories", JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem("tf_tickets")) {
    localStorage.setItem("tf_tickets", JSON.stringify(INITIAL_TICKETS));
  }
  if (!localStorage.getItem("tf_comments")) {
    localStorage.setItem("tf_comments", JSON.stringify(INITIAL_COMMENTS));
  }
  if (!localStorage.getItem("tf_notifications")) {
    localStorage.setItem("tf_notifications", JSON.stringify(INITIAL_NOTIFS));
  }
};

// Lecture helper
const getTable = (name) => {
  initMockDb();
  return JSON.parse(localStorage.getItem(name));
};

// Écriture helper
const saveTable = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data));
};

export const mockDb = {
  // ── AUTH ──
  login: (email, password) => {
    const users = getTable("tf_users");
    const user = users.find(u => u.email === email.trim().toLowerCase());
    if (!user) throw new Error("Identifiants incorrects");
    if (user.status !== "active") throw new Error("Votre compte a été suspendu");
    
    const token = `mock-token-${user.id}-${Date.now()}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  },
  
  register: (name, email, password) => {
    const users = getTable("tf_users");
    if (users.find(u => u.email === email.trim().toLowerCase())) {
      throw new Error("Cet email est déjà enregistré");
    }
    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email: email.trim().toLowerCase(),
      role: "user", // par défaut client/user
      status: "active"
    };
    users.push(newUser);
    saveTable("tf_users", users);
    
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));
    return { token, user: newUser };
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // ── TICKETS ──
  getTickets: (filters = {}, currentUser) => {
    let tickets = getTable("tf_tickets");
    const users = getTable("tf_users");
    const categories = getTable("tf_categories");
    const comments = getTable("tf_comments");

    // Mapper les tickets avec les détails des objets reliés
    let mapped = tickets.map(t => {
      const creator = users.find(u => u.id === t.creatorId);
      const category = categories.find(c => c.id === t.categoryId);
      const assignedTo = t.assignedToIds.map(id => users.find(u => u.id === id)).filter(Boolean);
      const tComments = comments.filter(c => c.ticketId === t.id);
      
      return {
        ...t,
        creator,
        category,
        assigned_to: assignedTo.length > 0 ? assignedTo[0] : null, // Pour rétro-compatibilité
        assigned_users: assignedTo, // Multi-assignation
        comments_count: tComments.length
      };
    });

    // Filtre par rôle
    if (currentUser && currentUser.role === "user") {
      mapped = mapped.filter(t => t.creatorId === currentUser.id);
    } else if (currentUser && currentUser.role === "agent") {
      // Les agents peuvent voir tous les tickets, mais on peut vouloir filtrer les siens
      if (filters.myTicketsOnly) {
        mapped = mapped.filter(t => t.assignedToIds.includes(currentUser.id));
      }
    }

    // Filtres généraux
    if (filters.status) {
      mapped = mapped.filter(t => t.status === filters.status);
    }
    if (filters.priority) {
      mapped = mapped.filter(t => t.priority === filters.priority);
    }
    if (filters.categoryId) {
      mapped = mapped.filter(t => t.categoryId === parseInt(filters.categoryId));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      mapped = mapped.filter(t => 
        t.id.toLowerCase().includes(q) || 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    return mapped;
  },

  getTicketById: (id) => {
    const tickets = getTable("tf_tickets");
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) throw new Error("Ticket introuvable");

    const users = getTable("tf_users");
    const categories = getTable("tf_categories");
    
    const creator = users.find(u => u.id === ticket.creatorId);
    const category = categories.find(c => c.id === ticket.categoryId);
    const assignedTo = ticket.assignedToIds.map(uid => users.find(u => u.id === uid)).filter(Boolean);

    return {
      ...ticket,
      creator,
      category,
      assigned_users: assignedTo,
      assigned_to: assignedTo[0] || null
    };
  },

  createTicket: (ticketData, currentUser) => {
    const tickets = getTable("tf_tickets");
    const ticketIdNum = tickets.length ? Math.max(...tickets.map(t => {
      const parts = t.id.split("-");
      return parseInt(parts[2]);
    })) + 1 : 1;
    const formattedId = `TKT-2026-${String(ticketIdNum).padStart(5, "0")}`;

    // Associer une SLA par défaut en fonction de la priorité
    let slaLimitHours = 8;
    if (ticketData.priority === "critical") slaLimitHours = 1;
    else if (ticketData.priority === "high") slaLimitHours = 4;
    else if (ticketData.priority === "normal") slaLimitHours = 8;
    else slaLimitHours = 24;

    const newTicket = {
      id: formattedId,
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority || "normal",
      status: "nouveau",
      categoryId: parseInt(ticketData.category),
      creatorId: currentUser.id,
      assignedToIds: [],
      createdAt: new Date().toISOString(),
      slaLimitHours,
      closedAt: null,
      attachment: ticketData.attachment || null
    };

    tickets.unshift(newTicket); // Plus récent en haut
    saveTable("tf_tickets", tickets);

    // Créer une notification globale pour les agents
    const notifs = getTable("tf_notifications");
    const users = getTable("tf_users");
    const agents = users.filter(u => u.role === "agent" || u.role === "admin" || u.role === "manager");
    
    agents.forEach(agent => {
      notifs.unshift({
        id: notifs.length + 1,
        userId: agent.id,
        message: `Nouveau ticket ${newTicket.priority === "critical" ? "CRITIQUE" : ""} créé : ${newTicket.id}`,
        type: newTicket.priority === "critical" ? "critical" : "info",
        read: false,
        createdAt: new Date().toISOString()
      });
    });
    saveTable("tf_notifications", notifs);

    return newTicket;
  },

  updateTicket: (id, updates) => {
    const tickets = getTable("tf_tickets");
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Ticket introuvable");

    const oldTicket = tickets[index];
    const newTicket = { ...oldTicket, ...updates };

    if (updates.status === "resolu" || updates.status === "ferme") {
      newTicket.closedAt = new Date().toISOString();
    } else if (updates.status && updates.status !== oldTicket.status) {
      newTicket.closedAt = null; // Réouvert
    }

    tickets[index] = newTicket;
    saveTable("tf_tickets", tickets);

    // Générer une notification pour le créateur si le statut a changé
    if (updates.status && updates.status !== oldTicket.status) {
      const notifs = getTable("tf_notifications");
      notifs.unshift({
        id: notifs.length + 1,
        userId: oldTicket.creatorId,
        message: `Votre ticket ${id} est passé au statut : ${updates.status.toUpperCase()}`,
        type: updates.status === "resolu" ? "resolved" : "info",
        read: false,
        createdAt: new Date().toISOString()
      });
      saveTable("tf_notifications", notifs);
    }

    return newTicket;
  },

  // Réassignation multi-agents
  assignTicket: (id, userIds) => {
    const tickets = getTable("tf_tickets");
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Ticket introuvable");

    tickets[index].assignedToIds = userIds.map(uid => parseInt(uid));
    saveTable("tf_tickets", tickets);

    // Notifier les agents assignés
    const notifs = getTable("tf_notifications");
    userIds.forEach(uid => {
      notifs.unshift({
        id: notifs.length + 1,
        userId: parseInt(uid),
        message: `Vous avez été assigné au ticket : ${id}`,
        type: "info",
        read: false,
        createdAt: new Date().toISOString()
      });
    });
    saveTable("tf_notifications", notifs);

    return tickets[index];
  },

  // ── DISCUSSION ──
  getComments: (ticketId) => {
    const comments = getTable("tf_comments");
    const users = getTable("tf_users");
    
    return comments
      .filter(c => c.ticketId === ticketId)
      .map(c => {
        const author = users.find(u => u.id === c.authorId);
        return { ...c, author };
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // plus anciens en premier
  },

  addComment: (ticketId, commentData, currentUser) => {
    const comments = getTable("tf_comments");
    const newComment = {
      id: comments.length ? Math.max(...comments.map(c => c.id)) + 1 : 1,
      ticketId,
      authorId: currentUser.id,
      content: commentData.content,
      isInternal: commentData.isInternal || false,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    saveTable("tf_comments", comments);

    // Mettre à jour l'activité du ticket (Optionnel)
    return {
      ...newComment,
      author: currentUser
    };
  },

  // ── NOTIFICATIONS ──
  getNotifications: (userId) => {
    const notifs = getTable("tf_notifications");
    return notifs.filter(n => n.userId === userId);
  },

  markNotificationsRead: (userId) => {
    const notifs = getTable("tf_notifications");
    const updated = notifs.map(n => n.userId === userId ? { ...n, read: true } : n);
    saveTable("tf_notifications", updated);
    return updated.filter(n => n.userId === userId);
  },

  // ── ADMIN USER CRUD ──
  getUsers: () => {
    return getTable("tf_users");
  },

  createUser: (userData) => {
    const users = getTable("tf_users");
    if (users.find(u => u.email === userData.email.trim().toLowerCase())) {
      throw new Error("Cet email existe déjà");
    }
    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      role: userData.role || "user",
      status: userData.status || "active"
    };
    users.push(newUser);
    saveTable("tf_users", users);
    return newUser;
  },

  updateUser: (id, updates) => {
    const users = getTable("tf_users");
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Utilisateur introuvable");
    
    users[index] = { ...users[index], ...updates };
    saveTable("tf_users", users);
    return users[index];
  },

  deleteUser: (id) => {
    const users = getTable("tf_users");
    const filtered = users.filter(u => u.id !== id);
    saveTable("tf_users", filtered);
    return true;
  },

  // ── CATEGORIES CRUD ──
  getCategories: () => {
    return getTable("tf_categories");
  },

  createCategory: (catData) => {
    const cats = getTable("tf_categories");
    const newCat = {
      id: cats.length ? Math.max(...cats.map(c => c.id)) + 1 : 1,
      name: catData.name
    };
    cats.push(newCat);
    saveTable("tf_categories", cats);
    return newCat;
  },

  updateCategory: (id, updates) => {
    const cats = getTable("tf_categories");
    const index = cats.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Catégorie introuvable");

    cats[index] = { ...cats[index], ...updates };
    saveTable("tf_categories", cats);
    return cats[index];
  },

  deleteCategory: (id) => {
    const cats = getTable("tf_categories");
    const filtered = cats.filter(c => c.id !== id);
    saveTable("tf_categories", filtered);
    return true;
  }
};
