import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconUser,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUserOff,
  IconUserCheck,
  IconKey
} from '@tabler/icons-react';
import { fetchUsers, createUser, updateUser, deleteUser, suspendUser } from '../../app/slices/userSlice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import FormField from '../../components/ui/FormField';
import Modal from '../../components/ui/Modal';
import toast from '../../components/ui/Toast';

const ROLES = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'agent', label: 'Agent Support' },
  { value: 'admin', label: 'Administrateur' },
];

export function UsersManagement() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nom requis';
    if (!formData.email) errs.email = 'Email requis';
    if (!editingUser && !formData.password) errs.password = 'Mot de passe requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setFormData({ name: '', email: '', role: 'user', password: '' });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser.id, ...formData })).unwrap();
        toast.success('Utilisateur mis à jour');
      } else {
        await dispatch(createUser(formData)).unwrap();
        toast.success('Utilisateur créé');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) return;
    try {
      await dispatch(deleteUser(user.id)).unwrap();
      toast.success('Utilisateur supprimé');
    } catch (err) {
      toast.error('Impossible de supprimer l\'utilisateur');
    }
  };

  const handleSuspend = async (user) => {
    const action = user.isSuspended ? 'réactiver' : 'suspendre';
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} ${user.name} ?`)) return;
    try {
      await dispatch(suspendUser(user.id)).unwrap();
      toast.success(`Utilisateur ${action === 'suspendre' ? 'suspendu' : 'réactivé'}`);
    } catch (err) {
      toast.error(`Impossible de ${action} l'utilisateur`);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Gestion des Utilisateurs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Créez, modifiez et gérez les comptes et les permissions des utilisateurs.
          </p>
        </div>
        <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => handleOpenModal()}>
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="tf-card">
        <div className="tf-table-container">
          <table className="tf-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    Chargement...
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <Avatar name={user.name} role={user.role} size="md" />
                      <div>
                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Badge 
                      variant={user.role === 'admin' ? 'critical' : user.role === 'agent' ? 'primary' : 'low'} 
                      text={ROLES.find(r => r.value === user.role)?.label} 
                    />
                  </td>
                  <td>
                    <Badge 
                      variant={user.isSuspended ? 'critical' : 'low'} 
                      text={user.isSuspended ? 'Suspendu' : 'Actif'} 
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--color-600)' }}
                        title="Modifier"
                      >
                        <IconEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleSuspend(user)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: user.isSuspended ? 'var(--color-low)' : 'var(--color-high)' }}
                        title={user.isSuspended ? "Réactiver" : "Suspendre"}
                      >
                        {user.isSuspended ? <IconUserCheck size={18} /> : <IconUserOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--color-critical)' }}
                        title="Supprimer"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Nom complet"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Jean Dupont"
          />
          <FormField
            label="Adresse email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="jean.dupont@exemple.com"
          />
          <FormField
            label="Rôle"
            type="select"
            options={ROLES}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <FormField
            label="Mot de passe"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            placeholder={editingUser ? "Laisser vide pour conserver" : "Mot de passe initial"}
            leftIcon={<IconKey size={18} />}
          />
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              {editingUser ? "Enregistrer" : "Créer l'utilisateur"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UsersManagement;
