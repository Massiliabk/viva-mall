import { createHttpApi } from './http'
import { createMockApi } from './mock/mockApi'
import type { VivaApi } from './types'

export type { VivaApi } from './types'
export { ApiRequestError } from './errors'
export { createHttpApi } from './http'
export { createMockApi } from './mock/mockApi'

// Sans adresse : faux backend (données de test) · Avec adresse : vrai backend
export function createApi(baseUrl?: string): VivaApi {
  return baseUrl ? createHttpApi(baseUrl) : createMockApi()
}
