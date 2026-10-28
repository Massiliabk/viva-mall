import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box3, Ray, Vector3 } from 'three'
import { CHECKOUT_TARGETS } from '../../data/checkout'
import { useUiStore } from '../../store/useUiStore'
import { IS_TOUCH } from '../../utils/device'
import { rayFromScreen } from '../../utils/screenRay'

const REACH = 3 // distance maximale pour viser une caisse (en mètres)

const BOXES = CHECKOUT_TARGETS.map(
  (target) => new Box3(new Vector3(...target.min), new Vector3(...target.max)),
)
const hit = new Vector3()
const aimRay = new Ray()
const direction = new Vector3()

function hitsCheckout(ray: Ray) {
  return BOXES.some(
    (box) =>
      ray.intersectBox(box, hit) !== null &&
      hit.distanceTo(ray.origin) <= REACH,
  )
}

export function CheckoutPicker() {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)

  // Détecte si le viseur pointe vers une caisse ouverte
  useFrame(() => {
    const ui = useUiStore.getState()
    let aimed = false

    if (ui.locked) {
      camera.getWorldDirection(direction)
      aimRay.set(camera.position, direction)
      aimed = hitsCheckout(aimRay)
    }

    if (aimed !== ui.aimedCheckout) ui.setAimedCheckout(aimed)
  })

  useEffect(() => {
    const openCheckout = () => {
      const ui = useUiStore.getState()
      if (!ui.locked) return

      ui.openCart()
      ui.unlock()
      document.exitPointerLock()
    }

    // Clic, E ou bouton Payer : caisse visée par le viseur central
    const pay = () => {
      if (useUiStore.getState().aimedCheckout) openCheckout()
    }

    // Caisse touchée à l'écran (mode tactile)
    const onTap = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail
      if (hitsCheckout(rayFromScreen(camera, gl.domElement, x, y))) openCheckout()
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && !IS_TOUCH) pay()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.repeat && e.code === 'KeyE') pay()
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('viva-action', pay)
    window.addEventListener('viva-tap', onTap)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('viva-action', pay)
      window.removeEventListener('viva-tap', onTap)
    }
  }, [camera, gl])

  return null
}