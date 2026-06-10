import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash,
  IconCategory
} from '@tabler/icons-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../app/slices/userSlice';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import toast from '../../components/ui/Toast';

export function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.users);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await dispatch(createCategory({ name: newCatName.trim() })).unwrap();
      setNewCatName('');
      toast.success('Catégorie ajoutée');
    } catch (err) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success('Catégorie supprimée');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="mb-4">
        <h1>Gestion des Catégories 📂</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configurez les types de requêtes disponibles pour les utilisateurs.</p>
      </div>

      <div className="tf-card mb-4">
        <h3>Ajouter une catégorie</h3>
        <form onSubmit={handleAddCategory} className="d-flex gap-2 mt-3">
          <div style={{ flex: 1 }}>
            <FormField
              type="text"
              placeholder="Ex: Problème matériel, Logiciel, Réseau..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="m-0"
            />
          </div>
          <Button variant="primary" type="submit" leftIcon={<IconPlus size={18} />}>
            Ajouter
          </Button>
        </form>
      </div>

      <div className="tf-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>NOM DE LA CATÉGORIE</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div className="d-flex align-items-center gap-2">
                    <IconCategory size={18} color="var(--color-400)" />
                    <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                  #{cat.id}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div className="d-flex justify-content-end gap-1">
                    <Button variant="ghost" size="sm" title="Modifier"><IconEdit size={16} /></Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Supprimer" 
                      style={{ color: 'var(--color-critical)' }}
                      onClick={() => handleDelete(cat.id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && !loading && (
              <tr>
                <td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  Aucune catégorie configurée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;
