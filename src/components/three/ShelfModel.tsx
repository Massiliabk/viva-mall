import { useMemo } from 'react'
import { Clone, useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import { SHELF, SHELF_MODEL } from '../../constants'

if (SHELF_MODEL.url) useGLTF.preload(SHELF_MODEL.url)

export function ShelfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)

  const fit = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())

    // Si le modèle est tourné de 90°, largeur et profondeur s'inversent
    const swap = Math.abs(Math.sin(SHELF_MODEL.rotationY)) > 0.5
    const target = swap
      ? [SHELF.depth, SHELF.height, SHELF.width]
      : [SHELF.width, SHELF.height, SHELF.depth]

    const scale: [number, number, number] = [
      target[0] / size.x,
      target[1] / size.y,
      target[2] / size.z,
    ]

    // Centré en x/z, posé sur le sol
    const position: [number, number, number] = [
      -center.x * scale[0],
      -box.min.y * scale[1],
      -center.z * scale[2],
    ]

    return { scale, position }
  }, [scene])

  return (
    <group rotation={[0, SHELF_MODEL.rotationY, 0]}>
      <group position={fit.position} scale={fit.scale}>
        <Clone object={scene} />
      </group>
    </group>
  )
}