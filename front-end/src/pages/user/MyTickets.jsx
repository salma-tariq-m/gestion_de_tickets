import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { IconSearch, IconFilterOff, IconPlus, IconMoodEmpty } from '@tabler/icons-react';
import { fetchTickets, setFilter, resetFilters } from '../../app/slices/ticketSlice';
import { fetchCategories } from '../../app/slices/userSlice';
import TicketCard from '../../components/tickets/TicketCard';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';

export function MyTickets() {
  const dispatch = useDispatch();
  const { list: tickets, filters, loading } = useSelector((state) => state.tickets);
  const { categories } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchTickets(filters));
    dispatch(fetchCategories());
  }, [dispatch, filters]);

  const handleFilterChange = (name, value) => {
    dispatch(setFilter({ [name]: value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const statusOptions = [
    { value: 'nouveau', label: 'Nouveau' },
    { value: 'en-cours', label: 'En cours' },
    { value: 'en-attente', label: 'En attente' },
    { value: 'escalade', label: 'Escalade' },
    { value: 'resolu', label: 'Résolu' },
    { value: 'ferme', label: 'Fermé' },
  ];

  const priorityOptions = [
    { value: 'critical', label: 'Critique' },
    { value: 'high', label: 'Haute' },
    { value: 'normal', label: 'Normale' },
    { value: 'low', label: 'Basse' },
  ];

  const categoryOptions = categories.map(c => ({
    value: String(c.id),
    label: c.name
  }));

  return (
    <div className="animate-fade-in">
      <div 
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}
      >
        <div>
          <h1 className="m-0">Mes demandes de support</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Consultez et suivez l'évolution de vos tickets d'assistance.
          </p>
        </div>
        <Link to="/tickets/new" style={{ textDecoration: 'none' }}>
          <Button variant="primary" leftIcon={<IconPlus size={18} />}>
            Créer un ticket
          </Button>
        </Link>
      </div>

      {/* Barre de filtres */}
      <div className="tf-card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <FormField
              type="text"
              placeholder="Rechercher par ID ou mot-clé..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="m-0"
              style={{ height: '38px' }}
            />
          </div>
          
          <div className="col-12 col-sm-6 col-md-2">
            <FormField
              type="select"
              placeholder="Statut (tous)"
              options={statusOptions}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="m-0"
              style={{ height: '38px' }}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-2">
            <FormField
              type="select"
              placeholder="Priorité (toutes)"
              options={priorityOptions}
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="m-0"
              style={{ height: '38px' }}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-2">
            <FormField
              type="select"
              placeholder="Catégorie (toutes)"
              options={categoryOptions}
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="m-0"
              style={{ height: '38px' }}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-2 d-flex align-items-end" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button
              variant="ghost"
              onClick={handleReset}
              style={{ width: '100%', gap: '4px' }}
              leftIcon={<IconFilterOff size={16} />}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      {/* Liste des tickets */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Chargement de vos tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div 
          className="tf-card" 
          style={{ 
            padding: 'var(--spacing-2xl)', 
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          <IconMoodEmpty size={44} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-sm)' }} />
          <h3>Aucun ticket trouvé</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto var(--spacing-md)', fontSize: '13px' }}>
            Aucune demande ne correspond à vos critères de filtrage actuels. Essayez d'élargir votre recherche.
          </p>
          <Button variant="secondary" onClick={handleReset} size="sm">
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTickets;
