import { useMemo } from 'react'
import { BRAND } from '../../brand'
import { CHECKOUT_LANES, type CheckoutLane } from '../../data/checkout'
import { makeSignTexture } from '../../utils/signTexture'

type BlockProps = {
  position: [number, number, number]
  size: [number, number, number]
  color: string
}

function Block({ position, size, color }: BlockProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )
}

// Caissière stylisée (mannequin neutre, gilet rouge)
function Cashier() {
  return (
    <group position={[0, 0, 1.15]}>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.84, 12]} />
        <meshStandardMaterial color="#2c3550" />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.17, 0.19, 0.6, 16]} />
        <meshStandardMaterial color={BRAND.red} />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color="#e8ecf1" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.23, 1.15, -0.14]} rotation={[0.9, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color={BRAND.red} />
        </mesh>
      ))}
    </group>
  )
}

function Lane({ lane }: { lane: CheckoutLane }) {
  const odd = lane.number % 2 === 1
  const tone = odd ? BRAND.blue : BRAND.red
  const other = odd ? BRAND.red : BRAND.blue

  const sign = useMemo(
    () =>
      lane.open
        ? makeSignTexture({
            width: 512,
            height: 256,
            background: tone,
            stripe: other,
            lines: [{ text: `CAISSE ${lane.number}`, size: 100 }],
          })
        : makeSignTexture({
            width: 512,
            height: 256,
            background: '#6b7280',
            stripe: '#9ca3af',
            lines: [{ text: 'FERMÉE', size: 110 }],
          }),
    [lane.open, lane.number, tone, other],
  )

  const screen = useMemo(
    () =>
      lane.open
        ? makeSignTexture({
            width: 256,
            height: 192,
            background: BRAND.blue,
            stripe: BRAND.red,
            lines: [{ text: 'PAYER', size: 72 }],
          })
        : makeSignTexture({ width: 256, height: 192, background: '#111827', lines: [] }),
    [lane.open],
  )

  return (
    <group position={[lane.x, 0, lane.z]}>
      {/* Meuble */}
      <Block position={[0, 0.42, -0.2]} size={[0.9, 0.84, 2.2]} color="#f1f3f6" />
      <Block position={[0, 0.06, -0.2]} size={[0.92, 0.12, 2.22]} color={BRAND.blue} />
      <Block position={[0, 0.45, -0.2]} size={[0.92, 0.06, 2.22]} color={BRAND.red} />
      <Block position={[0, 0.86, -0.2]} size={[0.94, 0.04, 2.24]} color="#dfe5ec" />

      {/* Tapis roulant, séparateur, scanner et terminal de paiement */}
      <Block position={[-0.1, 0.885, -0.62]} size={[0.56, 0.025, 1.15]} color="#2b2f36" />
      <Block position={[-0.1, 0.93, -0.04]} size={[0.5, 0.1, 0.03]} color={BRAND.blue} />
      <Block position={[0.1, 0.885, 0.2]} size={[0.2, 0.02, 0.14]} color="#2b2f36" />
      <Block position={[0.3, 0.89, 0.1]} size={[0.1, 0.03, 0.15]} color="#2b2f36" />

      {/* Écran tourné vers les clients (côté nord) */}
      <Block position={[0, 0.97, 0.55]} size={[0.04, 0.2, 0.04]} color="#9aa3ae" />
      <Block position={[0, 1.12, 0.55]} size={[0.4, 0.3, 0.03]} color="#1f2937" />
      <mesh position={[0, 1.12, 0.531]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.36, 0.26]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>

      {/* Panneau de caisse suspendu (visible des deux côtés) */}
      <group position={[0, 3.45, -0.5]}>
        {[-0.35, 0.35].map((x) => (
          <mesh key={x} position={[x, 0.3875, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.325, 6]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        ))}
        <mesh>
          <boxGeometry args={[0.9, 0.45, 0.04]} />
          <meshStandardMaterial color={BRAND.blue} />
        </mesh>
        <mesh position={[0, 0, -0.022]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.86, 0.41]} />
          <meshBasicMaterial map={sign} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.86, 0.41]} />
          <meshBasicMaterial map={sign} toneMapped={false} />
        </mesh>
      </group>

      {lane.open && <Cashier />}
    </group>
  )
}

export function Checkouts() {
  return (
    <>
      {CHECKOUT_LANES.map((lane) => (
        <Lane key={lane.id} lane={lane} />
      ))}
    </>
  )
}