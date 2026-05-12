import { useTranslation } from 'react-i18next';
import { Ticket, FolderOpen, Clock, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useGetSummaryQuery } from './dashboardApi';
import { Spinner } from '../../components/ui/Spinner';
import { cn } from '../../utils/cn';

/**
 * Carte KPI.
 */
function KpiCard({ label, value, icon: Icon, colorClass, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', colorClass)}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">
          {value ?? <span className="animate-pulse text-gray-300">—</span>}
        </p>
        {trend !== undefined && (
          <p className={cn('text-xs mt-1', trend >= 0 ? 'text-emerald-600' : 'text-red-500')}>
            {trend >= 0 ? '+' : ''}{trend}% ce mois
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: summary, isLoading } = useGetSummaryQuery();

  const kpis = [
    {
      label: t('dashboard.total'),
      value: summary ? (summary.open + summary.in_progress + summary.resolved + summary.closed) : null,
      icon: Ticket,
      colorClass: 'bg-indigo-500',
    },
    {
      label: t('dashboard.open'),
      value: summary?.open,
      icon: FolderOpen,
      colorClass: 'bg-blue-500',
    },
    {
      label: t('dashboard.inProgress'),
      value: summary?.in_progress,
      icon: Clock,
      colorClass: 'bg-orange-500',
    },
    {
      label: t('dashboard.resolved'),
      value: summary?.resolved,
      icon: CheckCircle,
      colorClass: 'bg-emerald-500',
    },
  ];

  const barData = summary ? [
    { name: 'Ouvert', value: summary.open, fill: '#3b82f6' },
    { name: 'En cours', value: summary.in_progress, fill: '#f97316' },
    { name: 'Résolu', value: summary.resolved, fill: '#10b981' },
    { name: 'Fermé', value: summary.closed, fill: '#9ca3af' },
  ] : [];

  const lineData = summary?.daily || [];

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('dashboard.byStatus')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Tickets" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('dashboard.last30Days')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Tickets"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
