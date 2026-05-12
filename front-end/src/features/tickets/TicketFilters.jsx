import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, X } from 'lucide-react';
import { setFilter, resetFilters, selectFilters } from './ticketsSlice';
import { useGetCategoriesQuery } from '../admin/adminApi';
import { STATUS, PRIORITY, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

/**
 * Barre de filtres active pour la liste des tickets.
 */
export function TicketFilters() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const debouncedKeyword = useDebounce(keyword, 300);
  const { data: categories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    dispatch(setFilter({ key: 'keyword', value: debouncedKeyword }));
  }, [debouncedKeyword, dispatch]);

  const statusOptions = [
    { value: '', label: t('common.all') },
    ...Object.values(STATUS).map((s) => ({ value: s, label: STATUS_LABELS[s] })),
  ];

  const priorityOptions = [
    { value: '', label: t('common.all') },
    ...Object.values(PRIORITY).map((p) => ({ value: p, label: PRIORITY_LABELS[p] })),
  ];

  const categoryOptions = [
    { value: '', label: t('common.all') },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const hasActiveFilters =
    filters.status || filters.priority || filters.keyword || filters.dateFrom;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <SlidersHorizontal size={15} className="text-indigo-500" />
          {t('common.filters')}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => { dispatch(resetFilters()); setKeyword(''); }}
            leftIcon={<X size={12} />}
          >
            {t('common.reset')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Keyword search */}
        <Input
          id="filter-keyword"
          placeholder={t('tickets.searchPlaceholder')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          leftIcon={<Search size={14} />}
        />

        {/* Status */}
        <Select
          id="filter-status"
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => dispatch(setFilter({ key: 'status', value: e.target.value || null }))}
          placeholder={t('tickets.filterByStatus')}
        />

        {/* Priority */}
        <Select
          id="filter-priority"
          options={priorityOptions}
          value={filters.priority || ''}
          onChange={(e) => dispatch(setFilter({ key: 'priority', value: e.target.value || null }))}
          placeholder={t('tickets.filterByPriority')}
        />

        {/* Category */}
        <Select
          id="filter-category"
          options={categoryOptions}
          value={filters.category || ''}
          onChange={(e) => dispatch(setFilter({ key: 'category', value: e.target.value || null }))}
          placeholder={t('tickets.category')}
        />
      </div>
    </div>
  );
}

export default TicketFilters;
