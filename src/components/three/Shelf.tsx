import { useMemo } from 'react'
import { BRAND } from '../../brand'
import { SHELF } from '../../constants'
import { CATEGORIES, type ShelfData } from '../../data/layout'
import { makeSignTexture } from '../../utils/signTexture'

const { width, depth, height, boardThickness, firstLevelY, levelGap } = SHELF
const BANNER_HEIGHT = 0.4

type ShelfProps = {
  data: ShelfData
}

export function Shelf({ data }: ShelfProps) {
  // Les catégories alternent rouge / bleu
  const categoryIndex = Math.max(
    0,
    CATEGORIES.findIndex((c) => c.name === data.category),
  )
  const accent = categoryIndex % 2 === 0 ? BRAND.red : BRAND.blue

  const bannerTexture = useMemo(
    () =>
      makeSignTexture({
        width: 1024,
        height: 124,
        background: accent,
        lines: [{ text: data.category.toUpperCase(), size: 66 }],
      }),
    [accent, data.category],
  )

  const bannerY = height + 0.02 + BANNER_HEIGHT / 2
  const bannerZ = depth / 2 - 0.04

  return (
    <group position={data.position} rotation={[0, data.rotationY, 0]}>
      {/* Panneau arrière */}
      <mesh position={[0, height / 2, -depth / 2 + 0.015]}>
        <boxGeometry args={[width, height, 0.03]} />
        <meshStandardMaterial color="#f1f3f6" />
      </mesh>

      {/* Montants latéraux bleus */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.02), height / 2, 0]}>
          <boxGeometry args={[0.04, height, depth]} />
          <meshStandardMaterial color={BRAND.blue} />
        </mesh>
      ))}

      {/* Dessus du rayon */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width, boardThickness, depth]} />
        <meshStandardMaterial color={BRAND.blue} />
      </mesh>

      {/* Étagères avec rail à étiquettes */}
      {data.levels.map((_, level) => {
        const boardY = firstLevelY + level * levelGap
        return (
          <group key={level}>
            <mesh position={[0, boardY, 0]}>
              <boxGeometry args={[width - 0.08, boardThickness, depth]} />
              <meshStandardMaterial color="#d5dae1" />
            </mesh>
            <mesh position={[0, boardY + 0.02, depth / 2 - 0.01]}>
              <boxGeometry args={[width - 0.08, 0.035, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        )
      })}

      {/* Bandeau de catégorie */}
      <mesh position={[0, bannerY, bannerZ]}>
        <boxGeometry args={[width, BANNER_HEIGHT, 0.06]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, bannerY, bannerZ + 0.031]}>
        <planeGeometry args={[width - 0.04, BANNER_HEIGHT - 0.04]} />
        <meshBasicMaterial map={bannerTexture} toneMapped={false} />
      </mesh>
    </group>
  )
}