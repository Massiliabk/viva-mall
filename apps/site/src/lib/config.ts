import type { Locale } from '@viva-mall/shared'

// Adresse de la visite 3D (application viva-mall-3D)
const VISIT_3D_BASE = import.meta.env.VITE_3D_URL ?? 'http://localhost:5174'

export function visit3dUrl(locale: Locale) {
  return `${VISIT_3D_BASE}/?lang=${locale}&from=site`
}
