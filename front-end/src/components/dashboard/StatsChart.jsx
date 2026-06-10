import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

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

/**
 * Composant graphiques analytiques Recharts pour le Dashboard Admin
 */
export function StatsChart() {
  return (
    <div className="row g-4" style={{ marginTop: 'var(--spacing-md)' }}>
      {/* Graphique de tendance */}
      <div className="col-12 col-xl-8">
        <div className="tf-card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: 'var(--spacing-md)' }}>
            Activité hebdomadaire (Créés vs Résolus)
          </h3>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-600)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-600)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-low)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-low)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-secondary)" />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                />
                <Legend style={{ fontSize: '12px' }} />
                <Area 
                  type="monotone" 
                  dataKey="créés" 
                  stroke="var(--color-600)" 
                  fillOpacity={1} 
                  fill="url(#colorCreated)" 
                  name="Tickets Créés"
                />
                <Area 
                  type="monotone" 
                  dataKey="résolus" 
                  stroke="var(--color-low)" 
                  fillOpacity={1} 
                  fill="url(#colorResolved)" 
                  name="Tickets Résolus"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graphique de distribution par priorités */}
      <div className="col-12 col-xl-4">
        <div className="tf-card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: 'var(--spacing-md)' }}>
            Répartition par Priorité
          </h3>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRIORITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-secondary)" />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                  cursor={{ fill: 'var(--bg-secondary)', opacity: 0.5 }}
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
  );
}

export default StatsChart;
