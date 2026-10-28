import { FLOOR_TEXTURE, ROOM, WALL_TEXTURE } from '../../constants'
import { SHELVES } from '../../data/layout'
import { ProductInstances } from './ProductInstances'
import { Shelf } from './Shelf'
import { Surface } from './Surface'

type WallProps = {
  position: [number, number, number]
  size: [number, number, number]
}

function Wall({ position, size }: WallProps) {
  const length = Math.max(size[0], size[2]) // longueur visible du mur

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <Surface
        folder={WALL_TEXTURE.folder}
        tileSize={WALL_TEXTURE.tileSize}
        width={length}
        height={size[1]}
        color="#f4f0e6"
      />
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
        <Surface
          folder={FLOOR_TEXTURE.folder}
          tileSize={FLOOR_TEXTURE.tileSize}
          width={width}
          height={depth}
          color="#d8d2c4"
          tiles
        />
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

      {/* Rayons */}
      {SHELVES.map((shelf) => (
        <Shelf key={shelf.id} data={shelf} />
      ))}

      <ProductInstances />
    </group>
  )
}