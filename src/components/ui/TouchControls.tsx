import {
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
  } from 'react'
  import { touchInput } from '../../store/touchInput'
  import { selectCount, selectTotal, useCartStore } from '../../store/useCartStore'
  import { useUiStore } from '../../store/useUiStore'
  import { IS_TOUCH } from '../../utils/device'
  import { formatPrice } from '../../utils/format'
  
  const JOY_RADIUS = 40 // déplacement maximal du bouton du joystick (en pixels)
  
  // Glisser un doigt = regarder autour de soi · Toucher sans glisser = toucher un produit
    function LookArea() {
    const pointer = useRef<{
      id: number
      x: number
      y: number
      startX: number
      startY: number
      startTime: number
    } | null>(null)
  
    const release = (e: ReactPointerEvent, allowTap: boolean) => {
      const p = pointer.current
      if (!p || p.id !== e.pointerId) return
      pointer.current = null
  
      const moved = Math.hypot(e.clientX - p.startX, e.clientY - p.startY)
      if (allowTap && moved < 10 && performance.now() - p.startTime < 350) {
        window.dispatchEvent(
          new CustomEvent('viva-tap', { detail: { x: e.clientX, y: e.clientY } }),
        )
      }
    }
  
    return (
      <div
        className="absolute inset-0 z-[5] touch-none"
        onPointerDown={(e) => {
          if (pointer.current) return
          pointer.current = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            startX: e.clientX,
            startY: e.clientY,
            startTime: performance.now(),
          }
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          const p = pointer.current
          if (!p || p.id !== e.pointerId) return
          touchInput.lookDX += e.clientX - p.x
          touchInput.lookDY += e.clientY - p.y
          p.x = e.clientX
          p.y = e.clientY
        }}
        onPointerUp={(e) => release(e, true)}
        onPointerCancel={(e) => release(e, false)}
      />
    )
  }
  // Joystick virtuel (avancer, reculer, se décaler)
  function Joystick() {
    const base = useRef<HTMLDivElement>(null)
    const active = useRef<number | null>(null)
    const [knob, setKnob] = useState({ x: 0, y: 0 })
  
    // Arrête le mouvement si le joystick disparaît (pause, panier...)
    useEffect(
      () => () => {
        touchInput.moveX = 0
        touchInput.moveY = 0
      },
      [],
    )
  
    const update = (e: ReactPointerEvent) => {
      const el = base.current
      if (!el) return
  
      const rect = el.getBoundingClientRect()
      let dx = e.clientX - (rect.left + rect.width / 2)
      let dy = e.clientY - (rect.top + rect.height / 2)
  
      const distance = Math.hypot(dx, dy)
      if (distance > JOY_RADIUS) {
        dx = (dx / distance) * JOY_RADIUS
        dy = (dy / distance) * JOY_RADIUS
      }
  
      setKnob({ x: dx, y: dy })
      touchInput.moveX = dx / JOY_RADIUS
      touchInput.moveY = -dy / JOY_RADIUS // vers le haut = avancer
    }
  
    const reset = (e: ReactPointerEvent) => {
      if (active.current !== e.pointerId) return
      active.current = null
      setKnob({ x: 0, y: 0 })
      touchInput.moveX = 0
      touchInput.moveY = 0
    }
  
    return (
      <div
        ref={base}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-[max(1.5rem,env(safe-area-inset-left))] z-20 h-32 w-32 touch-none rounded-full border border-white/40 bg-black/25 backdrop-blur-sm"
        onPointerDown={(e) => {
          if (active.current !== null) return
          active.current = e.pointerId
          e.currentTarget.setPointerCapture(e.pointerId)
          update(e)
        }}
        onPointerMove={(e) => {
          if (active.current === e.pointerId) update(e)
        }}
        onPointerUp={reset}
        onPointerCancel={reset}
      >
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-14 w-14 rounded-full bg-white/70 shadow"
          style={{
            transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          }}
        />
      </div>
    )
  }
  
  // Bouton + (ajouter le produit visé) ou Payer (devant une caisse)
  function ActionButton() {
    const aimedProduct = useUiStore((s) => s.aimedProductId !== null)
    const aimedCheckout = useUiStore((s) => s.aimedCheckout)
  
    const ready = aimedProduct || aimedCheckout
    const payMode = aimedCheckout && !aimedProduct
  
    return (
      <button
        className={`absolute right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-20 flex h-20 w-20 touch-none items-center justify-center rounded-full font-bold text-white shadow-lg transition ${
          ready ? 'scale-100 bg-emerald-500' : 'scale-90 bg-white/20 opacity-60'
        } ${payMode ? 'text-base' : 'text-4xl'}`}
        onPointerDown={(e) => {
          e.preventDefault()
          window.dispatchEvent(new Event('viva-action'))
        }}
        aria-label={payMode ? 'Payer' : 'Ajouter au panier'}
      >
        {payMode ? 'Payer' : '+'}
      </button>
    )
  }
  
  // Pause (haut gauche) et panier (haut droite)
  function TopBar() {
    const count = useCartStore(selectCount)
    const total = useCartStore(selectTotal)
  
    const openCartPanel = () => {
      const ui = useUiStore.getState()
      ui.openCart()
      ui.unlock()
    }
  
    return (
      <>
        <button
          className="absolute top-[max(1rem,env(safe-area-inset-top))] left-[max(1rem,env(safe-area-inset-left))] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-lg font-bold text-white backdrop-blur"
          onClick={() => useUiStore.getState().unlock()}
          aria-label="Pause"
        >
          II
        </button>
  
        <button
          className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-20 rounded-full bg-black/60 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur"
          onClick={openCartPanel}
          aria-label="Ouvrir le panier"
        >
          🛒 {count} · {formatPrice(total)}
        </button>
      </>
    )
  }
  
  export function TouchControls() {
    const locked = useUiStore((s) => s.locked)
  
    if (!IS_TOUCH || !locked) return null
  
    return (
      <>
        <LookArea />
        <Joystick />
        <ActionButton />
        <TopBar />
      </>
    )
  }