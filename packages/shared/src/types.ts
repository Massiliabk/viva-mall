// Identifiant fourni par la base de données
export type ID = string

// Montants : TOUJOURS en centimes de dinar (nombres entiers), pour éviter les erreurs d'arrondi.
// 1 DA = 100 centimes. Exemple : 149,50 DA s'écrit 14950.
export type Centimes = number

// Langues du site : français par défaut, arabe en option
export type Locale = 'fr' | 'ar'

/* ---------- Catalogue ---------- */

export type Category = {
  id: ID
  slug: string
  name: string
  parentId: ID | null // sous-catégorie : référence la catégorie parente
  fresh: boolean // rayon réfrigéré (meuble réfrigéré en 3D)
  position: number // ordre d'affichage
}

export type ProductImage = {
  id: ID
  url: string
  alt: string
  position: number // la première image est l'image principale
}

// Informations pour afficher le produit dans la visite 3D
export type Product3D = {
  size: [number, number, number] // largeur, hauteur, profondeur de l'emballage (en mètres)
  color: string // couleur des côtés de l'emballage
  frontImageUrl: string | null // photo de face (sinon une étiquette est générée)
}

export type Product = {
  id: ID
  sku: string // référence interne
  slug: string // adresse de la fiche produit
  name: string
  description: string
  categoryId: ID
  price: Centimes
  oldPrice: Centimes | null // ancien prix barré en cas de promotion
  stock: number
  isActive: boolean // visible sur le site et en 3D
  images: ProductImage[]
  model3d: Product3D
}

// Emplacement d'un produit dans la visite 3D
export type ShelfPlacement = {
  id: ID
  productId: ID
  shelfId: string // identifiant du rayon dans le plan 3D (ex. "gondole-0-fond-2")
  level: number // étagère : 0 = la plus basse
}

/* ---------- Panier ---------- */

export type CartLine = {
  product: Product
  quantity: number
  lineTotal: Centimes
}

export type CartView = {
  id: ID
  lines: CartLine[]
  itemCount: number
  subtotal: Centimes
}

/* ---------- Comptes ---------- */

export type UserRole = 'customer' | 'admin'

export type User = {
  id: ID
  name: string
  phone: string
  email: string | null
  role: UserRole
}

/* ---------- Commandes ---------- */

export type OrderStatus =
  | 'pending' // reçue
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export type DeliveryMode = 'delivery' | 'pickup' // livraison ou retrait en magasin
export type PaymentMethod = 'cash_on_delivery' | 'online'
export type OrderSource = 'site' | '3d' // d'où vient le panier (pour les statistiques)

export type OrderItem = {
  productId: ID
  name: string // copie du nom au moment de la commande
  unitPrice: Centimes // copie du prix au moment de la commande
  quantity: number
  lineTotal: Centimes
}

export type OrderCustomer = {
  name: string
  phone: string
  email: string | null
}

export type OrderDelivery = {
  mode: DeliveryMode
  wilaya: string | null
  commune: string | null
  address: string | null
  notes: string | null
}

export type Order = {
  id: ID
  number: string // numéro lisible, ex. "VM-2026-000123"
  status: OrderStatus
  items: OrderItem[]
  subtotal: Centimes
  deliveryFee: Centimes
  total: Centimes
  customer: OrderCustomer
  delivery: OrderDelivery
  paymentMethod: PaymentMethod
  source: OrderSource
  locale: Locale // langue utilisée pour la commande (notifications futures)
  createdAt: string // date ISO
}
