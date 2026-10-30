import { Raycaster, Vector2, type Camera } from 'three'

const raycaster = new Raycaster()
const ndc = new Vector2()

// Rayon passant par un point de l'écran (à utiliser immédiatement : l'objet est réutilisé)
export function rayFromScreen(
  camera: Camera,
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  const rect = canvas.getBoundingClientRect()
  ndc.set(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1,
  )
  raycaster.setFromCamera(ndc, camera)
  return raycaster.ray
}