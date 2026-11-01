import type {
  CartView,
  Category,
  ID,
  Locale,
  Order,
  OrderCustomer,
  OrderDelivery,
  OrderSource,
  PaymentMethod,
  Product,
  ShelfPlacement,
} from './types'

// Toutes les routes sont préfixées par /api/v1

export type Page<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/* ---------- Catalogue (public) ---------- */

// GET /categories
export type ListCategoriesResponse = Category[]

// GET /products?category=<slug>&search=<texte>&sort=<tri>&page=<n>&pageSize=<n>
export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'name'

export type ListProductsQuery = {
  category?: string
  search?: string
  sort?: ProductSort
  onSale?: boolean // uniquement les produits en promotion
  page?: number
  pageSize?: number
}
export type ListProductsResponse = Page<Product>

// GET /products/:slug
export type GetProductResponse = Product

/* ---------- Visite 3D (public) ---------- */

// GET /store3d : produits placés en rayon et leurs emplacements
export type Store3DResponse = {
  products: Product[]
  placements: ShelfPlacement[]
}

/* ---------- Panier ---------- */
// Le panier est stocké côté serveur. Il est reconnu par un cookie (domaine parent partagé
// entre le site et la 3D) ou rattaché au compte de l'utilisateur connecté.

// GET /cart
export type GetCartResponse = CartView

// POST /cart/items
export type AddCartItemBody = { productId: ID; quantity: number }

// PATCH /cart/items/:productId  (quantity = 0 retire le produit)
export type UpdateCartItemBody = { quantity: number }

// DELETE /cart  (vide le panier) · toutes ces routes renvoient le panier à jour (CartView)

/* ---------- Commandes ---------- */

// POST /orders : transforme le panier en commande
export type CreateOrderBody = {
  customer: OrderCustomer
  delivery: OrderDelivery
  paymentMethod: PaymentMethod
  source: OrderSource
  locale: Locale
}
export type CreateOrderResponse = Order

// GET /orders/:id
export type GetOrderResponse = Order

/* ---------- Administration (réservé au rôle admin, préfixe /admin) ---------- */
// POST/PATCH/DELETE /admin/products · POST /admin/products/:id/images
// PUT /admin/placements (emplacements en 3D) · GET/PATCH /admin/orders
// Les formats détaillés seront ajoutés avec l'application admin.

/* ---------- Erreurs ---------- */

export type ApiError = {
  code: string // ex. "OUT_OF_STOCK", "NOT_FOUND"
  message: string
}
