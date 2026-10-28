import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { Lights } from './components/three/Lights'
import { Store } from './components/three/Store'
import { Player } from './components/three/Player'
import { ProductPicker } from './components/three/ProductPicker'
import { Overlay } from './components/ui/Overlay'
import { Hud } from './components/ui/Hud'
import { CartPanel } from './components/ui/CartPanel'
import { EYE_HEIGHT, ROOM } from './constants'
import { useUiStore } from './store/useUiStore'

export default function App() {
  const lock = useUiStore((s) => s.lock)
  const unlock = useUiStore((s) => s.unlock)

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, EYE_HEIGHT, ROOM.depth / 2 - 2], fov: 70 }}
      >
        <color attach="background" args={['#dfe6e9']} />
        <Lights />
        <Suspense fallback={null}>
          <Store />
        </Suspense>
        <ProductPicker />
        <Player onLock={lock} onUnlock={unlock} />
      </Canvas>

      <Loader />
      <Overlay />
      <Hud />
      <CartPanel />
    </div>
  )
}