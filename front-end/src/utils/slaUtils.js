/**
 * Calculateur de SLA pour TicketFlow
 * - ≤ 70%  → #639922 (vert)
 * - 70–99% → #EF9F27 (orange) + texte "Alerte à 70%"
 * - ≥ 100% → #E24B4A (rouge) + texte "SLA dépassé — +Xmin"
 */
export function calculateSLA(createdAt, slaLimitHours = 8, closedAt = null) {
  if (!createdAt) {
    return { percentage: 0, color: '#639922', text: 'SLA -', isBreached: false };
  }

  const createdTime = new Date(createdAt).getTime();
  const endTime = closedAt ? new Date(closedAt).getTime() : Date.now();
  
  const totalSlaMs = slaLimitHours * 60 * 60 * 1000;
  const elapsedMs = endTime - createdTime;

  let percentage = (elapsedMs / totalSlaMs) * 100;
  if (percentage < 0) percentage = 0;

  let color = '#639922'; // vert
  let text = `SLA OK (${Math.round(percentage)}%)`;
  let isBreached = false;

  if (percentage >= 100) {
    color = '#E24B4A'; // rouge
    isBreached = true;
    const extraMs = elapsedMs - totalSlaMs;
    const extraMin = Math.max(1, Math.round(extraMs / (60 * 1000)));
    text = `SLA dépassé — +${extraMin}min`;
  } else if (percentage >= 70) {
    color = '#EF9F27'; // orange
    text = `Alerte à 70% (${Math.round(percentage)}%)`;
  }

  return {
    percentage: Math.min(percentage, 100), // Pour l'affichage CSS de la barre de progression
    rawPercentage: percentage,
    color,
    text,
    isBreached
  };
}

export default calculateSLA;
