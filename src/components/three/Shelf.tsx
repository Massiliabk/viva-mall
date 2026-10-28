import { SHELF, SHELF_MODEL } from '../../constants'
import type { ShelfData } from '../../data/layout'
import { ShelfModel } from './ShelfModel'

const { width, depth, height, boardThickness, firstLevelY, levelGap } = SHELF

// Rayon généré (utilisé quand aucun modèle glTF n'est configuré)
function ProceduralFrame({ levels }: { levels: number }) {
  return (
    <>
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

      {/* Étagères */}
      {Array.from({ length: levels }, (_, level) => (
        <mesh key={level} position={[0, firstLevelY + level * levelGap, 0]}>
          <boxGeometry args={[width - 0.08, boardThickness, depth]} />
          <meshStandardMaterial color="#c3c9d1" />
        </mesh>
      ))}
    </>
  )
}

type ShelfProps = {
  data: ShelfData
}

export function Shelf({ data }: ShelfProps) {
  return (
    <group position={data.position} rotation={[0, data.rotationY, 0]}>
      {SHELF_MODEL.url ? (
        <ShelfModel url={SHELF_MODEL.url} />
      ) : (
        <ProceduralFrame levels={data.levels.length} />
      )}

      {/* Bandeau coloré de la catégorie */}
      <mesh position={[0, height + 0.17, depth / 2 - 0.04]}>
        <boxGeometry args={[width, 0.3, 0.06]} />
        <meshStandardMaterial color={data.color} />
      </mesh>
    </group>
  )
}