import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useGetCategoriesQuery, useCreateCategoryMutation,
  useUpdateCategoryMutation, useDeleteCategoryMutation,
} from './adminApi';
import { Table } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { formatShort } from '../../utils/formatDate';

const col = createColumnHelper();

const schema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères'),
});

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const openCreate = () => { setEditCat(null); reset({ name: '' }); setModalOpen(true); };
  const openEdit = (c) => { setEditCat(c); reset({ name: c.name }); setModalOpen(true); };

  const onSubmit = async (data) => {
    const action = editCat
      ? updateCategory({ id: editCat.id, ...data }).unwrap()
      : createCategory(data).unwrap();
    toast.promise(action, {
      loading: editCat ? 'Mise à jour…' : 'Création…',
      success: () => { setModalOpen(false); return editCat ? 'Catégorie modifiée' : 'Catégorie créée'; },
      error: (err) => err?.data?.message || t('common.error'),
    });
  };

  const handleDelete = () => {
    toast.promise(deleteCategory(deleteConfirm.id).unwrap(), {
      loading: 'Suppression…',
      success: () => { setDeleteConfirm(null); return 'Catégorie supprimée'; },
      error: () => t('common.error'),
    });
  };

  const columns = useMemo(() => [
    col.accessor('id', {
      header: '#',
      cell: (info) => <span className="font-mono text-xs text-gray-400">#{info.getValue()}</span>,
    }),
    col.accessor('name', {
      header: t('admin.categoryName'),
      cell: (info) => <span className="font-medium text-gray-900 text-sm">{info.getValue()}</span>,
    }),
    col.accessor('created_at', {
      header: t('tickets.createdAt'),
      cell: (info) => <span className="text-xs text-gray-500">{info.getValue() ? formatShort(info.getValue()) : '—'}</span>,
    }),
    col.display({
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(row.original)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Modifier">
            <Pencil size={14} />
          </button>
          <button onClick={() => setDeleteConfirm(row.original)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Supprimer">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    }),
  ], [t]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('admin.categories')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />}>{t('admin.createCategory')}</Button>
      </div>

      <Table columns={columns} data={categories} isLoading={isLoading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCat ? t('admin.editCategory') : t('admin.createCategory')} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input id="cat-name" label={t('admin.categoryName')} error={errors.name?.message} {...register('name')} />
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" isLoading={creating || updating}>{editCat ? t('common.save') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title={t('admin.editCategory')} size="sm">
        <p className="text-sm text-gray-600 mb-4">{t('admin.deleteConfirm')}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>{t('common.delete')}</Button>
        </div>
      </Modal>
    </div>
  );
}
