import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { IconUserPlus } from '@tabler/icons-react';
import { registerUser, clearError } from '../../app/slices/authSlice';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import toast from '../../components/ui/Toast';

export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Le nom complet est requis';
    if (!email) errs.email = 'L\'adresse email est requise';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email invalide';
    
    if (!password) errs.password = 'Le mot de passe est requis';
    else if (password.length < 6) errs.password = 'Le mot de passe doit faire au moins 6 caractères';
    
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(registerUser({ name: name.trim(), email, password })).unwrap();
      toast.success('Compte créé avec succès !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Erreur lors de la création du compte');
    }
  };

  return (
    <div className="tf-auth-container">
      <div className="tf-auth-card animate-fade-in" style={{ maxWidth: '460px' }}>
        
        {/* Identité TicketFlow */}
        <div 
          className="d-flex align-items-center justify-content-center mb-4" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
          }}
        >
          <div 
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#639922',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--white)',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            TF
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.2' }}>
              TicketFlow
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Portail d'Inscription Client
            </span>
          </div>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          Créer un compte
        </h2>

        {error && (
          <div 
            style={{ 
              backgroundColor: '#FCEBEB', 
              color: 'var(--color-critical)', 
              padding: '10px', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: 'var(--spacing-md)',
              border: '1px solid var(--color-critical)',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Nom complet"
            type="text"
            placeholder="Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
            required
          />

          <FormField
            label="Adresse Email"
            type="email"
            placeholder="jean.dupont@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            required
            autoComplete="email"
          />

          <FormField
            label="Mot de passe (min. 6 caractères)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            required
            autoComplete="new-password"
          />

          <FormField
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={fieldErrors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="accent" // Vert selon la charte pour accentuer l'action d'enregistrement
            isLoading={loading}
            className="w-100"
            style={{ width: '100%', height: '44px', marginTop: 'var(--spacing-md)' }}
            leftIcon={<IconUserPlus size={18} />}
          >
            S'inscrire
          </Button>
        </form>

        <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: 'var(--color-600)', fontWeight: 'bold', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
