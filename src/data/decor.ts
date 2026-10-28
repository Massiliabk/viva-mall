export type Collider = { x: number; z: number; halfX: number; halfZ: number }
import { CHECKOUT_COLLIDERS } from './checkout'

// Îlots promotionnels dans la zone d'entrée
export const PROMO_ISLANDS = [
  { id: 'promo-1', x: -4.5, z: 5.4, width: 2.6, depth: 1.3, tone: 'red' as const, label: 'PROMOS' },
  { id: 'promo-2', x: 4.5, z: 5.4, width: 2.6, depth: 1.3, tone: 'blue' as const, label: 'NOUVEAUTÉS' },
]

// Totems d'accueil de chaque côté du passage d'entrée
export const TOTEM_SIZE = { width: 0.7, depth: 0.3 }
export const TOTEMS = [
  { id: 'totem-1', x: -1.8, z: 4.4 },
  { id: 'totem-2', x: 1.8, z: 4.4 },
]

// Zones interdites au joueur et au chariot
export const DECOR_COLLIDERS: Collider[] = [
  ...PROMO_ISLANDS.map((island) => ({
    x: island.x,
    z: island.z,
    halfX: island.width / 2,
    halfZ: island.depth / 2,
  })),
  ...TOTEMS.map((totem) => ({
    x: totem.x,
    z: totem.z,
    halfX: TOTEM_SIZE.width / 2,
    halfZ: TOTEM_SIZE.depth / 2,
  })),
  ...CHECKOUT_COLLIDERS,
]