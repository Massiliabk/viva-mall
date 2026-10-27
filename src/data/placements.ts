import { Box3, Matrix4, Quaternion, Vector3 } from 'three'
import { SHELF } from '../constants'
import { PRODUCTS_BY_ID } from './products'
import { SHELVES, type ShelfData } from './layout'

const ITEM_GAP = 0.03 // espace entre deux articles
const USABLE_WIDTH = SHELF.width - 0.2 // largeur utile (hors montants)
const Y_AXIS = new Vector3(0, 1, 0)

export type Placement = {
  productId: string
  matrix: Matrix4
  box: Box3 // boîte englobante dans le monde, utilisée pour viser
}

// Boîte englobante dans le monde d'un élément posé dans un rayon
function worldBox(
  shelf: ShelfData,
  local: [number, number, number],
  size: [number, number, number],
  pad = 0,
): Box3 {
  const center = new Vector3(...local)
    .applyAxisAngle(Y_AXIS, shelf.rotationY)
    .add(new Vector3(...shelf.position))

  // Rayon tourné de 90° : largeur et profondeur sont échangées
  const swap = Math.abs(Math.sin(shelf.rotationY)) > 0.5
  const hx = (swap ? size[2] : size[0]) / 2 + pad
  const hy = size[1] / 2 + pad
  const hz = (swap ? size[0] : size[2]) / 2 + pad

  return new Box3(
    new Vector3(center.x - hx, center.y - hy, center.z - hz),
    new Vector3(center.x + hx, center.y + hy, center.z + hz),
  )
}

function computePlacements(): Placement[] {
  const result: Placement[] = []

  const quaternion = new Quaternion()
  const one = new Vector3(1, 1, 1)
  const shelfMatrix = new Matrix4()
  const localMatrix = new Matrix4()

  for (const shelf of SHELVES) {
    quaternion.setFromAxisAngle(Y_AXIS, shelf.rotationY)
    shelfMatrix.compose(new Vector3(...shelf.position), quaternion, one)

    shelf.levels.forEach((productId, level) => {
      const product = PRODUCTS_BY_ID[productId]
      const [w, h, d] = product.size

      const boardY = SHELF.firstLevelY + level * SHELF.levelGap
      const y = boardY + SHELF.boardThickness / 2 + h / 2
      const z = SHELF.depth / 2 - d / 2 - 0.04 // produits placés vers l'avant

      const step = w + ITEM_GAP
      const count = Math.floor(USABLE_WIDTH / step)

      for (let i = 0; i < count; i++) {
        const x = (i - (count - 1) / 2) * step
        localMatrix.makeTranslation(x, y, z)

        result.push({
          productId,
          matrix: new Matrix4().multiplyMatrices(shelfMatrix, localMatrix),
          box: worldBox(shelf, [x, y, z], product.size, 0.01),
        })
      }
    })
  }

  return result
}

export const PLACEMENTS = computePlacements()

// Matrices regroupées par produit (pour l'instancing)
export const MATRICES_BY_PRODUCT: Record<string, Matrix4[]> = {}
for (const placement of PLACEMENTS) {
  ;(MATRICES_BY_PRODUCT[placement.productId] ??= []).push(placement.matrix)
}

// Panneaux arrière des rayons : ils empêchent de "viser à travers" un rayon
export const BACK_PANELS: Box3[] = SHELVES.map((shelf) =>
  worldBox(
    shelf,
    [0, SHELF.height / 2, -SHELF.depth / 2 + 0.015],
    [SHELF.width, SHELF.height, 0.03],
  ),
)