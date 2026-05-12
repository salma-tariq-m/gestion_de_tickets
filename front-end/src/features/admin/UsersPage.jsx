import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from './adminApi';
import { Table } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ROLES } from '../../utils/constants';

const col = createColumnHelper();

const userSchema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Min 8 caractères').optional().or(z.literal('')),
  role: z.enum(['admin', 'agent', 'user']),
});

const roleOptions = [
  { value: ROLES.USER, label: 'Utilisateur' },
  { value: ROLES.AGENT, label: 'Agent' },
  { value: ROLES.ADMIN, label: 'Admin' },
];

const roleBadge = { admin: 'error', agent: 'warning', user: 'info' };

export default function UsersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading } = useGetUsersQuery({ page });
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const users = data?.data || [];
  const meta = data?.meta || null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { role: 'user' },
  });

  const openCreate = () => { setEditUser(null); reset({ name: '', email: '', password: '', role: 'user' }); setModalOpen(true); };
  const openEdit = (u) => { setEditUser(u); reset({ name: u.name, email: u.email, password: '', role: u.role }); setModalOpen(true); };

  const onSubmit = async (data) => {
    const body = { ...data };
    if (!body.password) delete body.password;
    const action = editUser
      ? updateUser({ id: editUser.id, ...body }).unwrap()
      : createUser(body).unwrap();
    toast.promise(action, {
      loading: editUser ? 'Mise à jour…' : 'Création…',
      success: () => { setModalOpen(false); return editUser ? 'Utilisateur modifié' : 'Utilisateur créé'; },
      error: (err) => err?.data?.message || t('common.error'),
    });
  };

  const handleToggleActive = (u) => {
    toast.promise(updateUser({ id: u.id, active: !u.active }).unwrap(), {
      loading: 'Mise à jour…',
      success: u.active ? 'Utilisateur désactivé' : 'Utilisateur activé',
      error: () => t('common.error'),
    });
  };

  const handleDelete = async () => {
    toast.promise(deleteUser(deleteConfirm.id).unwrap(), {
      loading: 'Suppression…',
      success: () => { setDeleteConfirm(null); return 'Utilisateur supprimé'; },
      error: () => t('common.error'),
    });
  };

  const columns = useMemo(() => [
    col.accessor('name', {
      header: 'Nom',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Avatar name={info.getValue()} size="sm" />
          <span className="font-medium text-gray-900 text-sm">{info.getValue()}</span>
        </div>
      ),
    }),
    col.accessor('email', {
      header: 'Email',
      cell: (info) => <span className="text-sm text-gray-600">{info.getValue()}</span>,
    }),
    col.accessor('role', {
      header: t('admin.role'),
      cell: (info) => (
        <Badge variant={roleBadge[info.getValue()] || 'default'} size="xs">
          {info.getValue()}
        </Badge>
      ),
    }),
    col.accessor('active', {
      header: 'Statut',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'success' : 'default'} size="xs">
          {info.getValue() ? t('admin.active') : t('admin.inactive')}
        </Badge>
      ),
    }),
    col.display({
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(row.original)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Modifier">
            <Pencil size={14} />
          </button>
          <button onClick={() => handleToggleActive(row.original)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title={row.original.active ? 'Désactiver' : 'Activer'}>
            {row.original.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
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
          <h2 className="text-xl font-bold text-gray-900">{t('admin.users')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{meta?.total ?? 0} utilisateurs</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />}>{t('admin.createUser')}</Button>
      </div>

      <Table columns={columns} data={users} isLoading={isLoading} meta={meta} page={page} onPageChange={setPage} />

      {/* Create/Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? t('admin.editUser') : t('admin.createUser')} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input id="u-name" label="Nom complet" error={errors.name?.message} {...register('name')} />
          <Input id="u-email" type="email" label="Email" error={errors.email?.message} {...register('email')} />
          <Input id="u-password" type="password" label={editUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'} error={errors.password?.message} {...register('password')} />
          <Select id="u-role" label={t('admin.role')} options={roleOptions} error={errors.role?.message} {...register('role')} />
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" isLoading={creating || updating}>{editUser ? t('common.save') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title={t('admin.deleteUser')} size="sm">
        <p className="text-sm text-gray-600 mb-4">{t('admin.deleteConfirm')}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>{t('common.delete')}</Button>
        </div>
      </Modal>
    </div>
  );
}
