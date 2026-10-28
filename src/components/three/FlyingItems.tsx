import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3, type Mesh } from 'three'
import { PRODUCTS_BY_ID } from '../../data/products'
import { cartAnchor } from '../../store/cartAnchor'
import { useFlightStore, type Flight } from '../../store/useFlightStore'

const DURATION = 0.6 // secondes
const ARC_HEIGHT = 0.35 // hauteur de l'arc, en mètres

function FlyingItem({ flight }: { flight: Flight }) {
  const ref = useRef<Mesh>(null)
  const elapsed = useRef(0)
  const done = useRef(false)

  const start = useMemo(() => new Vector3(...flight.from), [flight.from])
  const product = PRODUCTS_BY_ID[flight.productId]

  useFrame((_, delta) => {
    const mesh = ref.current
    if (!mesh || done.current) return

    elapsed.current += delta
    const t = Math.min(elapsed.current / DURATION, 1)
    const eased = t * t * (3 - 2 * t)

    mesh.position.lerpVectors(start, cartAnchor.position, eased)
    mesh.position.y += Math.sin(Math.PI * t) * ARC_HEIGHT
    mesh.rotation.y = t * Math.PI * 2
    mesh.scale.setScalar(MathUtils.lerp(1, 0.7, eased))

    if (t >= 1) {
      done.current = true
      useFlightStore.getState().land(flight.id)
    }
  })

  return (
    <mesh ref={ref} position={flight.from}>
      <boxGeometry args={product.size} />
      <meshStandardMaterial
        color={product.color}
        emissive={product.color}
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

export function FlyingItems() {
  const flights = useFlightStore((s) => s.flights)

  return (
    <>
      {flights.map((flight) => (
        <FlyingItem key={flight.id} flight={flight} />
      ))}
    </>
  )
}