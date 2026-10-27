import { useLayoutEffect, useRef } from 'react'
import { InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three'
import { SHELF } from '../../constants'
import { PRODUCTS, PRODUCTS_BY_ID, type Product } from '../../data/products'
import { SHELVES } from '../../data/layout'

const ITEM_GAP = 0.03 // espace entre deux articles
const USABLE_WIDTH = SHELF.width - 0.2 // largeur utile (hors montants)

// Calcule une seule fois la matrice (position + rotation) de chaque article
function computeMatrices(): Record<string, Matrix4[]> {
  const result: Record<string, Matrix4[]> = {}

  const yAxis = new Vector3(0, 1, 0)
  const one = new Vector3(1, 1, 1)
  const quaternion = new Quaternion()
  const shelfMatrix = new Matrix4()
  const localMatrix = new Matrix4()

  for (const shelf of SHELVES) {
    quaternion.setFromAxisAngle(yAxis, shelf.rotationY)
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

        const matrix = new Matrix4().multiplyMatrices(shelfMatrix, localMatrix)
        ;(result[productId] ??= []).push(matrix)
      }
    })
  }

  return result
}

const MATRICES = computeMatrices()

type ProductMeshProps = {
  product: Product
  matrices: Matrix4[]
}

function ProductMesh({ product, matrices }: ProductMeshProps) {
  const ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return

    matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix))
    mesh.instanceMatrix.needsUpdate = true
  }, [matrices])

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, matrices.length]}
      frustumCulled={false}
    >
      <boxGeometry args={product.size} />
      <meshStandardMaterial color={product.color} roughness={0.5} />
    </instancedMesh>
  )
}

export function ProductInstances() {
  return (
    <>
      {PRODUCTS.map((product) => {
        const matrices = MATRICES[product.id]
        if (!matrices) return null
        return <ProductMesh key={product.id} product={product} matrices={matrices} />
      })}
    </>
  )
}