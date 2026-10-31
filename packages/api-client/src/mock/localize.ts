import type { CartView, Category, Locale, Order, Product } from '@viva-mall/shared'
import type { VivaApi } from '../types'
import { CATEGORY_AR, PRODUCT_AR } from './arabic'

function localizeProduct(product: Product, locale: Locale): Product {
  if (locale !== 'ar') return product
  const ar = PRODUCT_AR[product.id]
  if (!ar) return product // pas de traduction : repli sur le français

  return {
    ...product,
    name: ar.name,
    description: ar.description,
    images: product.images.map((image) => ({ ...image, alt: ar.name })),
  }
}

function localizeCategory(category: Category, locale: Locale): Category {
  if (locale !== 'ar') return category
  return { ...category, name: CATEGORY_AR[category.id] ?? category.name }
}

function localizeCart(cart: CartView, locale: Locale): CartView {
  return {
    ...cart,
    lines: cart.lines.map((line) => ({
      ...line,
      product: localizeProduct(line.product, locale),
    })),
  }
}

function localizeOrder(order: Order, locale: Locale): Order {
  if (locale !== 'ar') return order
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      name: PRODUCT_AR[item.productId]?.name ?? item.name,
    })),
  }
}

// Enveloppe le faux backend : renvoie les textes dans la langue demandée,
// comme le fera le vrai backend (repli sur le français)
export function withLocale(api: VivaApi, getLocale: () => Locale): VivaApi {
  return {
    listCategories: async () =>
      (await api.listCategories()).map((c) => localizeCategory(c, getLocale())),

    listProducts: async (query) => {
      const result = await api.listProducts(query)
      return {
        ...result,
        items: result.items.map((p) => localizeProduct(p, getLocale())),
      }
    },

    getProduct: async (slug) => localizeProduct(await api.getProduct(slug), getLocale()),

    getStore3D: async () => {
      const store = await api.getStore3D()
      return {
        ...store,
        products: store.products.map((p) => localizeProduct(p, getLocale())),
      }
    },

    getCart: async () => localizeCart(await api.getCart(), getLocale()),
    addCartItem: async (body) =>
      localizeCart(await api.addCartItem(body), getLocale()),
    updateCartItem: async (productId, body) =>
      localizeCart(await api.updateCartItem(productId, body), getLocale()),
    clearCart: async () => localizeCart(await api.clearCart(), getLocale()),

    createOrder: async (body) =>
      localizeOrder(await api.createOrder(body), getLocale()),
    getOrder: async (id) => localizeOrder(await api.getOrder(id), getLocale()),
  }
}
