import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconPlus, IconEdit, IconTrash, IconCategory } from '@tabler/icons-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../app/slices/userSlice';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import toast from '../../components/ui/Toast';

export function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.users);
  
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nom de catégorie requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setFormData({ name: '', description: '' });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, ...formData })).unwrap();
        toast.success('Catégorie mise à jour');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success('Catégorie créée');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) return;
    try {
      await dispatch(deleteCategory(category.id)).unwrap();
      toast.success('Catégorie supprimée');
    } catch (err) {
      toast.error('Impossible de supprimer la catégorie');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Gestion des Catégories</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Définissez et organisez les types de demandes de support disponibles.
          </p>
        </div>
        <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => handleOpenModal()}>
          Ajouter une catégorie
        </Button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            Chargement des catégories...
          </div>
        ) : categories.map((category) => (
          <div key={category.id} className="col-12 col-md-6 col-lg-4">
            <div className="tf-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <IconCategory size={24} style={{ color: 'var(--color-600)' }} />
                  <h3 className="m-0" style={{ fontSize: '18px' }}>{category.name}</h3>
                </div>
                <div className="d-flex gap-1">
                  <button
                    onClick={() => handleOpenModal(category)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-600)' }}
                    title="Modifier"
                  >
                    <IconEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-critical)' }}
                    title="Supprimer"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
              {category.description && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  {category.description}
                </p>
              )}
              <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-sm)' }}>
                <Badge variant="normal" text={`${category.ticketCount || 0} tickets`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Nom de la catégorie"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Ex: Problème technique"
          />
          <FormField
            label="Description (optionnelle)"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez brièvement ce que cette catégorie couvre..."
            rows={3}
          />
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              {editingCategory ? "Enregistrer" : "Créer la catégorie"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;
