import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { IconSearch, IconFilterOff, IconEye, IconPlus } from '@tabler/icons-react';
import { fetchTickets, setFilter, resetFilters } from '../../app/slices/ticketSlice';
import { fetchCategories } from '../../app/slices/userSlice';
import { calculateSLA } from '../../utils/slaUtils';
import { formatShort } from '../../utils/formatDate';
import StatusBadge from '../../components/tickets/StatusBadge';
import PriorityBadge from '../../components/tickets/PriorityBadge';
import AvatarStack from '../../components/ui/AvatarStack';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';

export function AllTickets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          <h1 className="m-0">File d'attente des tickets</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Consultez, filtrez et réassignez les demandes de support globales.
          </p>
        </div>
      </div>

      {/* Barre de filtres combinés */}
      <div className="tf-card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-3">
            <FormField
              type="text"
              placeholder="Rechercher par ID ou sujet..."
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

          <div className="col-12 col-sm-6 col-md-2" style={{ display: 'flex', alignItems: 'center' }}>
            <label className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={filters.myTicketsOnly}
                onChange={(e) => handleFilterChange('myTicketsOnly', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>Mes tickets assignés</span>
            </label>
          </div>

          <div className="col-12 col-md-1">
            <Button
              variant="ghost"
              onClick={handleReset}
              style={{ width: '100%', height: '38px', padding: '0' }}
              title="Réinitialiser"
              leftIcon={<IconFilterOff size={16} />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Tableau des tickets */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Chargement des données...
        </div>
      ) : tickets.length === 0 ? (
        <div className="tf-card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <IconFilterOff size={40} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-sm)' }} />
          <h3>Aucun ticket ne correspond</h3>
          <p style={{ fontSize: '13px' }}>Modifiez vos filtres ou réinitialisez la recherche pour voir tous les tickets.</p>
        </div>
      ) : (
        <div className="tf-table-container animate-fade-in">
          <table className="tf-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>ID</th>
                <th>Sujet / Titre</th>
                <th>Créateur</th>
                <th>Catégorie</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>SLA Restant</th>
                <th>Assignation</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => {
                const { text, color, isBreached } = calculateSLA(t.createdAt, t.slaLimitHours, t.closedAt);
                const isClosed = t.status === 'resolu' || t.status === 'ferme';
                
                return (
                  <tr key={t.id}>
                    <td>
                      <span className="text-mono" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 'bold' }}>
                        #{t.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Créé le {formatShort(t.createdAt)}
                      </div>
                    </td>
                    <td>{t.creator?.name || 'Client'}</td>
                    <td>{t.category?.name || 'Général'}</td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>
                      {isClosed ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Résolu</span>
                      ) : (
                        <span style={{ fontSize: '12px', color: color, fontWeight: 'bold' }}>
                          {text}
                        </span>
                      )}
                    </td>
                    <td>
                      <AvatarStack users={t.assigned_users || []} size="sm" />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/tickets/${t.id}`)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-600)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                        title="Voir les détails"
                      >
                        <IconEye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllTickets;
