import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box3, Ray, Vector3 } from 'three'
import { CHECKOUT_TARGETS } from '../../data/checkout'
import { useUiStore } from '../../store/useUiStore'

const REACH = 3 // distance maximale pour viser une caisse (en mètres)

export function CheckoutPicker() {
  const camera = useThree((state) => state.camera)

  const tools = useMemo(
    () => ({
      ray: new Ray(),
      direction: new Vector3(),
      hit: new Vector3(),
      boxes: CHECKOUT_TARGETS.map(
        (target) => new Box3(new Vector3(...target.min), new Vector3(...target.max)),
      ),
    }),
    [],
  )

  // Détecte si le viseur pointe vers une caisse ouverte
  useFrame(() => {
    const ui = useUiStore.getState()
    let aimed = false

    if (ui.locked) {
      const { ray, direction, hit, boxes } = tools
      camera.getWorldDirection(direction)
      ray.set(camera.position, direction)

      aimed = boxes.some(
        (box) =>
          ray.intersectBox(box, hit) !== null &&
          hit.distanceTo(camera.position) <= REACH,
      )
    }

    if (aimed !== ui.aimedCheckout) ui.setAimedCheckout(aimed)
  })

  // Clic ou E sur une caisse : ouvre le panier
  useEffect(() => {
    const pay = () => {
      const ui = useUiStore.getState()
      if (!ui.locked || !ui.aimedCheckout) return

      ui.openCart()
      document.exitPointerLock()
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) pay()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.repeat && e.code === 'KeyE') pay()
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}