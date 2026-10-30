// Caisses : le client arrive par le nord (z plus petit), la caissière est au sud
export const CHECKOUT_LANES = [
    { id: 'caisse-1', number: 1, x: -9.6, z: 7.4, open: true },
    { id: 'caisse-2', number: 2, x: -7.4, z: 7.4, open: true },
    { id: 'caisse-3', number: 3, x: -5.2, z: 7.4, open: false },
    { id: 'caisse-4', number: 4, x: 5.2, z: 7.4, open: true },
    { id: 'caisse-5', number: 5, x: 7.4, z: 7.4, open: true },
    { id: 'caisse-6', number: 6, x: 9.6, z: 7.4, open: false },
  ]
  
  export type CheckoutLane = (typeof CHECKOUT_LANES)[number]
  
  // Meuble de caisse (largeur, longueur, décalage vers le nord par rapport au centre)
  export const COUNTER = { width: 0.9, length: 2.2, offsetZ: -0.2 }
  
  // Le meuble bloque le passage
  export const CHECKOUT_COLLIDERS = CHECKOUT_LANES.map((lane) => ({
    x: lane.x,
    z: lane.z + COUNTER.offsetZ,
    halfX: COUNTER.width / 2,
    halfZ: COUNTER.length / 2,
  }))
  
  // Zones à viser pour payer (caisses ouvertes uniquement) : coins min et max
  export const CHECKOUT_TARGETS = CHECKOUT_LANES.filter((lane) => lane.open).map(
    (lane) => ({
      min: [lane.x - 0.5, 0.8, lane.z - 1.3] as [number, number, number],
      max: [lane.x + 0.5, 1.35, lane.z + 0.9] as [number, number, number],
    }),
  )