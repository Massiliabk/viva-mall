import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import {
  MeshStandardMaterial,
  SRGBColorSpace,
  TextureLoader,
  type InstancedMesh,
  type Matrix4,
  type Texture,
} from 'three'
import { PRODUCTS, type Product } from '../../data/products'
import { MATRICES_BY_PRODUCT } from '../../data/placements'
import { makeLabelTexture } from '../../utils/labelTexture'

// Charge la photo d'un produit (null tant qu'elle n'est pas chargée ou si elle échoue)
function useProductPhoto(url: string | undefined, anisotropy: number) {
  const [texture, setTexture] = useState<Texture | null>(null)

  useEffect(() => {
    if (!url) return

    let cancelled = false
    let loaded: Texture | null = null

    new TextureLoader().load(
      url,
      (t) => {
        if (cancelled) {
          t.dispose()
          return
        }
        t.colorSpace = SRGBColorSpace
        t.anisotropy = anisotropy
        loaded = t
        setTexture(t)
      },
      undefined,
      () => console.warn(`Image de produit introuvable : ${url}`),
    )

    return () => {
      cancelled = true
      loaded?.dispose()
    }
  }, [url, anisotropy])

  return url ? texture : null
}

type ProductMeshProps = {
  product: Product
  matrices: Matrix4[]
}

function ProductMesh({ product, matrices }: ProductMeshProps) {
  const ref = useRef<InstancedMesh>(null)
  const anisotropy = useThree((state) =>
    Math.min(8, state.gl.capabilities.getMaxAnisotropy()),
  )

  const label = useMemo(() => makeLabelTexture(product), [product])
  const photo = useProductPhoto(product.image, anisotropy)
  const front = photo ?? label

  // Faces de BoxGeometry : +x, -x, +y, -y, +z (avant), -z
  const materials = useMemo(() => {
    const side = new MeshStandardMaterial({ color: product.color, roughness: 0.6 })
    const face = new MeshStandardMaterial({ map: front, roughness: 0.5 })
    return [side, side, side, side, face, side]
  }, [product.color, front])

  useEffect(() => () => label.dispose(), [label])
  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose())
    },
    [materials],
  )

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
      material={materials}
      frustumCulled={false}
    >
      <boxGeometry args={product.size} />
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