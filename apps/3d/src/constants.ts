export const ROOM = {
  width: 24,
  depth: 18,
  height: 4,
  wallThickness: 0.2,
}

export const EYE_HEIGHT = 1.7
export const PLAYER_SPEED = 4

export const SHELF = {
  width: 3,
  depth: 0.6,
  height: 2,
  boardThickness: 0.04,
  firstLevelY: 0.2, // hauteur de la 1re planche
  levelGap: 0.45, // écart entre deux planches
  productsPerLevel: 6,
  productSpacing: 0.42,
}
// Modèle 3D de rayon (glTF). Laisse null pour garder les rayons générés.
export const SHELF_MODEL = {
  url: null as string | null, // ex. '/models/shelf.glb'
  rotationY: 0, // si le modèle est mal orienté : Math.PI, Math.PI / 2 ou -Math.PI / 2
}

// Textures du sol et des murs. Laisse null pour garder les matériaux générés.
export const FLOOR_TEXTURE = { folder: null as string | null, tileSize: 1.2 }
export const WALL_TEXTURE = { folder: null as string | null, tileSize: 3 }