import type { Locale } from './types'

export const LOCALES: Locale[] = ['fr', 'ar']
export const DEFAULT_LOCALE: Locale = 'fr'

// Nom de chaque langue, écrit dans sa propre langue (pour le sélecteur de langue)
export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية',
}

// L'arabe s'écrit de droite à gauche
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

// Vérifie une valeur lue ailleurs (adresse, stockage du navigateur...)
export function isLocale(value: unknown): value is Locale {
  return value === 'fr' || value === 'ar'
}
