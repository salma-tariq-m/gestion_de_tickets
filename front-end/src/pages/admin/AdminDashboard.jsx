import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  IconUsers, 
  IconTicket, 
  IconClock, 
  IconTrophy,
  IconChartLine,
  IconActivity
} from '@tabler/icons-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { fetchTickets } from '../../app/slices/ticketSlice';
import { fetchUsers } from '../../app/slices/userSlice';
import MetricCard from '../../components/dashboard/MetricCard';

const data = [
  { name: 'Lun', tickets: 12, resolus: 10 },
  { name: 'Mar', tickets: 19, resolus: 15 },
  { name: 'Mer', tickets: 15, resolus: 18 },
  { name: 'Jeu', tickets: 22, resolus: 20 },
  { name: 'Ven', tickets: 30, resolus: 25 },
  { name: 'Sam', tickets: 10, resolus: 12 },
  { name: 'Dim', tickets: 8, resolus: 7 },
];

export function AdminDashboard() {
  const dispatch = useDispatch();
  const { list: tickets } = useSelector((state) => state.tickets);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchUsers());
  }, [dispatch]);

  const openTickets = tickets.filter(t => t.status !== 'resolu' && t.status !== 'ferme');
  const breachedCount = tickets.filter(t => t.isBreached).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1>Dashboard Global — Administration 🛡️</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Supervisez l'ensemble de l'activité du support et la performance des équipes.
        </p>
      </div>

      {/* Métriques globales */}
      <div className="tf-metrics-grid mb-4">
        <MetricCard
          label="Total utilisateurs"
          value={users.length}
          subLabel="Inscrits sur la plateforme"
          color="var(--color-600)"
          icon={IconUsers}
        />
        <MetricCard
          label="Tickets ouverts"
          value={openTickets.length}
          subLabel="Toutes équipes confondues"
          color="var(--color-400)"
          icon={IconTicket}
        />
        <MetricCard
          label="SLA en dépassement"
          value={breachedCount}
          subLabel="Action prioritaire requise"
          color="var(--color-critical)"
          icon={IconClock}
        />
        <MetricCard
          label="Taux de résolution"
          value="92.5%"
          subLabel="+2.4% vs mois dernier"
          color="var(--color-low)"
          icon={IconTrophy}
        />
      </div>

      <div className="row g-4">
        {/* Graphique de volume */}
        <div className="col-12 col-lg-8">
          <div className="tf-card">
            <div className="d-flex align-items-center gap-2 mb-4">
              <IconChartLine size={20} color="var(--color-600)" />
              <h3 className="m-0">Volume d'activité hebdomadaire</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6F1FB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95A5A6' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95A5A6' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="tickets" stroke="#185FA5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="resolus" stroke="#639922" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Distribution par rôle */}
        <div className="col-12 col-lg-4">
          <div className="tf-card" style={{ height: '100%' }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <IconActivity size={20} color="var(--color-600)" />
              <h3 className="m-0">Performance Équipes</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'Support N1', value: 85 },
                  { name: 'Support N2', value: 72 },
                  { name: 'Technique', value: 94 },
                ]} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="#378ADD" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
