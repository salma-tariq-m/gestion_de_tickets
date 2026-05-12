import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { useGetTicketsQuery } from './ticketsApi';
import { selectFilters, selectPage, setPage } from './ticketsSlice';
import { TicketFilters } from './TicketFilters';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { Table } from '../../components/ui/Table';
import { Avatar } from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { formatShort } from '../../utils/formatDate';

const col = createColumnHelper();

export default function TicketListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const page = useSelector(selectPage);

  const queryParams = useMemo(() => ({
    page,
    ...(filters.status && { status: filters.status }),
    ...(filters.priority && { priority: filters.priority }),
    ...(filters.keyword && { search: filters.keyword }),
    ...(filters.category && { category_id: filters.category }),
  }), [filters, page]);

  const { data, isLoading } = useGetTicketsQuery(queryParams);
  const tickets = data?.data || [];
  const meta = data?.meta || null;

  const columns = useMemo(() => [
    col.accessor('id', {
      header: t('tickets.id'),
      cell: (info) => <span className="font-mono text-xs text-gray-400">#{info.getValue()}</span>,
    }),
    col.accessor('title', {
      header: t('tickets.titleField'),
      cell: (info) => (
        <span className="font-medium text-gray-900 max-w-xs truncate block">{info.getValue()}</span>
      ),
    }),
    col.accessor('status', {
      header: t('tickets.status'),
      cell: (info) => <TicketStatusBadge status={info.getValue()} />,
    }),
    col.accessor('priority', {
      header: t('tickets.priority'),
      cell: (info) => <TicketPriorityBadge priority={info.getValue()} />,
    }),
    col.accessor('category', {
      header: t('tickets.category'),
      cell: (info) => (
        <span className="text-xs text-gray-600">{info.getValue()?.name || '—'}</span>
      ),
    }),
    col.accessor('assigned_to', {
      header: t('tickets.assignedTo'),
      cell: (info) => {
        const user = info.getValue();
        return user ? (
          <div className="flex items-center gap-2">
            <Avatar name={user.name} size="xs" />
            <span className="text-xs text-gray-600 truncate max-w-[100px]">{user.name}</span>
          </div>
        ) : <span className="text-gray-300 text-xs">—</span>;
      },
    }),
    col.accessor('created_at', {
      header: t('tickets.createdAt'),
      cell: (info) => <span className="text-xs text-gray-500">{formatShort(info.getValue())}</span>,
    }),
  ], [t]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('tickets.title')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {meta ? `${meta.total} ticket${meta.total > 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <Button
          onClick={() => navigate('/tickets/new')}
          leftIcon={<Plus size={16} />}
        >
          {t('tickets.new')}
        </Button>
      </div>

      {/* Filters */}
      <TicketFilters />

      {/* Table */}
      <Table
        columns={columns}
        data={tickets}
        isLoading={isLoading}
        meta={meta}
        page={page}
        onPageChange={(p) => dispatch(setPage(p))}
        onRowClick={(row) => navigate(`/tickets/${row.id}`)}
      />
    </div>
  );
}
