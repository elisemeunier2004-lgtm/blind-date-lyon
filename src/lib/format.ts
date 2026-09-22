import { site, type Seance } from '../config/site';

const TZ = 'Europe/Paris';

export function jourLong(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: TZ,
  }).format(new Date(iso));
}

/** « 21 h » ou « 20 h 30 ». */
export function heure(iso: string): string {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: TZ,
  }).formatToParts(new Date(iso));
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return m === '00' ? `${h} h` : `${h} h ${m}`;
}

export function prix(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: site.offre.devise,
    maximumFractionDigits: 0,
  }).format(montant);
}

/** Prix d'une séance, ou `null` s'il n'est pas communiqué. */
export function prixSeance(s: Seance): number | null {
  return s.prix ?? site.offre.prixParDefaut;
}

/** Les séances réservables (vide tant que rien n'est officiel). */
export function seancesOuvertes(): Seance[] {
  return site.seances.filter((s) => s.statut === 'ouverte');
}

/** Le plus bas prix parmi les séances réservables, ou `null` (rien n'est alors affiché). */
export function prixMinimum(): number | null {
  const prixConnus = seancesOuvertes()
    .map(prixSeance)
    .filter((p): p is number => p !== null);
  return prixConnus.length ? Math.min(...prixConnus) : null;
}

/** Lien de réservation vers la billetterie, ou `null` s'il n'y en a pas encore. */
export function lienReservation(s?: Seance): string | null {
  if (!site.reservation.url) return null;
  const url = new URL(site.reservation.url);
  if (s) url.searchParams.set('seance', s.numero);
  return url.toString();
}

/**
 * Destination du CTA « Être informé de l'ouverture » :
 * le formulaire s'il existe, sinon la section « L'ouverture » de la page.
 */
export function lienInformation(): string {
  return site.ouverture.lienInformation ?? '#ouverture';
}
