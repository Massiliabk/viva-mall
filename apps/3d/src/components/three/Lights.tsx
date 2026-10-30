import { ROOM } from '../../constants'

// Positions des panneaux lumineux du plafond (grille 3 x 3)
const PANEL_POSITIONS: [number, number][] = []
for (const x of [-8, 0, 8]) {
  for (const z of [-5, 0, 5]) {
    PANEL_POSITIONS.push([x, z])
  }
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#ffffff', '#cfc8b8', 1.1]} />
      <directionalLight position={[6, 8, 4]} intensity={1.2} />

      {/* Panneaux lumineux décoratifs au plafond */}
      {PANEL_POSITIONS.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, ROOM.height - 0.03, z]}>
          <boxGeometry args={[3, 0.05, 0.7]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </>
  )
}