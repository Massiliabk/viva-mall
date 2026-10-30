import { create } from 'zustand'

export type Flight = {
  id: number
  productId: string
  from: [number, number, number]
}

type FlightState = {
  flights: Flight[]
  landedAt: number // instant du dernier atterrissage (pour l'effet de rebond)
  addFlight: (productId: string, from: [number, number, number]) => void
  land: (id: number) => void
}

let nextId = 1

export const useFlightStore = create<FlightState>()((set) => ({
  flights: [],
  landedAt: 0,

  addFlight: (productId, from) =>
    set((state) =>
      state.flights.length >= 12
        ? state
        : { flights: [...state.flights, { id: nextId++, productId, from }] },
    ),

  land: (id) =>
    set((state) => ({
      flights: state.flights.filter((flight) => flight.id !== id),
      landedAt: performance.now(),
    })),
}))