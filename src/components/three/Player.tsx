import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useKeyboard } from '../../hooks/useKeyboard'
import { EYE_HEIGHT, PLAYER_SPEED, ROOM } from '../../constants'
import { COLLIDERS } from '../../data/layout'

const LIMIT_X = ROOM.width / 2 - 0.6
const LIMIT_Z = ROOM.depth / 2 - 0.6
const PLAYER_RADIUS = 0.35

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

  const vectors = useMemo(
    () => ({
      front: new Vector3(),
      right: new Vector3(),
      move: new Vector3(),
    }),
    [],
  )

  useFrame((_, delta) => {
    const k = keys.current
    const forward = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0)
    const side = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0)

    if (forward !== 0 || side !== 0) {
      const { front, right, move } = vectors

      camera.getWorldDirection(front)
      front.y = 0
      front.normalize()
      right.crossVectors(front, camera.up).normalize()

      move
        .set(0, 0, 0)
        .addScaledVector(front, forward)
        .addScaledVector(right, side)
        .normalize()
        .multiplyScalar(PLAYER_SPEED * delta)

      // Déplacement axe par axe pour glisser le long des obstacles
      const nextX = camera.position.x + move.x
      if (!isBlocked(nextX, camera.position.z)) camera.position.x = nextX

      const nextZ = camera.position.z + move.z
      if (!isBlocked(camera.position.x, nextZ)) camera.position.z = nextZ
    }

    // Limites de la salle + hauteur des yeux fixe
    camera.position.x = Math.max(-LIMIT_X, Math.min(LIMIT_X, camera.position.x))
    camera.position.z = Math.max(-LIMIT_Z, Math.min(LIMIT_Z, camera.position.z))
    camera.position.y = EYE_HEIGHT
  })

  return (
    <PointerLockControls
      selector="#enter-btn"
      onLock={onLock}
      onUnlock={onUnlock}
    />
  )
}