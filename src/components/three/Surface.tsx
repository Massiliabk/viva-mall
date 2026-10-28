import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from 'three'

// Carrelage généré : 2 x 2 carreaux avec joints et légères variations de teinte
function makeTilesTexture() {
  const size = 512
  const half = size / 2

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  if (ctx) {
    const tones = ['#dcd7ca', '#d3cdbf', '#d7d2c4', '#dedacd']
    tones.forEach((tone, i) => {
      ctx.fillStyle = tone
      ctx.fillRect((i % 2) * half, Math.floor(i / 2) * half, half, half)
    })

    ctx.strokeStyle = '#b4ae9f'
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, size - 4, size - 4)
    ctx.beginPath()
    ctx.moveTo(half, 0)
    ctx.lineTo(half, size)
    ctx.moveTo(0, half)
    ctx.lineTo(size, half)
    ctx.stroke()
  }

  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function TilesSurface({ rx, ry }: { rx: number; ry: number }) {
  const texture = useMemo(() => {
    const t = makeTilesTexture()
    t.repeat.set(rx, ry)
    return t
  }, [rx, ry])

  return <meshStandardMaterial map={texture} roughness={0.35} />
}

// Textures PBR depuis un dossier : diffuse.jpg, normal.jpg, roughness.jpg
function PbrSurface({ folder, rx, ry }: { folder: string; rx: number; ry: number }) {
  const loaded = useTexture({
    map: `${folder}/diffuse.jpg`,
    normalMap: `${folder}/normal.jpg`,
    roughnessMap: `${folder}/roughness.jpg`,
  })

  const textures = useMemo(() => {
    // Chaque surface a sa propre répétition : on clone les textures
    const configure = (source: Texture, srgb = false) => {
      const texture = source.clone()
      texture.wrapS = texture.wrapT = RepeatWrapping
      texture.repeat.set(rx, ry)
      texture.anisotropy = 8
      if (srgb) texture.colorSpace = SRGBColorSpace
      texture.needsUpdate = true
      return texture
    }

    return {
      map: configure(loaded.map, true),
      normalMap: configure(loaded.normalMap),
      roughnessMap: configure(loaded.roughnessMap),
    }
  }, [loaded, rx, ry])

  return <meshStandardMaterial {...textures} />
}

type SurfaceProps = {
  folder: string | null
  tileSize: number
  width: number // dimensions réelles de la surface (en mètres)
  height: number
  color: string
  tiles?: boolean
}

export function Surface({ folder, tileSize, width, height, color, tiles }: SurfaceProps) {
  const rx = width / tileSize
  const ry = height / tileSize

  if (folder) return <PbrSurface folder={folder} rx={rx} ry={ry} />
  if (tiles) return <TilesSurface rx={rx} ry={ry} />
  return <meshStandardMaterial color={color} roughness={0.9} />
}