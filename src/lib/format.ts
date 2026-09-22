import { site, type Seance } from '../config/site';

const TZ = 'Europe/Paris';

/** Les séances, typées largement (les statuts peuvent changer dans la config). */
const seances: readonly Seance[] = site.seances;

export function jourLong(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: TZ,
  }).format(new Date(iso));
}

export function jourCourt(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
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

export function prixSeance(s: Seance): number {
  return s.prix ?? site.offre.prixParDefaut;
}

/** Le plus bas prix parmi les séances réservables (pour « dès … »). */
export function prixMinimum(): number {
  const ouvertes = seances.filter((s) => s.statut === 'ouverte');
  const liste = ouvertes.length ? ouvertes : seances;
  return Math.min(...liste.map((s) => prixSeance(s)));
}

export function prochaineSeance(): Seance | undefined {
  return seances.find((s) => s.statut === 'ouverte') ?? seances[0];
}

/**
 * Lien de réservation : la billetterie si elle est configurée,
 * sinon un e-mail pré-rempli (honnête et fonctionnel dès la V1).
 */
export function lienReservation(s?: Seance): string {
  if (site.reservation.url) {
    const url = new URL(site.reservation.url);
    if (s) url.searchParams.set('seance', s.numero);
    return url.toString();
  }
  const sujet = s
    ? `Réserver une place · Séance Nº ${s.numero} (${jourCourt(s.date)})`
    : 'Réserver une place';
  const corps = s
    ? `Bonjour,\n\nJe souhaite réserver une place pour la séance Nº ${s.numero}, ${jourLong(s.date)} à ${heure(s.date)} (${s.quartier}).\n\nPrénom :\nÂge :\nTéléphone :\n\nMerci.`
    : 'Bonjour,\n\nJe souhaite recevoir une invitation pour une prochaine séance.\n\nPrénom :\nÂge :\n\nMerci.';
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}
