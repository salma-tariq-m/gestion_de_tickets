import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { IconMail, IconLock, IconLogin } from '@tabler/icons-react';
import { loginUser, clearError } from '../../app/slices/authSlice';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import toast from '../../components/ui/Toast';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Réinitialiser les erreurs d'authentification au démontage
  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Si déjà connecté, rediriger
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'L\'adresse email est requise';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email invalide';
    if (!password) errs.password = 'Le mot de passe est requis';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Identifiants invalides');
    }
  };

  return (
    <div className="tf-auth-container">
      <div className="tf-auth-card animate-fade-in">
        
        {/* Logo de l'identité TicketFlow */}
        <div 
          className="d-flex align-items-center justify-content-center mb-4" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-2xl)'
          }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#639922',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--white)',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            TF
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.2' }}>
              TicketFlow
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Système de Gestion des Tickets
            </span>
          </div>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          Se connecter
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
            label="Adresse Email"
            type="email"
            placeholder="votre.email@ticketflow.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            required
            autoComplete="email"
          />

          <FormField
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            required
            autoComplete="current-password"
          />

          <div 
            className="d-flex justify-content-between align-items-center mb-4" 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 'var(--spacing-lg)',
              fontSize: '13px'
            }}
          >
            <Link to="/forgot-password" style={{ color: 'var(--color-400)', textDecoration: 'none' }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-100"
            style={{ width: '100%', height: '44px' }}
            leftIcon={<IconLogin size={18} />}
          >
            Se connecter
          </Button>
        </form>

        <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Nouveau sur TicketFlow ?{' '}
          <Link to="/register" style={{ color: 'var(--color-600)', fontWeight: 'bold', textDecoration: 'none' }}>
            Créer un compte client
          </Link>
        </div>
        
        {/* Comptes de démonstration d'assistance */}
        <div 
          style={{ 
            marginTop: 'var(--spacing-xl)', 
            padding: 'var(--spacing-sm) var(--spacing-md)', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🔑 Mode Démo (Accès rapide) :</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>Client : <strong>client@ticketflow.com</strong> (mdp: n'importe)</div>
            <div>Agent : <strong>agent@ticketflow.com</strong></div>
            <div>Admin : <strong>admin@ticketflow.com</strong></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
