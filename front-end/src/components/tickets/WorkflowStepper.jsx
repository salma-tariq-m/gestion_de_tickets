import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { updateTicketStatus } from '../../app/slices/ticketSlice';
import { IconCheck } from '@tabler/icons-react';
import toast from '../ui/Toast';

/**
 * Stepper de cycle de vie de ticket: Nouveau -> En cours -> En attente/Escalade -> Résolu -> Fermé
 */
export function WorkflowStepper({ ticketId, currentStatus }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isStaff = user && ['agent', 'manager', 'admin'].includes(user.role.toLowerCase());

  // Normalisation du statut
  const status = currentStatus.toLowerCase().replace('_', '-');

  // Étapes ordonnées du stepper
  const steps = [
    { id: 'nouveau', label: 'Nouveau', value: 'nouveau' },
    { id: 'en-cours', label: 'En cours', value: 'en-cours' },
    { 
      id: 'middle', 
      label: status === 'escalade' ? 'Escalade' : 'En attente', 
      value: status === 'escalade' ? 'escalade' : 'en-attente' 
    },
    { id: 'resolu', label: 'Résolu', value: 'resolu' },
    { id: 'ferme', label: 'Fermé', value: 'ferme' }
  ];

  // Trouver l'index de l'étape actuelle
  let activeIndex = 0;
  if (status === 'en-cours') activeIndex = 1;
  else if (status === 'en-attente' || status === 'escalade') activeIndex = 2;
  else if (status === 'resolu') activeIndex = 3;
  else if (status === 'ferme') activeIndex = 4;

  // Déterminer les statuts cibles autorisés depuis le statut actuel
  const getAllowedTransitions = (fromStatus) => {
    switch (fromStatus) {
      case 'nouveau':
        return ['en-cours'];
      case 'en-cours':
        return ['en-attente', 'escalade', 'resolu'];
      case 'en-attente':
        return ['en-cours', 'resolu'];
      case 'escalade':
        return ['en-cours', 'resolu'];
      case 'resolu':
        return ['ferme', 'en-cours']; // Fermeture ou réouverture si nécessaire
      case 'ferme':
        return ['nouveau']; // Réouverture complète
      default:
        return [];
    }
  };

  const allowedTargets = getAllowedTransitions(status);

  const handleStepClick = async (stepValue) => {
    if (!isStaff) return; // Seuls les agents/staff peuvent modifier le statut

    // Si on clique sur l'étape 3 (Middle), on peut choisir soit en-attente soit escalade si on est en-cours
    let target = stepValue;
    if (stepValue === 'en-attente' || stepValue === 'escalade') {
      // Si le statut actuel est 'en-cours', on peut escalader ou mettre en attente.
      // Dans le cadre du clic sur le stepper, si on clique sur l'étape 3, on va par défaut vers 'en-attente'.
      // L'utilisateur peut aussi avoir un sélecteur dans le panneau latéral pour plus de précision.
      target = status === 'en-cours' ? 'en-attente' : stepValue;
    }

    if (target === status) return;

    if (!allowedTargets.includes(target) && stepValue === 'middle') {
      // Tenter l'autre option du middle (escalade)
      if (allowedTargets.includes('escalade')) {
        target = 'escalade';
      }
    }

    if (!allowedTargets.includes(target)) {
      toast.error(`Transition non autorisée de ${status.toUpperCase()} vers ${target.toUpperCase()}`);
      return;
    }

    try {
      await dispatch(updateTicketStatus({ id: ticketId, status: target })).unwrap();
      toast.success(`Statut mis à jour : ${target.toUpperCase()}`);
    } catch (err) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
      <div className="tf-workflow-stepper">
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isTargetable = isStaff && allowedTargets.includes(step.value);

          return (
            <div
              key={step.id}
              className={`tf-workflow-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              onClick={() => isTargetable && handleStepClick(step.value)}
              style={{ cursor: isTargetable ? 'pointer' : 'default' }}
            >
              <div 
                className="tf-workflow-dot"
                style={{
                  borderColor: isActive ? 'var(--color-600)' : isCompleted ? 'var(--color-low)' : 'var(--border)',
                  backgroundColor: isActive ? 'var(--color-600)' : isCompleted ? 'var(--color-low)' : 'var(--white)',
                  color: isActive || isCompleted ? 'var(--white)' : 'var(--text-tertiary)',
                  boxShadow: isActive ? '0 0 0 4px var(--color-50)' : 'none',
                  cursor: isTargetable ? 'pointer' : 'default',
                  opacity: (!isCompleted && !isActive && !isTargetable) ? 0.7 : 1
                }}
                title={isTargetable ? `Passer à : ${step.label}` : step.label}
              >
                {isCompleted ? <IconCheck size={14} /> : (index + 1)}
              </div>
              <span 
                className="tf-workflow-label"
                style={{
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? 'var(--color-600)' : isCompleted ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontSize: '11px'
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {isStaff && allowedTargets.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Actions rapides :
          </span>
          {allowedTargets.map(tgt => (
            <button
              key={tgt}
              onClick={() => handleStepClick(tgt)}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--white)',
                cursor: 'pointer',
                color: 'var(--color-600)',
                fontWeight: 500
              }}
            >
              Passer à "{tgt.toUpperCase()}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

WorkflowStepper.propTypes = {
  ticketId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
};

export default WorkflowStepper;
