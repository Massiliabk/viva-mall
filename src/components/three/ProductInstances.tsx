import { useLayoutEffect, useRef } from 'react'
import type { InstancedMesh, Matrix4 } from 'three'
import { PRODUCTS, type Product } from '../../data/products'
import { MATRICES_BY_PRODUCT } from '../../data/placements'

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
        const matrices = MATRICES_BY_PRODUCT[product.id]
        if (!matrices) return null
        return <ProductMesh key={product.id} product={product} matrices={matrices} />
      })}
    </>
  )
}