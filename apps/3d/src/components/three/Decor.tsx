import { useMemo } from 'react'
import { DoubleSide } from 'three'
import { BRAND } from '../../brand'
import { ROOM } from '../../constants'
import { SHELVES } from '../../data/layout'
import { PROMO_ISLANDS, TOTEMS, TOTEM_SIZE } from '../../data/decor'
import { makeLogoTexture, makeSignTexture } from '../../utils/signTexture'

type Wall = 'back' | 'front' | 'left' | 'right'
type Tone = 'red' | 'blue'

const toneColor = (tone: Tone) => (tone === 'red' ? BRAND.red : BRAND.blue)
const otherColor = (tone: Tone) => (tone === 'red' ? BRAND.blue : BRAND.red)

// Position et orientation d'un élément collé sur la face intérieure d'un mur
function onWall(wall: Wall, offset: number, y: number, inset = 0.02) {
  const { width: W, depth: D, wallThickness: t } = ROOM
  const result: { position: [number, number, number]; rotationY: number } =
    wall === 'back'
      ? { position: [offset, y, -D / 2 + t / 2 + inset], rotationY: 0 }
      : wall === 'front'
        ? { position: [offset, y, D / 2 - t / 2 - inset], rotationY: Math.PI }
        : wall === 'left'
          ? { position: [-W / 2 + t / 2 + inset, y, offset], rotationY: Math.PI / 2 }
          : { position: [W / 2 - t / 2 - inset, y, offset], rotationY: -Math.PI / 2 }
  return result
}

/* ---------- Bandeaux et ligne LED le long des murs ---------- */

const BANDS = [
  { y: 2.55, height: 0.18, color: BRAND.blue },
  { y: 2.72, height: 0.05, color: BRAND.red },
  { y: 3.97, height: 0.05, color: '#6a86ff' }, // ligne LED
]

function WallBands() {
  const { width: W, depth: D, wallThickness: t } = ROOM
  const walls: { wall: Wall; length: number }[] = [
    { wall: 'back', length: W - t },
    { wall: 'front', length: W - t },
    { wall: 'left', length: D - t },
    { wall: 'right', length: D - t },
  ]

  return (
    <>
      {walls.flatMap(({ wall, length }) =>
        BANDS.map((band) => {
          const { position, rotationY } = onWall(wall, 0, band.y, 0.012)
          return (
            <mesh
              key={`${wall}-${band.y}`}
              position={position}
              rotation={[0, rotationY, 0]}
            >
              <planeGeometry args={[length, band.height]} />
              <meshBasicMaterial color={band.color} toneMapped={false} />
            </mesh>
          )
        }),
      )}
    </>
  )
}

/* ---------- Enseignes "viva mall" ---------- */

function BrandSign({ wall, offset, width }: { wall: Wall; offset: number; width: number }) {
  const logo = useMemo(() => makeLogoTexture(), [])
  const height = width / 2.6
  const inner = height - 0.2
  const { position, rotationY } = onWall(wall, offset, 3.17)

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[width, height, 0.08]} />
        <meshStandardMaterial color={BRAND.blue} />
      </mesh>
      <mesh position={[0, 0, 0.082]}>
        <planeGeometry args={[width - 0.2, inner]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.084]}>
        <planeGeometry args={[inner * 2, inner]} />
        <meshBasicMaterial map={logo} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ---------- Affiches publicitaires ---------- */

type PosterData = {
  wall: Wall
  offset: number
  title: string
  subtitle: string
  tone: Tone
}

// Textes génériques : remplace-les par les vrais slogans de Viva Mall
const POSTERS: PosterData[] = [
  { wall: 'back', offset: -7, title: 'PROMOTIONS', subtitle: 'Chaque semaine', tone: 'red' },
  { wall: 'back', offset: 7, title: 'FRAÎCHEUR', subtitle: 'Chaque jour', tone: 'blue' },
  { wall: 'left', offset: -5.5, title: 'NOUVEAUTÉS', subtitle: 'À découvrir en rayon', tone: 'blue' },
  { wall: 'left', offset: 5.5, title: 'BONS PLANS', subtitle: 'À ne pas manquer', tone: 'red' },
  { wall: 'right', offset: -5.5, title: 'PROMOTIONS', subtitle: 'À ne pas manquer', tone: 'red' },
  { wall: 'right', offset: 5.5, title: 'NOUVEAUTÉS', subtitle: 'À découvrir en rayon', tone: 'blue' },
  { wall: 'front', offset: -6, title: 'BIENVENUE', subtitle: 'Bonnes courses !', tone: 'blue' },
  { wall: 'front', offset: 6, title: 'BIENVENUE', subtitle: 'Bonnes courses !', tone: 'red' },
]

function Poster({ wall, offset, title, subtitle, tone }: PosterData) {
  const texture = useMemo(
    () =>
      makeSignTexture({
        width: 1024,
        height: 448,
        background: toneColor(tone),
        stripe: otherColor(tone),
        lines: [
          { text: title, size: 120 },
          { text: subtitle, size: 52 },
        ],
      }),
    [tone, title, subtitle],
  )
  const { position, rotationY } = onWall(wall, offset, 3.17)

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[3.3, 1.5, 0.06]} />
        <meshStandardMaterial color="#f1f1f1" />
      </mesh>
      <mesh position={[0, 0, 0.062]}>
        <planeGeometry args={[3.2, 1.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ---------- Panneaux d'allée suspendus ---------- */

const AISLE_END_X = 9.6

type Aisle = { number: number; z: number; names: string }

// Déduit chaque allée des gondoles définies dans layout.ts
const AISLES: Aisle[] = [0, 1, 2].flatMap((a) => {
  const back = SHELVES.find((s) => s.id === `gondole-${a}-fond-0`)
  const front = SHELVES.find((s) => s.id === `gondole-${a}-entree-0`)
  if (!back || !front) return []
  return [
    {
      number: a + 1,
      z: (back.position[2] + front.position[2]) / 2,
      names: `${back.category} · ${front.category}`,
    },
  ]
})

function AisleSign({ x, aisle }: { x: number; aisle: Aisle }) {
  const tone: Tone = aisle.number % 2 === 1 ? 'blue' : 'red'
  const texture = useMemo(
    () =>
      makeSignTexture({
        width: 1024,
        height: 400,
        background: toneColor(tone),
        stripe: otherColor(tone),
        lines: [
          { text: `ALLÉE ${aisle.number}`, size: 150 },
          { text: aisle.names, size: 56 },
        ],
      }),
    [tone, aisle.number, aisle.names],
  )

  return (
    <group position={[x, 3.35, aisle.z]}>
      {/* Câbles de suspension */}
      {[-0.8, 0.8].map((dz) => (
        <mesh key={dz} position={[0, 0.52, dz]}>
          <cylinderGeometry args={[0.01, 0.01, 0.26, 6]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      ))}

      {/* Tranche du panneau */}
      <mesh>
        <boxGeometry args={[0.05, 0.78, 2]} />
        <meshStandardMaterial color={BRAND.blue} />
      </mesh>

      {/* Deux faces, lisibles des deux côtés */}
      {[1, -1].map((dir) => (
        <mesh
          key={dir}
          position={[dir * 0.03, 0, 0]}
          rotation={[0, (dir * Math.PI) / 2, 0]}
        >
          <planeGeometry args={[2, 0.78]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Lampes suspendues ---------- */

const PENDANT_X = [-8, -4.8, -1.6, 1.6, 4.8, 8]

function Pendant({ x, tone }: { x: number; tone: Tone }) {
  return (
    <group position={[x, 3.1, 6.4]}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.9, 6]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.12, 0.4, 0.28, 28, 1, true]} />
        <meshStandardMaterial color={toneColor(tone)} side={DoubleSide} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshBasicMaterial color="#fff6dd" toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ---------- Îlots promotionnels ---------- */

const PROMO_COLORS = [BRAND.red, BRAND.blue, '#ffffff', '#f4c430']

function PromoIsland({ island }: { island: (typeof PROMO_ISLANDS)[number] }) {
  const { x, z, width, depth, tone, label } = island
  const accent = toneColor(tone)

  const texture = useMemo(
    () =>
      makeSignTexture({
        width: 768,
        height: 256,
        background: accent,
        stripe: '#ffffff',
        lines: [{ text: label, size: 110 }],
      }),
    [accent, label],
  )

  // Produits décoratifs posés sur l'îlot
  const boxes = useMemo(() => {
    const list: { x: number; y: number; z: number; h: number; color: string }[] = []
    const cols = Math.floor((width - 0.2) / 0.3)
    const rows = Math.floor((depth - 0.2) / 0.3)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const h = 0.18 + ((r * 7 + c * 13) % 5) * 0.04
        list.push({
          x: (c - (cols - 1) / 2) * 0.3,
          y: 0.76 + h / 2,
          z: (r - (rows - 1) / 2) * 0.3,
          h,
          color: PROMO_COLORS[(r + c) % PROMO_COLORS.length],
        })
      }
    }
    return list
  }, [width, depth])

  return (
    <group position={[x, 0, z]}>
      {/* Table et liseré de couleur */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[width, 0.7, depth]} />
        <meshStandardMaterial color="#f1f3f6" />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[width + 0.04, 0.06, depth + 0.04]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Produits décoratifs */}
      {boxes.map((box, i) => (
        <mesh key={i} position={[box.x, box.y, box.z]} scale={[0.24, box.h, 0.22]}>
          <boxGeometry />
          <meshStandardMaterial color={box.color} roughness={0.6} />
        </mesh>
      ))}

      {/* Panneau sur pieds */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.8, 1.1, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.75, 8]} />
          <meshStandardMaterial color="#9aa3ae" />
        </mesh>
      ))}
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[1.8, 0.6, 0.04]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {[1, -1].map((dir) => (
        <mesh
          key={dir}
          position={[0, 1.45, dir * 0.022]}
          rotation={[0, dir === 1 ? 0 : Math.PI, 0]}
        >
          <planeGeometry args={[1.76, 0.58]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Totems d'accueil ---------- */

function Totem({ x, z }: { x: number; z: number }) {
  const texture = useMemo(
    () =>
      makeSignTexture({
        width: 512,
        height: 1024,
        background: BRAND.blue,
        stripe: BRAND.red,
        lines: [
          { text: 'BIENVENUE', size: 78 },
          { text: 'chez', size: 56 },
          { text: 'viva mall', size: 110 },
        ],
      }),
    [],
  )

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[TOTEM_SIZE.width, 0.08, TOTEM_SIZE.depth]} />
        <meshStandardMaterial color="#f1f3f6" />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <boxGeometry args={[TOTEM_SIZE.width, 1.8, 0.08]} />
        <meshStandardMaterial color="#f1f3f6" />
      </mesh>
      {[1, -1].map((dir) => (
        <mesh
          key={dir}
          position={[0, 0.98, dir * 0.041]}
          rotation={[0, dir === 1 ? 0 : Math.PI, 0]}
        >
          <planeGeometry args={[TOTEM_SIZE.width - 0.04, 1.76]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Tapis de bienvenue ---------- */

function WelcomeMat() {
  const texture = useMemo(
    () =>
      makeSignTexture({
        width: 1024,
        height: 448,
        background: BRAND.blue,
        stripe: BRAND.red,
        lines: [
          { text: 'BIENVENUE', size: 130 },
          { text: 'chez viva mall', size: 70 },
        ],
      }),
    [],
  )

  return (
    <mesh position={[0, 0.012, 6.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.6, 1.575]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

/* ---------- Ensemble ---------- */

export function Decor() {
  return (
    <>
      <WallBands />

      <BrandSign wall="back" offset={0} width={3.9} />
      <BrandSign wall="front" offset={0} width={3.9} />
      <BrandSign wall="left" offset={0} width={3.9} />
      <BrandSign wall="right" offset={0} width={3.9} />

      {POSTERS.map((poster) => (
        <Poster key={`${poster.wall}-${poster.offset}`} {...poster} />
      ))}

      {AISLES.flatMap((aisle) =>
        [-AISLE_END_X, AISLE_END_X].map((x) => (
          <AisleSign key={`${aisle.number}-${x}`} x={x} aisle={aisle} />
        )),
      )}

      {PENDANT_X.map((x, i) => (
        <Pendant key={x} x={x} tone={i % 2 === 0 ? 'red' : 'blue'} />
      ))}

      {PROMO_ISLANDS.map((island) => (
        <PromoIsland key={island.id} island={island} />
      ))}

      {TOTEMS.map((totem) => (
        <Totem key={totem.id} x={totem.x} z={totem.z} />
      ))}

      <WelcomeMat />
    </>
  )
}