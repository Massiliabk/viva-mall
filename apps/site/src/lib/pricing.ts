import type { Product } from '@viva-mall/shared'

// Pourcentage de réduction (ex. 15), ou null s'il n'y a pas de promotion
export function discountPercent(product: Product): number | null {
  if (!product.oldPrice || product.oldPrice <= product.price) return null
  return Math.round((1 - product.price / product.oldPrice) * 100)
}
