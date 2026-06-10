import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  IconTicket, 
  IconAlertTriangle, 
  IconCheckbox, 
  IconHeart, 
  IconPlus 
} from '@tabler/icons-react';
import { fetchTickets } from '../../app/slices/ticketSlice';
import { calculateSLA } from '../../utils/slaUtils';
import MetricCard from '../../components/dashboard/MetricCard';
import TicketCard from '../../components/tickets/TicketCard';
import Button from '../../components/ui/Button';

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: tickets, loading } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  // Filtrer les tickets pour l'utilisateur connecté
  const myTickets = tickets.filter(t => t.creatorId === user?.id || t.creator?.id === user?.id);

  // Calculer les métriques
  const openTickets = myTickets.filter(t => t.status !== 'resolu' && t.status !== 'ferme');
  
  const riskTicketsCount = openTickets.filter(t => {
    const { rawPercentage } = calculateSLA(t.createdAt, t.slaLimitHours, t.closedAt);
    return rawPercentage >= 70 && rawPercentage < 100;
  }).length;

  const resolvedThisMonth = myTickets.filter(t => t.status === 'resolu' || t.status === 'ferme').length;

  const recentTickets = myTickets.slice(0, 3); // Max 3 récents

  return (
    <div className="animate-fade-in">
      <div 
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}
      >
        <div>
          <h1 className="m-0">Ravi de vous revoir, {user?.name} 👋</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Voici un aperçu de vos demandes d'assistance en cours.
          </p>
        </div>
        <Link to="/tickets/new" style={{ textDecoration: 'none' }}>
          <Button variant="primary" leftIcon={<IconPlus size={18} />}>
            Créer un ticket
          </Button>
        </Link>
      </div>

      {/* Cartes métriques */}
      <div className="row g-3 mb-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="Demandes ouvertes"
            value={openTickets.length}
            subLabel={`+${myTickets.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length} aujourd'hui`}
            color="var(--color-600)"
            icon={IconTicket}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="SLA en risque"
            value={riskTicketsCount}
            subLabel={riskTicketsCount > 0 ? "Action urgente" : "Aucun risque"}
            color="var(--color-critical)"
            icon={IconAlertTriangle}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="Résolus ce mois"
            value={resolvedThisMonth}
            subLabel="Objectif mensuel atteint"
            color="var(--color-low)"
            icon={IconCheckbox}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <MetricCard
            label="Score de satisfaction"
            value="94%"
            subLabel="Service client TicketFlow"
            color="var(--color-high)"
            icon={IconHeart}
          />
        </div>
      </div>

      {/* Tickets Récents */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2 className="m-0" style={{ fontSize: '18px', fontWeight: 500 }}>Vos demandes récentes</h2>
            <Link to="/tickets" style={{ color: 'var(--color-600)', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' }}>
              Voir toutes mes demandes →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Chargement de vos demandes...
            </div>
          ) : recentTickets.length === 0 ? (
            <div 
              className="tf-card" 
              style={{ 
                padding: 'var(--spacing-2xl)', 
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}
            >
              <IconTicket size={40} style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-sm)' }} />
              <p style={{ margin: '0 0 var(--spacing-md) 0' }}>Vous n'avez aucun ticket de support actif.</p>
              <Link to="/tickets/new" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm">Créer votre premier ticket</Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {recentTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
