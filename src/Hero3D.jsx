import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* A slowly drifting field of points — "data particles" — with a few
   connecting nodes. Subtle, on-theme for a data engineer, and cheap to render. */
function ParticleField({ count = 1400, color = '#22c55e' }) {
  const points = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // distribute in a soft sphere shell
      const r = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * 0.045
    points.current.rotation.x += delta * 0.012
    // gentle parallax toward the cursor
    points.current.rotation.y += (mouse.current.x * 0.25 - points.current.rotation.y * 0) * 0
    points.current.position.x += (mouse.current.x * 0.6 - points.current.position.x) * 0.03
    points.current.position.y += (-mouse.current.y * 0.4 - points.current.position.y) * 0.03
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Hero3D({ accent = '#22c55e' }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 12], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      onError={() => setOk(false)}
      frameloop="always"
    >
      <ParticleField color={accent} />
    </Canvas>
  )
}
