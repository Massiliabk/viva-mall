import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3, type Group } from 'three'
import { ROOM } from '../../constants'
import { COLLIDERS } from '../../data/layout'
import { PRODUCTS_BY_ID, type Product } from '../../data/products'
import { cartAnchor } from '../../store/cartAnchor'
import { useCartStore } from '../../store/useCartStore'
import { useFlightStore } from '../../store/useFlightStore'

const BASKET = { width: 0.56, length: 0.96, height: 0.38, bottomY: 0.5 }
const TOP_Y = BASKET.bottomY + BASKET.height

const LIMIT_X = ROOM.width / 2 - 0.6
const LIMIT_Z = ROOM.depth / 2 - 0.6
const CART_RADIUS = 0.5

// Positions possibles du chariot par rapport au joueur : [devant, côté droit]
const SPOTS: [number, number][] = [
  [1.5, 0],
  [1.1, 0],
  [0.6, 0.85],
  [0.6, -0.85],
  [0.2, 0.9],
]

function isBlocked(x: number, z: number) {
  return COLLIDERS.some(
    (c) =>
      Math.abs(x - c.x) < c.halfX + CART_RADIUS &&
      Math.abs(z - c.z) < c.halfZ + CART_RADIUS,
  )
}

type PartProps = {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
  opacity?: number
}

function Part({ position, size, color = '#aeb7c2', opacity = 1 }: PartProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.45}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity >= 1}
      />
    </mesh>
  )
}

function CartBody() {
  const { width, length, height, bottomY } = BASKET
  const midY = bottomY + height / 2

  return (
    <>
      {/* Fond du panier */}
      <Part position={[0, bottomY, 0]} size={[width, 0.02, length]} />

      {/* Parois (translucides) */}
      {[-1, 1].map((side) => (
        <Part
          key={`long-${side}`}
          position={[side * (width / 2 - 0.01), midY, 0]}
          size={[0.02, height, length]}
          opacity={0.35}
        />
      ))}
      {[-1, 1].map((side) => (
        <Part
          key={`short-${side}`}
          position={[0, midY, side * (length / 2 - 0.01)]}
          size={[width, height, 0.02]}
          opacity={0.35}
        />
      ))}

      {/* Bordure supérieure */}
      {[-1, 1].map((side) => (
        <Part
          key={`rim-long-${side}`}
          position={[side * (width / 2), TOP_Y, 0]}
          size={[0.03, 0.03, length + 0.02]}
        />
      ))}
      {[-1, 1].map((side) => (
        <Part
          key={`rim-short-${side}`}
          position={[0, TOP_Y, side * (length / 2)]}
          size={[width + 0.02, 0.03, 0.03]}
        />
      ))}

      {/* Pieds et roues */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <group key={`${sx}-${sz}`} position={[sx * 0.22, 0, sz * 0.38]}>
            <Part position={[0, 0.28, 0]} size={[0.03, 0.44, 0.03]} />
            <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 14]} />
              <meshStandardMaterial color="#2d3436" roughness={0.7} />
            </mesh>
          </group>
        )),
      )}

      {/* Poignée (côté joueur, z négatif) */}
      {[-1, 1].map((side) => (
        <Part
          key={`handle-post-${side}`}
          position={[side * (width / 2), TOP_Y + 0.08, -length / 2]}
          size={[0.03, 0.16, 0.03]}
        />
      ))}
      <Part
        position={[0, TOP_Y + 0.14, -length / 2 - 0.02]}
        size={[width + 0.06, 0.04, 0.04]}
        color="#10b981"
      />
    </>
  )
}

// Produits visibles dans le chariot (ceux qui volent encore n'y sont pas)
const CELL = 0.1
const COLS = 5
const ROWS = 9
const PER_LAYER = COLS * ROWS
const MAX_VISIBLE = 72

function CartContents() {
  const items = useCartStore((s) => s.items)
  const flights = useFlightStore((s) => s.flights)

  const visible = useMemo(() => {
    const inFlight: Record<string, number> = {}
    for (const flight of flights) {
      inFlight[flight.productId] = (inFlight[flight.productId] ?? 0) + 1
    }

    const list: Product[] = []
    for (const [id, quantity] of Object.entries(items)) {
      const shown = quantity - (inFlight[id] ?? 0)
      for (let i = 0; i < shown; i++) list.push(PRODUCTS_BY_ID[id])
    }
    return list.slice(0, MAX_VISIBLE)
  }, [items, flights])

  return (
    <>
      {visible.map((product, i) => {
        const layer = Math.floor(i / PER_LAYER)
        const cell = i % PER_LAYER
        const col = cell % COLS
        const row = Math.floor(cell / COLS)

        const [w, h, d] = product.size
        const s = Math.min(1, 0.12 / Math.max(w, d)) // les gros produits rentrent dans leur case

        const x = (col - (COLS - 1) / 2) * CELL
        const z = (row - (ROWS - 1) / 2) * CELL
        const y = BASKET.bottomY + 0.01 + layer * 0.3 + (h * s) / 2

        return (
          <mesh
            key={i}
            position={[x, y, z]}
            rotation={[0, (((i * 37) % 21) - 10) * 0.03, 0]}
            scale={[w * s, h * s, d * s]}
          >
            <boxGeometry />
            <meshStandardMaterial color={product.color} roughness={0.6} />
          </mesh>
        )
      })}
    </>
  )
}

export function ShoppingCart() {
  const camera = useThree((state) => state.camera)
  const root = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const memory = useRef({ yaw: 0, ready: false })
  const direction = useMemo(() => new Vector3(), [])

  useFrame((_, delta) => {
    const group = root.current
    if (!group) return
    const m = memory.current

    // Direction horizontale du regard
    camera.getWorldDirection(direction)
    const looking = Math.hypot(direction.x, direction.z) > 0.05
    const targetYaw = looking ? Math.atan2(direction.x, direction.z) : m.yaw

    const first = !m.ready
    if (first) {
      m.yaw = targetYaw
      m.ready = true
    }

    // Le chariot tourne avec un léger retard (par le chemin le plus court)
    const diff = Math.atan2(Math.sin(targetYaw - m.yaw), Math.cos(targetYaw - m.yaw))
    m.yaw += diff * (1 - Math.exp(-6 * delta))

    const fx = Math.sin(m.yaw)
    const fz = Math.cos(m.yaw)
    const rx = -fz // vecteur "droite"
    const rz = fx

    // Premier emplacement libre : devant, sinon sur le côté
    let tx = camera.position.x + fx * 1.1
    let tz = camera.position.z + fz * 1.1
    for (const [ahead, side] of SPOTS) {
      const x = camera.position.x + fx * ahead + rx * side
      const z = camera.position.z + fz * ahead + rz * side
      if (!isBlocked(x, z)) {
        tx = x
        tz = z
        break
      }
    }
    tx = MathUtils.clamp(tx, -LIMIT_X, LIMIT_X)
    tz = MathUtils.clamp(tz, -LIMIT_Z, LIMIT_Z)

    if (first) {
      group.position.set(tx, 0, tz)
    } else {
      group.position.x = MathUtils.damp(group.position.x, tx, 10, delta)
      group.position.z = MathUtils.damp(group.position.z, tz, 10, delta)
    }
    group.rotation.y = m.yaw

    // Point d'arrivée des produits qui volent
    cartAnchor.position.set(
      group.position.x + fx * 0.2,
      TOP_Y - 0.03,
      group.position.z + fz * 0.2,
    )

    // Petit rebond quand un produit atterrit
    const body = inner.current
    if (body) {
      const since = (performance.now() - useFlightStore.getState().landedAt) / 1000
      const bounce = since < 1 ? Math.exp(-9 * since) * Math.sin(28 * since) * 0.05 : 0
      body.scale.set(1 - bounce * 0.5, 1 + bounce, 1 - bounce * 0.5)
    }
  })

  return (
    <group ref={root}>
      <group ref={inner}>
        <CartBody />
        <CartContents />
      </group>
    </group>
  )
}