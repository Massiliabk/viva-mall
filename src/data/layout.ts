import { ROOM, SHELF } from '../constants'

export type ShelfData = {
  id: string
  category: string
  color: string
  position: [number, number, number]
  rotationY: number
  levels: string[] // un id de produit par étagère, du bas vers le haut
}

type Category = { name: string; color: string; products: string[] }

export const CATEGORIES: Category[] = [
  { name: 'Boissons', color: '#0984e3', products: ['eau', 'jus-orange', 'lait', 'soda'] },
  { name: 'Épicerie', color: '#e17055', products: ['semoule', 'pates', 'riz', 'sucre'] },
  { name: 'Cuisine & petit-déjeuner', color: '#00b894', products: ['huile', 'tomate', 'cafe', 'the'] },
  { name: 'Produits laitiers', color: '#fd79a8', products: ['yaourt', 'fromage', 'beurre', 'creme'] },
  { name: 'Biscuits & snacks', color: '#fdcb6e', products: ['biscuits', 'chocolat', 'chips', 'gateau'] },
  { name: 'Hygiène', color: '#6c5ce7', products: ['savon', 'shampooing', 'dentifrice', 'papier'] },
  { name: 'Entretien', color: '#00cec9', products: ['lessive', 'vaisselle', 'javel', 'eponge'] },
]

const W = SHELF.width
const D = SHELF.depth
const T = ROOM.wallThickness

// Position des rayons collés aux murs
const BACK_Z = -ROOM.depth / 2 + T / 2 + D / 2
const LEFT_X = -ROOM.width / 2 + T / 2 + D / 2
const RIGHT_X = ROOM.width / 2 - T / 2 - D / 2

// Répartit n rayons côte à côte, centrés sur `center`
function spread(n: number, center = 0) {
  return Array.from({ length: n }, (_, i) => center + (i - (n - 1) / 2) * W)
}

// Décale la liste de produits pour varier d'un rayon à l'autre
function rotate<T>(list: T[], by: number) {
  const k = by % list.length
  return [...list.slice(k), ...list.slice(0, k)]
}

// Crée une rangée de rayons de la même catégorie
function makeRun(
  runId: string,
  categoryIndex: number,
  spots: [number, number][],
  rotationY: number,
): ShelfData[] {
  const category = CATEGORIES[categoryIndex % CATEGORIES.length]
  return spots.map(
    ([x, z], i): ShelfData => ({
      id: `${runId}-${i}`,
      category: category.name,
      color: category.color,
      position: [x, 0, z],
      rotationY,
      levels: rotate(category.products, i),
    }),
  )
}

// Allées de gondoles (centre de chaque paire dos à dos, en z)
const AISLES_Z = [-5.5, -1.5, 2.5]
const GONDOLA_X = spread(6)

export const SHELVES: ShelfData[] = [
  // Mur du fond (face à l'entrée)
  ...makeRun(
    'mur-fond',
    0,
    spread(7).map((x): [number, number] => [x, BACK_Z]),
    0,
  ),

  // Mur de gauche (face vers l'intérieur : +x)
  ...makeRun(
    'mur-gauche',
    1,
    spread(5).map((z): [number, number] => [LEFT_X, z]),
    Math.PI / 2,
  ),

  // Mur de droite (face vers l'intérieur : -x)
  ...makeRun(
    'mur-droit',
    2,
    spread(5).map((z): [number, number] => [RIGHT_X, z]),
    -Math.PI / 2,
  ),

  // Gondoles : deux rangées dos à dos par allée
  ...AISLES_Z.flatMap((z, a) => [
    ...makeRun(
      `gondole-${a}-fond`,
      3 + a * 2,
      GONDOLA_X.map((x): [number, number] => [x, z - D / 2]),
      Math.PI,
    ),
    ...makeRun(
      `gondole-${a}-entree`,
      4 + a * 2,
      GONDOLA_X.map((x): [number, number] => [x, z + D / 2]),
      0,
    ),
  ]),
]

// Zones interdites au joueur (un rectangle par rayon)
export const COLLIDERS = SHELVES.map((s) => {
  const rotated = Math.abs(Math.sin(s.rotationY)) > 0.5 // rayon tourné de 90°
  return {
    x: s.position[0],
    z: s.position[2],
    halfX: (rotated ? D : W) / 2,
    halfZ: (rotated ? W : D) / 2,
  }
})