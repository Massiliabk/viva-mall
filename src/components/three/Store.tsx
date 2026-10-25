import { ROOM } from '../../constants'

type WallProps = {
  position: [number, number, number]
  size: [number, number, number]
}

function Wall({ position, size }: WallProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#f4f0e6" roughness={0.9} />
    </mesh>
  )
}

export function Store() {
  const { width, depth, height, wallThickness: t } = ROOM

  return (
    <group>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#d8d2c4" roughness={0.6} />
      </mesh>

      {/* Plafond */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Murs : nord, sud, ouest, est */}
      <Wall position={[0, height / 2, -depth / 2]} size={[width, height, t]} />
      <Wall position={[0, height / 2, depth / 2]} size={[width, height, t]} />
      <Wall position={[-width / 2, height / 2, 0]} size={[t, height, depth]} />
      <Wall position={[width / 2, height / 2, 0]} size={[t, height, depth]} />
    </group>
  )
}