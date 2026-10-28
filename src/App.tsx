import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { Lights } from './components/three/Lights'
import { Store } from './components/three/Store'
import { Player } from './components/three/Player'
import { ProductPicker } from './components/three/ProductPicker'
import { ShoppingCart } from './components/three/ShoppingCart'
import { FlyingItems } from './components/three/FlyingItems'
import { Decor } from './components/three/Decor'
import { Checkouts } from './components/three/Checkouts'
import { CheckoutPicker } from './components/three/CheckoutPicker'
import { Overlay } from './components/ui/Overlay'
import { Hud } from './components/ui/Hud'
import { CartPanel } from './components/ui/CartPanel'
import { TouchControls } from './components/ui/TouchControls'
import { EYE_HEIGHT, ROOM } from './constants'
import { useUiStore } from './store/useUiStore'
import { IS_TOUCH } from './utils/device'

export default function App() {
  const lock = useUiStore((s) => s.lock)
  const unlock = useUiStore((s) => s.unlock)

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 touch-none">
        <Canvas
          dpr={IS_TOUCH ? [1, 1.25] : [1, 1.5]}
          gl={{ antialias: !IS_TOUCH, powerPreference: 'high-performance' }}
          camera={{ position: [0, EYE_HEIGHT, ROOM.depth / 2 - 2], fov: 70 }}
        >
          <color attach="background" args={['#dfe6e9']} />
          <Lights />
          <Suspense fallback={null}>
            <Store />
          </Suspense>
          <ProductPicker />
          <Player onLock={lock} onUnlock={unlock} />
          <ShoppingCart />
          <FlyingItems />
          <Decor />
          <Checkouts />
          <CheckoutPicker />
        </Canvas>
      </div>

      <Loader />
      <Overlay />
      <Hud />
      <TouchControls />
      <CartPanel />
    </div>
  )
}