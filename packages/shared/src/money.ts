import type { Centimes } from './types'

// 14950 -> "149,50 DA" · 15000 -> "150 DA"
export function formatPrice(value: Centimes): string {
  const hasCentimes = value % 100 !== 0
  const dinars = (value / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: hasCentimes ? 2 : 0,
    maximumFractionDigits: 2,
  })
  return `${dinars} DA`
}

// 149.5 -> 14950
export function toCentimes(dinars: number): Centimes {
  return Math.round(dinars * 100)
}
