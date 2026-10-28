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
  const { chilled } = data

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

  // Meuble réfrigéré : auvent plus profond, face avant portant le nom de la catégorie
  const bannerDepth = chilled ? depth + 0.08 : 0.06
  const bannerZ = chilled ? 0.04 : depth / 2 - 0.04
  const bannerFront = bannerZ + bannerDepth / 2 + 0.002
  const bannerY = height + 0.02 + BANNER_HEIGHT / 2

  const frameColor = chilled ? '#e6ebf2' : BRAND.blue
  const backColor = chilled ? '#d6ebff' : '#f1f3f6'
  const boardColor = chilled ? '#dfe8f2' : '#d5dae1'

  return (
    <group position={data.position} rotation={[0, data.rotationY, 0]}>
      {/* Panneau arrière */}
      <mesh position={[0, height / 2, -depth / 2 + 0.015]}>
        <boxGeometry args={[width, height, 0.03]} />
        <meshStandardMaterial color={backColor} />
      </mesh>

      {/* Montants latéraux */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.02), height / 2, 0]}>
          <boxGeometry args={[0.04, height, depth]} />
          <meshStandardMaterial color={frameColor} />
        </mesh>
      ))}

      {/* Dessus du rayon */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width, boardThickness, depth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Étagères avec rail à étiquettes */}
      {data.levels.map((_, level) => {
        const boardY = firstLevelY + level * levelGap
        return (
          <group key={level}>
            <mesh position={[0, boardY, 0]}>
              <boxGeometry args={[width - 0.08, boardThickness, depth]} />
              <meshStandardMaterial color={boardColor} />
            </mesh>
            <mesh position={[0, boardY + 0.02, depth / 2 - 0.01]}>
              <boxGeometry args={[width - 0.08, 0.035, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Éclairage froid sous l'étagère du dessus (meubles réfrigérés) */}
            {chilled && (
              <mesh position={[0, firstLevelY + (level + 1) * levelGap - 0.03, depth / 2 - 0.1]}>
                <boxGeometry args={[width - 0.1, 0.012, 0.04]} />
                <meshBasicMaterial color="#cfe9ff" toneMapped={false} />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Bandeau de catégorie (auvent blanc pour le rayon frais) */}
      <mesh position={[0, bannerY, bannerZ]}>
        <boxGeometry args={[width, BANNER_HEIGHT, bannerDepth]} />
        <meshStandardMaterial color={chilled ? '#f4f7fb' : accent} />
      </mesh>
      <mesh position={[0, bannerY, bannerFront]}>
        <planeGeometry args={[width - 0.04, BANNER_HEIGHT - 0.04]} />
        <meshBasicMaterial map={bannerTexture} toneMapped={false} />
      </mesh>
    </group>
  )
}