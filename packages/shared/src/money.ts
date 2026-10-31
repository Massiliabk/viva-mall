import type { Centimes, Locale } from './types'

// 14950 -> "149,50 DA" (français) ou "149,50 دج" (arabe) · 15000 -> "150 DA"
// Les chiffres restent occidentaux (0-9), comme c'est l'usage en Algérie.
export function formatPrice(value: Centimes, locale: Locale = 'fr'): string {
  const hasCentimes = value % 100 !== 0
  const amount = (value / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: hasCentimes ? 2 : 0,
    maximumFractionDigits: 2,
  })
  return `${amount} ${locale === 'ar' ? 'دج' : 'DA'}`
}

// 149.5 -> 14950
export function toCentimes(dinars: number): Centimes {
  return Math.round(dinars * 100)
}
