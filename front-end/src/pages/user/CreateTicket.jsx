import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { IconArrowLeft, IconSend, IconPaperclip } from '@tabler/icons-react';
import { createNewTicket } from '../../app/slices/ticketSlice';
import { fetchCategories } from '../../app/slices/userSlice';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import toast from '../../components/ui/Toast';

export function CreateTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.tickets);
  const { categories } = useSelector((state) => state.users);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('normal');
  const [attachment, setAttachment] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Le titre du ticket est requis';
    if (!description.trim()) errs.description = 'Veuillez décrire le problème rencontré';
    if (!category) errs.category = 'Veuillez sélectionner une catégorie';
    if (!priority) errs.priority = 'Veuillez sélectionner un niveau de priorité';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachment({
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(createNewTicket({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        attachment
      })).unwrap();

      toast.success('Votre ticket a été créé avec succès');
      navigate('/tickets');
    } catch (err) {
      toast.error(err || 'Erreur lors de la création du ticket');
    }
  };

  const categoryOptions = categories.map(c => ({
    value: String(c.id),
    label: c.name
  }));

  const priorityOptions = [
    { value: 'critical', label: 'Critique (P1) - Support immédiat' },
    { value: 'high', label: 'Haute (P2)' },
    { value: 'normal', label: 'Normale (P3)' },
    { value: 'low', label: 'Basse (P4)' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <IconArrowLeft size={16} />
          Retour à mes demandes
        </Link>
      </div>

      <div className="tf-card" style={{ padding: 'var(--spacing-xl)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>
          Créer un nouveau ticket de support
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--spacing-xl)' }}>
          Décrivez précisément le problème rencontré. Notre équipe support TicketFlow vous répondra dans les plus brefs délais.
        </p>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Sujet / Titre résumé"
            type="text"
            placeholder="Ex: Problème d'impression des rapports PDF"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={fieldErrors.title}
            required
          />

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <FormField
                label="Catégorie"
                type="select"
                placeholder="Choisir une catégorie..."
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                error={fieldErrors.category}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <FormField
                label="Niveau d'Urgence / Priorité"
                type="select"
                options={priorityOptions}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                error={fieldErrors.priority}
                required
              />
            </div>
          </div>

          <FormField
            label="Description détaillée"
            type="textarea"
            placeholder="Veuillez inclure toutes les étapes pour reproduire le problème, ainsi que les messages d'erreur affichés."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={fieldErrors.description}
            rows={5}
            required
          />

          {/* Pièce jointe optionnelle */}
          <div className="tf-form-group">
            <span className="tf-label">Pièce jointe (optionnelle)</span>
            <div 
              style={{
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--spacing-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-primary)'
              }}
            >
              <div className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconPaperclip size={18} style={{ color: 'var(--text-secondary)' }} />
                {attachment ? (
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {attachment.name} ({attachment.size})
                  </span>
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    Ajouter une capture d'écran, un log...
                  </span>
                )}
              </div>
              <label 
                style={{
                  padding: '4px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--white)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: 'var(--color-600)'
                }}
              >
                Parcourir
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div 
            className="d-flex justify-content-end gap-3" 
            style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}
          >
            <Link to="/tickets" style={{ textDecoration: 'none' }}>
              <Button variant="ghost">Annuler</Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              leftIcon={<IconSend size={16} />}
            >
              Soumettre le ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
