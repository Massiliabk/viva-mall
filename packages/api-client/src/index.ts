import { DEFAULT_LOCALE, type Locale } from '@viva-mall/shared'
import { createHttpApi } from './http'
import { createMockApi } from './mock/mockApi'
import { withLocale } from './mock/localize'
import type { VivaApi } from './types'

export type { VivaApi } from './types'
export { ApiRequestError } from './errors'
export { createHttpApi } from './http'
export { createMockApi } from './mock/mockApi'

export type CreateApiOptions = {
  baseUrl?: string // adresse du backend ; sans elle : faux backend (données de test)
  getLocale?: () => Locale // langue courante, lue à chaque requête
}

export function createApi({
  baseUrl,
  getLocale = () => DEFAULT_LOCALE,
}: CreateApiOptions = {}): VivaApi {
  return baseUrl
    ? createHttpApi(baseUrl, getLocale)
    : withLocale(createMockApi(), getLocale)
}
