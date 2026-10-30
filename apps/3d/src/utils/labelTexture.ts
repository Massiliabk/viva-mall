import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Product } from '../data/products'

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''

  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)

  return lines
}

export function makeLabelTexture(product: Product) {
  const [w, h] = product.size
  const width = 256
  const height = Math.round(Math.min(Math.max((width * h) / w, 128), 768))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Fond coloré
    ctx.fillStyle = product.color
    ctx.fillRect(0, 0, width, height)

    // Étiquette blanche au centre
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
    ctx.fillRect(0, height * 0.3, width, height * 0.4)

    // Nom du produit
    const fontSize = Math.round(Math.min(width, height) / 8.5)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = '#1f2937'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const lines = wrapText(ctx, product.name, width * 0.88)
    const lineHeight = fontSize * 1.2
    const firstY = height / 2 - ((lines.length - 1) * lineHeight) / 2
    lines.forEach((line, i) =>
      ctx.fillText(line, width / 2, firstY + i * lineHeight),
    )
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}