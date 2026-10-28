import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Ray, Vector3, type Mesh } from 'three'
import { BACK_PANELS, PLACEMENTS } from '../../data/placements'
import { PRODUCTS_BY_ID } from '../../data/products'
import { useCartStore } from '../../store/useCartStore'
import { useUiStore } from '../../store/useUiStore'
import { useFlightStore } from '../../store/useFlightStore'

const REACH = 3.2 // distance maximale pour viser un produit (en mètres)

export function ProductPicker() {
  const camera = useThree((state) => state.camera)
  const highlight = useRef<Mesh>(null)
  const lastIndex = useRef(-1)

  const tools = useMemo(
    () => ({
      ray: new Ray(),
      direction: new Vector3(),
      hit: new Vector3(),
      center: new Vector3(),
      size: new Vector3(),
    }),
    [],
  )

  // Détection du produit visé
  useFrame(() => {
    const { ray, direction, hit, center, size } = tools
    let bestIndex = -1

    if (useUiStore.getState().locked) {
      camera.getWorldDirection(direction)
      ray.set(camera.position, direction)

      let bestDistance = REACH
      for (let i = 0; i < PLACEMENTS.length; i++) {
        const { box } = PLACEMENTS[i]
        if (box.distanceToPoint(camera.position) > REACH) continue
        if (!ray.intersectBox(box, hit)) continue

        const distance = hit.distanceTo(camera.position)
        if (distance < bestDistance) {
          bestDistance = distance
          bestIndex = i
        }
      }

      // Un produit caché derrière le panneau arrière d'un rayon est ignoré
      if (bestIndex >= 0) {
        for (const panel of BACK_PANELS) {
          if (
            ray.intersectBox(panel, hit) &&
            hit.distanceTo(camera.position) < bestDistance
          ) {
            bestIndex = -1
            break
          }
        }
      }
    }

    if (bestIndex === lastIndex.current) return
    lastIndex.current = bestIndex

    const mesh = highlight.current
    if (bestIndex >= 0) {
      const { box, productId } = PLACEMENTS[bestIndex]
      if (mesh) {
        box.getCenter(center)
        box.getSize(size)
        mesh.position.copy(center)
        mesh.scale.copy(size).addScalar(0.02)
        mesh.visible = true
      }
      useUiStore.getState().setAimed(productId)
    } else {
      if (mesh) mesh.visible = false
      useUiStore.getState().setAimed(null)
    }
  })

  // Clic / E : ajouter au panier · C : ouvrir le panier
  useEffect(() => {
    const addAimedProduct = () => {
      const { locked, aimedProductId, notify } = useUiStore.getState()
      if (!locked || !aimedProductId) return

      // Le produit vole du rayon jusqu'au chariot
      const index = lastIndex.current
      if (index >= 0) {
        const center = PLACEMENTS[index].box.getCenter(new Vector3())
        useFlightStore
          .getState()
          .addFlight(aimedProductId, [center.x, center.y, center.z])
      }

      useCartStore.getState().addItem(aimedProductId)
      const quantity = useCartStore.getState().items[aimedProductId]
      notify(`${PRODUCTS_BY_ID[aimedProductId].name} ajouté (×${quantity})`)
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) addAimedProduct()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const ui = useUiStore.getState()
      if (!ui.locked) return

      if (e.code === 'KeyE') addAimedProduct()
      if (e.code === 'KeyC') {
        ui.openCart()
        document.exitPointerLock()
      }
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Boîte verte translucide autour du produit visé
  return (
    <mesh ref={highlight} visible={false} renderOrder={10}>
      <boxGeometry />
      <meshBasicMaterial
        color="#34d399"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </mesh>
  )
}