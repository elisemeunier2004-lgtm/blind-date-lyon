/**
 * Décide si la 3D temps réel est proposée.
 * Sinon, l'affiche CSS reste : elle raconte la même histoire.
 *
 * Forçage manuel pour les tests : ?3d=1 ou ?3d=0
 */
export function peutAfficher3D(): boolean {
  const force = new URLSearchParams(location.search).get('3d');
  if (force === '0') return false;
  if (force === '1') return true;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;

  try {
    const essai = document.createElement('canvas');
    return !!essai.getContext('webgl2');
  } catch {
    return false;
  }
}

export function estTactile(): boolean {
  return matchMedia('(pointer: coarse)').matches;
}

export function mouvementReduit(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
