import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  IconTicket, 
  IconAlertOctagon, 
  IconCheckbox, 
  IconUser,
  IconArrowRight
} from '@tabler/icons-react';
import { fetchTickets } from '../../app/slices/ticketSlice';
import { calculateSLA } from '../../utils/slaUtils';
import MetricCard from '../../components/dashboard/MetricCard';
import TicketCard from '../../components/tickets/TicketCard';

export function AgentDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: tickets, loading } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  // Filtrer les tickets assignés à l'agent connecté
  const assignedTickets = tickets.filter(t => 
    t.assignedToIds?.includes(user?.id) || 
    (t.assigned_users && t.assigned_users.some(u => u.id === user?.id))
  );

  // Calculer les métriques
  const myOpenTickets = assignedTickets.filter(t => t.status !== 'resolu' && t.status !== 'ferme');
  
  const breachedTicketsCount = myOpenTickets.filter(t => {
    const { isBreached } = calculateSLA(t.createdAt, t.slaLimitHours, t.closedAt);
    return isBreached;
  }).length;

  const myResolvedCount = assignedTickets.filter(t => t.status === 'resolu' || t.status === 'ferme').length;

  return (
    <div className="animate-fade-in">
      <div className="mb-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 className="m-0">Console Agent — {user?.name} 🎧</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Suivez vos engagements de support SLA et gérez les requêtes en cours d'instruction.
        </p>
      </div>

      {/* Cartes métriques */}
      <div className="row g-3 mb-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="Mes tickets ouverts"
            value={myOpenTickets.length}
            subLabel="À traiter en priorité"
            color="var(--color-600)"
            icon={IconTicket}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="SLA dépassé"
            value={breachedTicketsCount}
            subLabel={breachedTicketsCount > 0 ? "Action urgente requise !" : "Aucun retard"}
            color="var(--color-critical)"
            icon={IconAlertOctagon}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="Résolus ce mois"
            value={myResolvedCount}
            subLabel="Taux d'efficacité"
            color="var(--color-low)"
            icon={IconCheckbox}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="Conformité SLA"
            value="98.2%"
            subLabel="Objectif cible : 95%"
            color="var(--color-high)"
            icon={IconUser}
          />
        </div>
      </div>

      {/* Récents assignés */}
      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2 className="m-0" style={{ fontSize: '18px', fontWeight: 500 }}>Mes tickets assignés</h2>
            <Link to="/tickets" style={{ color: 'var(--color-600)', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' }}>
              Voir toute la file de tickets →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Chargement de vos tickets...
            </div>
          ) : myOpenTickets.length === 0 ? (
            <div 
              className="tf-card" 
              style={{ 
                padding: 'var(--spacing-2xl)', 
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}
            >
              <IconCheckbox size={40} style={{ color: 'var(--color-low)', marginBottom: 'var(--spacing-sm)' }} />
              <p style={{ margin: '0 0 var(--spacing-sm) 0', fontWeight: 'bold' }}>Aucune tâche en attente !</p>
              <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                Tous vos tickets assignés ont été résolus ou clôturés.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {myOpenTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Console générale infos */}
        <div className="col-12 col-lg-4">
          <div className="tf-card" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500, borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              Rappels d'équipe
            </h3>
            
            <ul style={{ padding: '0 0 0 20px', margin: '0', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <li>
                Priorisez les tickets marqués <strong>Critique (P1)</strong> en moins de 1h (SLA).
              </li>
              <li>
                Ajoutez toujours une <strong>Note interne</strong> pour documenter vos actions d'escalade.
              </li>
              <li>
                Vérifiez la liste globale pour prendre en charge les tickets non assignés.
              </li>
            </ul>

            <div style={{ marginTop: 'var(--spacing-xl)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-md)' }}>
              <Link to="/tickets" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-600)', fontSize: '13px', fontWeight: 'bold' }}>
                Accéder à la file globale de support
                <IconArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;
