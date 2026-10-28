import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Ray, Vector3, type Mesh } from 'three'
import { BACK_PANELS, PLACEMENTS } from '../../data/placements'
import { PRODUCTS_BY_ID } from '../../data/products'
import { useCartStore } from '../../store/useCartStore'
import { useFlightStore } from '../../store/useFlightStore'
import { useUiStore } from '../../store/useUiStore'
import { IS_TOUCH } from '../../utils/device'
import { rayFromScreen } from '../../utils/screenRay'

const REACH = 3.2 // distance maximale pour attraper un produit (en mètres)
const hit = new Vector3()

// Produit le plus proche touché par le rayon (-1 si aucun ou caché derrière un rayon)
function pickProduct(ray: Ray) {
  const origin = ray.origin
  let bestIndex = -1
  let bestDistance = REACH

  for (let i = 0; i < PLACEMENTS.length; i++) {
    const { box } = PLACEMENTS[i]
    if (box.distanceToPoint(origin) > REACH) continue
    if (!ray.intersectBox(box, hit)) continue

    const distance = hit.distanceTo(origin)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = i
    }
  }

  // Un produit caché derrière le panneau arrière d'un rayon est ignoré
  if (bestIndex >= 0) {
    for (const panel of BACK_PANELS) {
      if (ray.intersectBox(panel, hit) && hit.distanceTo(origin) < bestDistance) {
        return -1
      }
    }
  }

  return bestIndex
}

export function ProductPicker() {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const highlight = useRef<Mesh>(null)
  const lastIndex = useRef(-1)

  const tools = useMemo(
    () => ({
      ray: new Ray(),
      direction: new Vector3(),
      center: new Vector3(),
      size: new Vector3(),
    }),
    [],
  )

  // Détection du produit visé par le viseur central
  useFrame(() => {
    const { ray, direction, center, size } = tools
    let bestIndex = -1

    if (useUiStore.getState().locked) {
      camera.getWorldDirection(direction)
      ray.set(camera.position, direction)
      bestIndex = pickProduct(ray)
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

  useEffect(() => {
    // Ajoute le produit de cet emplacement au panier, avec le vol jusqu'au chariot
    const addProductAt = (index: number) => {
      const { locked, notify } = useUiStore.getState()
      if (!locked || index < 0) return

      const { productId, box } = PLACEMENTS[index]
      const center = box.getCenter(new Vector3())
      useFlightStore
        .getState()
        .addFlight(productId, [center.x, center.y, center.z])

      useCartStore.getState().addItem(productId)
      const quantity = useCartStore.getState().items[productId]
      notify(`${PRODUCTS_BY_ID[productId].name} ajouté (×${quantity})`)
    }

    // Produit visé par le viseur central : clic, touche E ou bouton +
    const addAimed = () => addProductAt(lastIndex.current)

    // Produit touché à l'écran (mode tactile)
    const onTap = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail
      addProductAt(pickProduct(rayFromScreen(camera, gl.domElement, x, y)))
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && !IS_TOUCH) addAimed()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const ui = useUiStore.getState()
      if (!ui.locked) return

      if (e.code === 'KeyE') addAimed()
      if (e.code === 'KeyC') {
        ui.openCart()
        document.exitPointerLock()
      }
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('viva-action', addAimed)
    window.addEventListener('viva-tap', onTap)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('viva-action', addAimed)
      window.removeEventListener('viva-tap', onTap)
    }
  }, [camera, gl])

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