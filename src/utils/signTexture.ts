import { CanvasTexture, SRGBColorSpace } from 'three'
import { BRAND } from '../brand'

const FONT = '"Trebuchet MS", "Segoe UI", Arial, sans-serif'
const cache = new Map<string, CanvasTexture>()

function finish(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

export type SignLine = { text: string; size: number; color?: string }

export type SignOptions = {
  width: number // en pixels
  height: number
  background: string
  stripe?: string // fine bande de couleur en bas
  lines: SignLine[]
}

// Panneau coloré avec une ou plusieurs lignes de texte
export function makeSignTexture(options: SignOptions) {
  const key = JSON.stringify(options)
  const cached = cache.get(key)
  if (cached) return cached

  const { width, height, background, stripe, lines } = options
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)

    let usable = height
    if (stripe) {
      const stripeHeight = Math.round(height * 0.07)
      ctx.fillStyle = stripe
      ctx.fillRect(0, height - stripeHeight, width, stripeHeight)
      usable = height - stripeHeight
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const lineHeight = (line: SignLine) => line.size * 1.2
    const total = lines.reduce((sum, line) => sum + lineHeight(line), 0)
    let y = (usable - total) / 2

    for (const line of lines) {
      let size = line.size
      ctx.font = `bold ${size}px ${FONT}`

      // Réduit la police si le texte dépasse la largeur du panneau
      const measured = ctx.measureText(line.text).width
      if (measured > width * 0.9) {
        size = (size * width * 0.9) / measured
        ctx.font = `bold ${size}px ${FONT}`
      }

      ctx.fillStyle = line.color ?? '#ffffff'
      ctx.fillText(line.text, width / 2, y + lineHeight(line) / 2)
      y += lineHeight(line)
    }
  }

  const texture = finish(canvas)
  cache.set(key, texture)
  return texture
}

function heartPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.beginPath()
  ctx.moveTo(cx, cy + s * 0.35)
  ctx.bezierCurveTo(cx - s * 0.1, cy + s * 0.2, cx - s * 0.5, cy + s * 0.05, cx - s * 0.5, cy - s * 0.2)
  ctx.bezierCurveTo(cx - s * 0.5, cy - s * 0.45, cx - s * 0.15, cy - s * 0.5, cx, cy - s * 0.25)
  ctx.bezierCurveTo(cx + s * 0.15, cy - s * 0.5, cx + s * 0.5, cy - s * 0.45, cx + s * 0.5, cy - s * 0.2)
  ctx.bezierCurveTo(cx + s * 0.5, cy + s * 0.05, cx + s * 0.1, cy + s * 0.2, cx, cy + s * 0.35)
  ctx.closePath()
}

// Logo dessiné en code : cœur bicolore + "viva mall" (format 2:1, fond blanc)
export function makeLogoTexture() {
  const cached = cache.get('logo')
  if (cached) return cached

  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Cœur : moitié droite rouge, moitié gauche bleue
    heartPath(ctx, width / 2, 150, 230)
    ctx.fillStyle = BRAND.red
    ctx.fill()

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, width / 2, height)
    ctx.clip()
    heartPath(ctx, width / 2, 150, 230)
    ctx.fillStyle = BRAND.blue
    ctx.fill()
    ctx.restore()

    // Nom de la marque
    ctx.font = `bold 170px ${FONT}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    const gap = 12
    const wViva = ctx.measureText('viva').width
    const wMall = ctx.measureText('mall').width
    const startX = (width - (wViva + wMall + gap)) / 2
    const mallX = startX + wViva + gap

    ctx.fillStyle = BRAND.red
    ctx.fillText('viva', startX, 410)
    ctx.fillStyle = BRAND.blue
    ctx.fillText('mall', mallX, 410)

    // Petite courbe sous "mall"
    ctx.strokeStyle = BRAND.blue
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(mallX, 455)
    ctx.quadraticCurveTo(mallX + wMall * 0.5, 490, mallX + wMall, 440)
    ctx.stroke()
  }

  const texture = finish(canvas)
  cache.set('logo', texture)
  return texture
}