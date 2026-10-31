import type {
  CartLine,
  CartView,
  Order,
  OrderItem,
  Product,
} from '@viva-mall/shared'
import { ApiRequestError } from '../errors'
import type { VivaApi } from '../types'
import { CATEGORIES, PRODUCTS } from './data'
import { PRODUCT_AR } from './arabic'

const DELAY_MS = 120 // simule le temps de réponse d'un vrai serveur
const DELIVERY_FEE = 40000 // 400 DA (valeur provisoire)
const CART_KEY = 'viva-mock-cart'
const ORDERS_KEY = 'viva-mock-orders'

const PRODUCT_BY_ID = new Map<string, Product>(PRODUCTS.map((p) => [p.id, p]))

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, DELAY_MS))

// "Crème" -> "creme" : recherche insensible aux accents et aux majuscules
function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/* ---------- Stockage dans le navigateur (localStorage), sinon en mémoire ---------- */

const memory = new Map<string, string>()

function load<T>(key: string, fallback: T): T {
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(key)
        : (memory.get(key) ?? null)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  const raw = JSON.stringify(value)
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, raw)
    else memory.set(key, raw)
  } catch {
    memory.set(key, raw)
  }
}

/* ---------- Panier ---------- */

type Quantities = Record<string, number> // id du produit -> quantité

function cartView(): CartView {
  const quantities = load<Quantities>(CART_KEY, {})
  const lines: CartLine[] = []

  for (const [productId, quantity] of Object.entries(quantities)) {
    const product = PRODUCT_BY_ID.get(productId)
    if (product) {
      lines.push({ product, quantity, lineTotal: product.price * quantity })
    }
  }

  return {
    id: 'mock-cart',
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
  }
}

function requireProduct(productId: string) {
  const product = PRODUCT_BY_ID.get(productId)
  if (!product || !product.isActive) {
    throw new ApiRequestError(404, 'NOT_FOUND', 'Produit introuvable')
  }
  return product
}

function requireQuantity(quantity: number, min: number) {
  if (!Number.isInteger(quantity) || quantity < min) {
    throw new ApiRequestError(400, 'INVALID_QUANTITY', 'Quantité invalide')
  }
}

function checkStock(product: Product, quantity: number) {
  if (quantity > product.stock) {
    throw new ApiRequestError(409, 'OUT_OF_STOCK', 'Stock insuffisant')
  }
}

/* ---------- L'API ---------- */

export function createMockApi(): VivaApi {
  return {
    async listCategories() {
      await wait()
      return [...CATEGORIES].sort((a, b) => a.position - b.position)
    },

    async listProducts(query = {}) {
      await wait()
      const { category, search, sort = 'newest', page = 1, pageSize = 12 } = query

      let items = PRODUCTS.filter((p) => p.isActive)

      if (category) {
        const found = CATEGORIES.find((c) => c.slug === category)
        items = found ? items.filter((p) => p.categoryId === found.id) : []
      }

      if (search) {
        const term = normalize(search)
        items = items.filter((p) =>
        normalize(`${p.name} ${p.description} ${PRODUCT_AR[p.id]?.name ?? ''}`).includes(term),
      )
      }

      items = [...items]
      if (sort === 'newest') items.reverse() // les derniers ajoutés d'abord
      if (sort === 'price_asc') items.sort((a, b) => a.price - b.price)
      if (sort === 'price_desc') items.sort((a, b) => b.price - a.price)
      if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name, 'fr'))

      const start = (page - 1) * pageSize
      return {
        items: items.slice(start, start + pageSize),
        total: items.length,
        page,
        pageSize,
      }
    },

    async getProduct(slug) {
      await wait()
      const product = PRODUCTS.find((p) => p.slug === slug && p.isActive)
      if (!product) throw new ApiRequestError(404, 'NOT_FOUND', 'Produit introuvable')
      return product
    },

    async getStore3D() {
      await wait()
      // Les emplacements en rayon seront générés quand on branchera la 3D sur l'API
      return { products: PRODUCTS.filter((p) => p.isActive), placements: [] }
    },

    async getCart() {
      await wait()
      return cartView()
    },

    async addCartItem({ productId, quantity }) {
      await wait()
      requireQuantity(quantity, 1)
      const product = requireProduct(productId)

      const quantities = load<Quantities>(CART_KEY, {})
      const next = (quantities[productId] ?? 0) + quantity
      checkStock(product, next)

      quantities[productId] = next
      save(CART_KEY, quantities)
      return cartView()
    },

    async updateCartItem(productId, { quantity }) {
      await wait()
      requireQuantity(quantity, 0)
      const product = requireProduct(productId)

      const quantities = load<Quantities>(CART_KEY, {})
      if (quantity === 0) {
        delete quantities[productId]
      } else {
        checkStock(product, quantity)
        quantities[productId] = quantity
      }

      save(CART_KEY, quantities)
      return cartView()
    },

    async clearCart() {
      await wait()
      save(CART_KEY, {})
      return cartView()
    },

    async createOrder(body) {
      await wait()
      const cart = cartView()
      if (cart.lines.length === 0) {
        throw new ApiRequestError(409, 'EMPTY_CART', 'Le panier est vide')
      }

      const orders = load<Order[]>(ORDERS_KEY, [])
      const deliveryFee = body.delivery.mode === 'delivery' ? DELIVERY_FEE : 0

      const items: OrderItem[] = cart.lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        unitPrice: line.product.price,
        quantity: line.quantity,
        lineTotal: line.lineTotal,
      }))

      const order: Order = {
        id: `order-${Date.now()}`,
        number: `VM-${new Date().getFullYear()}-${String(orders.length + 1).padStart(6, '0')}`,
        status: 'pending',
        items,
        subtotal: cart.subtotal,
        deliveryFee,
        total: cart.subtotal + deliveryFee,
        customer: body.customer,
        delivery: body.delivery,
        paymentMethod: body.paymentMethod,
        source: body.source,
        locale: body.locale,
        createdAt: new Date().toISOString(),
      }

      save(ORDERS_KEY, [...orders, order])
      save(CART_KEY, {})
      return order
    },

    async getOrder(id) {
      await wait()
      const order = load<Order[]>(ORDERS_KEY, []).find((o) => o.id === id)
      if (!order) throw new ApiRequestError(404, 'NOT_FOUND', 'Commande introuvable')
      return order
    },
  }
}
