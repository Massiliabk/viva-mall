import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ListProductsQuery } from '@viva-mall/shared'
import { api } from './api'
import { useI18n } from './i18n'

// La langue fait partie de la clé : changer de langue recharge les textes

export function useCategories() {
  const { locale } = useI18n()
  return useQuery({
    queryKey: ['categories', locale],
    queryFn: () => api.listCategories(),
  })
}

export function useProducts(query: ListProductsQuery) {
  const { locale } = useI18n()
  return useQuery({
    queryKey: ['products', locale, query],
    queryFn: () => api.listProducts(query),
    placeholderData: keepPreviousData,
  })
}

export function useCart() {
  const { locale } = useI18n()
  return useQuery({
    queryKey: ['cart', locale],
    queryFn: () => api.getCart(),
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => api.addCartItem({ productId, quantity: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}
