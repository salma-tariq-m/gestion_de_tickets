import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  IconUserPlus, 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconBan,
  IconCheck
} from '@tabler/icons-react';
import { fetchUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../../app/slices/userSlice';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Avatar from '../../components/ui/Avatar';
import toast from '../../components/ui/Toast';

export function UsersManagement() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await dispatch(updateAdminUser({ id: user.id, updates: { status: newStatus } })).unwrap();
      toast.success(`Utilisateur ${newStatus === 'active' ? 'réactivé' : 'suspendu'}`);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await dispatch(deleteAdminUser(id)).unwrap();
      toast.success('Utilisateur supprimé');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Console Utilisateurs 👥</h1>
          <p style={{ color: 'var(--text-secondary)' }}>CRUD complet, activation/suspension des comptes.</p>
        </div>
        <Button variant="primary" leftIcon={<IconUserPlus size={18} />}>
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="tf-card mb-4" style={{ padding: 'var(--spacing-md)' }}>
        <div className="d-flex gap-2">
          <div style={{ flex: 1 }}>
            <FormField
              type="text"
              placeholder="Rechercher un utilisateur par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="m-0"
              leftIcon={<IconSearch size={18} />}
            />
          </div>
        </div>
      </div>

      <div className="tf-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>UTILISATEUR</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>RÔLE</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>STATUT</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>DERNIÈRE ACTIVITÉ</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <Avatar name={user.name} role={user.role} size="md" />
                    <div className="d-flex flex-column">
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>{user.name}</span>
                      <span className="tiny" style={{ color: 'var(--text-tertiary)' }}>{user.email}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    fontWeight: 'bold',
                    color: user.role === 'admin' ? 'var(--color-critical)' : 'var(--text-secondary)'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: user.status === 'active' ? 'var(--color-50)' : '#FCEBEB',
                    color: user.status === 'active' ? 'var(--color-600)' : 'var(--color-critical)',
                    fontWeight: 500
                  }}>
                    {user.status === 'active' ? 'Actif' : 'Suspendu'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {user.lastLogin || 'Jamais'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div className="d-flex justify-content-end gap-1">
                    <Button variant="ghost" size="sm" title="Modifier"><IconEdit size={16} /></Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title={user.status === 'active' ? 'Suspendre' : 'Activer'}
                      onClick={() => handleStatusToggle(user)}
                      style={{ color: user.status === 'active' ? 'var(--color-high)' : 'var(--color-low)' }}
                    >
                      {user.status === 'active' ? <IconBan size={16} /> : <IconCheck size={16} />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Supprimer" 
                      style={{ color: 'var(--color-critical)' }}
                      onClick={() => handleDelete(user.id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersManagement;
