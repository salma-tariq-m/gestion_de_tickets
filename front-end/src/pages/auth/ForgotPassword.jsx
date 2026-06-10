import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMail, IconArrowLeft } from '@tabler/icons-react';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import toast from '../../components/ui/Toast';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez renseigner votre email.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulation de l'appel d'envoi d'email
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      toast.success('Lien de réinitialisation envoyé !');
    }, 1000);
  };

  return (
    <div className="tf-auth-container">
      <div className="tf-auth-card animate-fade-in">
        
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
              Mot de passe oublié
            </span>
          </div>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
          Récupérer mon accès
        </h2>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <p style={{ backgroundColor: '#EAF3DE', color: 'var(--color-low)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-low)' }}>
              Un e-mail de réinitialisation a été envoyé à <strong>{email}</strong> avec les instructions nécessaires.
            </p>
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              <Link to="/login" className="tf-btn tf-btn-secondary w-100" style={{ width: '100%', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <IconArrowLeft size={16} />
                Retourner à la connexion
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
              Saisissez l'adresse email de votre compte pour recevoir un lien de réinitialisation sécurisé.
            </p>

            {error && (
              <div style={{ backgroundColor: '#FCEBEB', color: 'var(--color-critical)', padding: '8px', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginBottom: 'var(--spacing-sm)', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <FormField
              label="Adresse Email"
              type="email"
              placeholder="votre.email@ticketflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-100"
              style={{ width: '100%', height: '44px', marginTop: 'var(--spacing-md)' }}
              leftIcon={<IconMail size={18} />}
            >
              Envoyer l'email de récupération
            </Button>

            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                <IconArrowLeft size={14} />
                Retourner à la connexion
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;
