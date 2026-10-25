import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Lights } from './components/three/Lights'
import { Store } from './components/three/Store'
import { Player } from './components/three/Player'
import { Overlay } from './components/ui/Overlay'
import { EYE_HEIGHT, ROOM } from './constants'

export default function App() {
  const [locked, setLocked] = useState(false)

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, EYE_HEIGHT, ROOM.depth / 2 - 2], fov: 70 }}
      >
        <color attach="background" args={['#dfe6e9']} />
        <Lights />
        <Store />
        <Player
          onLock={() => setLocked(true)}
          onUnlock={() => setLocked(false)}
        />
      </Canvas>

      <Overlay locked={locked} />
    </div>
  )
}