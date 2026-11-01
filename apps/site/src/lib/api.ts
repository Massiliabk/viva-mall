import { createApi } from '@viva-mall/api-client'
import { getCurrentLocale } from './i18n'

// Sans VITE_API_URL : données de test. Avec : vrai backend.
export const api = createApi({
  baseUrl: import.meta.env.VITE_API_URL,
  getLocale: getCurrentLocale,
})
