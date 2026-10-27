import { SHELF } from '../../constants'
import type { ShelfData } from '../../data/layout'

const { width, depth, height, boardThickness, firstLevelY, levelGap } = SHELF

type ShelfProps = {
  data: ShelfData
}

export function Shelf({ data }: ShelfProps) {
  return (
    <group position={data.position} rotation={[0, data.rotationY, 0]}>
      {/* Panneau arrière */}
      <mesh position={[0, height / 2, -depth / 2 + 0.015]}>
        <boxGeometry args={[width, height, 0.03]} />
        <meshStandardMaterial color="#e5e8ec" />
      </mesh>

      {/* Côtés gauche et droit */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.02), height / 2, 0]}>
          <boxGeometry args={[0.04, height, depth]} />
          <meshStandardMaterial color="#aab2bd" />
        </mesh>
      ))}

      {/* Dessus du rayon */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width, boardThickness, depth]} />
        <meshStandardMaterial color="#aab2bd" />
      </mesh>

      {/* Bandeau coloré de la catégorie */}
      <mesh position={[0, height + 0.17, depth / 2 - 0.04]}>
        <boxGeometry args={[width, 0.3, 0.06]} />
        <meshStandardMaterial color={data.color} />
      </mesh>

      {/* Étagères */}
      {data.levels.map((_, level) => (
        <mesh key={level} position={[0, firstLevelY + level * levelGap, 0]}>
          <boxGeometry args={[width - 0.08, boardThickness, depth]} />
          <meshStandardMaterial color="#c3c9d1" />
        </mesh>
      ))}
    </group>
  )
}