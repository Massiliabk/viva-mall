import { DEFAULT_LOCALE, type ApiError, type Locale } from '@viva-mall/shared'
import { ApiRequestError } from './errors'
import type { VivaApi } from './types'

function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

export function createHttpApi(
  baseUrl: string,
  getLocale: () => Locale = () => DEFAULT_LOCALE,
): VivaApi {
  const root = `${baseUrl.replace(/\/$/, '')}/api/v1`

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${root}${path}`, {
      ...init,
      credentials: 'include', // envoie le cookie du panier / de la session
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': getLocale(), // le serveur répond dans cette langue
        ...init.headers,
      },
    })

    if (!response.ok) {
      let error: Partial<ApiError> = {}
      try {
        error = await response.json()
      } catch {
        // réponse sans corps JSON
      }
      throw new ApiRequestError(
        response.status,
        error.code ?? 'HTTP_ERROR',
        error.message ?? `Erreur ${response.status}`,
      )
    }

    return (await response.json()) as T
  }

  return {
    listCategories: () => request('/categories'),
    listProducts: (query = {}) => request(`/products${toQuery(query)}`),
    getProduct: (slug) => request(`/products/${encodeURIComponent(slug)}`),
    getStore3D: () => request('/store3d'),

    getCart: () => request('/cart'),
    addCartItem: (body) =>
      request('/cart/items', { method: 'POST', body: JSON.stringify(body) }),
    updateCartItem: (productId, body) =>
      request(`/cart/items/${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    clearCart: () => request('/cart', { method: 'DELETE' }),

    createOrder: (body) =>
      request('/orders', { method: 'POST', body: JSON.stringify(body) }),
    getOrder: (id) => request(`/orders/${encodeURIComponent(id)}`),
  }
}
