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
  Legend,
  Cell
} from 'recharts';
import { fetchTickets } from '../../app/slices/ticketSlice';
import { fetchUsers } from '../../app/slices/userSlice';
import MetricCard from '../../components/dashboard/MetricCard';

const TREND_DATA = [
  { day: 'Lun', créés: 4, résolus: 3 },
  { day: 'Mar', créés: 7, résolus: 5 },
  { day: 'Mer', créés: 5, résolus: 6 },
  { day: 'Jeu', créés: 8, résolus: 4 },
  { day: 'Ven', créés: 12, résolus: 9 },
  { day: 'Sam', créés: 3, résolus: 5 },
  { day: 'Dim', créés: 2, résolus: 3 },
];

const PRIORITY_DATA = [
  { name: 'Critique', value: 3, color: '#E24B4A' },
  { name: 'Haute', value: 8, color: '#EF9F27' },
  { name: 'Normale', value: 15, color: '#378ADD' },
  { name: 'Basse', value: 10, color: '#639922' },
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
        <div className="col-12 col-lg-8">
          <div className="tf-card">
            <div className="d-flex align-items-center gap-2 mb-3">
              <IconChartLine size={20} style={{ color: 'var(--color-600)' }} />
              <h3 className="m-0">Activité hebdomadaire</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6F1FB" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95A5A6' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95A5A6' }} />
                  <Tooltip
                    contentStyle={{
                      fontFamily: 'Helvetica Neue, Arial, sans-serif',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="créés"
                    stroke="#185FA5"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Tickets Créés"
                  />
                  <Line
                    type="monotone"
                    dataKey="résolus"
                    stroke="#639922"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Tickets Résolus"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="tf-card" style={{ height: '100%' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <IconActivity size={20} style={{ color: 'var(--color-600)' }} />
              <h3 className="m-0">Répartition par Priorité</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={PRIORITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6F1FB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95A5A6' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95A5A6' }} />
                  <Tooltip
                    contentStyle={{
                      fontFamily: 'Helvetica Neue, Arial, sans-serif',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    cursor={{ fill: '#EEF3F9', opacity: 0.5 }}
                  />
                  <Bar dataKey="value" name="Nombre de tickets" radius={[4, 4, 0, 0]}>
                    {PRIORITY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
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
