import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { MathUtils, Vector3, type PerspectiveCamera } from 'three'
import { useKeyboard } from '../../hooks/useKeyboard'
import { EYE_HEIGHT, PLAYER_SPEED, ROOM } from '../../constants'
import { COLLIDERS } from '../../data/layout'
import { touchInput } from '../../store/touchInput'
import { useUiStore } from '../../store/useUiStore'
import { IS_TOUCH } from '../../utils/device'

const LIMIT_X = ROOM.width / 2 - 0.6
const LIMIT_Z = ROOM.depth / 2 - 0.6
const PLAYER_RADIUS = 0.35

const LOOK_SENSITIVITY = 0.005 // radians par pixel de glissement
const MAX_PITCH = Math.PI / 2 - 0.05
const DEAD_ZONE = 0.12 // zone morte du joystick

function isBlocked(x: number, z: number) {
  return COLLIDERS.some(
    (c) =>
      Math.abs(x - c.x) < c.halfX + PLAYER_RADIUS &&
      Math.abs(z - c.z) < c.halfZ + PLAYER_RADIUS,
  )
}

type PlayerProps = {
  onLock: () => void
  onUnlock: () => void
}

export function Player({ onLock, onUnlock }: PlayerProps) {
  const keys = useKeyboard()
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  const vectors = useMemo(
    () => ({
      front: new Vector3(),
      right: new Vector3(),
      move: new Vector3(),
    }),
    [],
  )

  // Regard au doigt : ordre des rotations adapté à la vue à la première personne
  useEffect(() => {
    if (IS_TOUCH) camera.rotation.order = 'YXZ'
  }, [camera])

  // Champ de vision plus large sur un écran en portrait
  useEffect(() => {
    const cam = camera as PerspectiveCamera
    cam.fov = size.width / size.height < 1 ? 90 : 70
    cam.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  useFrame((_, delta) => {
    const k = keys.current
    let forward = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0)
    let side = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0)

    // Commandes tactiles : joystick + glissement pour regarder
    if (IS_TOUCH && useUiStore.getState().locked) {
      if (Math.abs(touchInput.moveY) > DEAD_ZONE) forward += touchInput.moveY
      if (Math.abs(touchInput.moveX) > DEAD_ZONE) side += touchInput.moveX
      forward = MathUtils.clamp(forward, -1, 1)
      side = MathUtils.clamp(side, -1, 1)

      if (touchInput.lookDX !== 0 || touchInput.lookDY !== 0) {
        camera.rotation.y -= touchInput.lookDX * LOOK_SENSITIVITY
        camera.rotation.x = MathUtils.clamp(
          camera.rotation.x - touchInput.lookDY * LOOK_SENSITIVITY,
          -MAX_PITCH,
          MAX_PITCH,
        )
        touchInput.lookDX = 0
        touchInput.lookDY = 0
      }
    }

    if (forward !== 0 || side !== 0) {
      const { front, right, move } = vectors
      const magnitude = Math.min(1, Math.hypot(forward, side)) // vitesse proportionnelle au joystick

      camera.getWorldDirection(front)
      front.y = 0
      front.normalize()
      right.crossVectors(front, camera.up).normalize()

      move
        .set(0, 0, 0)
        .addScaledVector(front, forward)
        .addScaledVector(right, side)
        .normalize()
        .multiplyScalar(PLAYER_SPEED * delta * magnitude)

      // Déplacement axe par axe pour glisser le long des obstacles
      const nextX = camera.position.x + move.x
      if (!isBlocked(nextX, camera.position.z)) camera.position.x = nextX

      const nextZ = camera.position.z + move.z
      if (!isBlocked(camera.position.x, nextZ)) camera.position.z = nextZ
    }

    // Limites de la salle + hauteur des yeux fixe
    camera.position.x = MathUtils.clamp(camera.position.x, -LIMIT_X, LIMIT_X)
    camera.position.z = MathUtils.clamp(camera.position.z, -LIMIT_Z, LIMIT_Z)
    camera.position.y = EYE_HEIGHT
  })

  if (IS_TOUCH) return null

  return (
    <PointerLockControls
      selector="#enter-btn, #resume-btn"
      onLock={onLock}
      onUnlock={onUnlock}
    />
  )
}