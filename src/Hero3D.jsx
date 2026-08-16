import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* A slowly drifting field of data points with network node connections (DAG pipeline visual). */
function ParticleField({ count = 1200, color = '#22c55e', isDark = true }) {
  const points = useRef()
  const linesRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  const { positions, linePositions } = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const rawCoords = []
    for (let i = 0; i < count; i++) {
      const r = 4.5 + Math.random() * 5.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
      rawCoords.push({ x, y, z })
    }

    // Generate connecting lines between close points
    const lineCoords = []
    let connections = 0
    const maxDist = 2.2
    for (let i = 0; i < count && connections < 220; i += 4) {
      for (let j = i + 1; j < count && connections < 220; j++) {
        const dx = rawCoords[i].x - rawCoords[j].x
        const dy = rawCoords[i].y - rawCoords[j].y
        const dz = rawCoords[i].z - rawCoords[j].z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < maxDist) {
          lineCoords.push(rawCoords[i].x, rawCoords[i].y, rawCoords[i].z)
          lineCoords.push(rawCoords[j].x, rawCoords[j].y, rawCoords[j].z)
          connections++
        }
      }
    }

    return {
      positions: arr,
      linePositions: new Float32Array(lineCoords),
    }
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
    const rotY = delta * 0.04
    const rotX = delta * 0.01

    points.current.rotation.y += rotY
    points.current.rotation.x += rotX
    points.current.position.x += (mouse.current.x * 0.5 - points.current.position.x) * 0.03
    points.current.position.y += (-mouse.current.y * 0.3 - points.current.position.y) * 0.03

    if (linesRef.current) {
      linesRef.current.rotation.y += rotY
      linesRef.current.rotation.x += rotX
      linesRef.current.position.x = points.current.position.x
      linesRef.current.position.y = points.current.position.y
    }
  })

  // Theme-aware rendering parameters:
  // AdditiveBlending on dark mode glow; NormalBlending with high contrast dark green on light mode.
  const pointSize = isDark ? 0.048 : 0.065
  const pointOpacity = isDark ? 0.85 : 0.95
  const lineOpacity = isDark ? 0.25 : 0.45
  const particleColor = isDark ? color : '#047857'
  const blendingMode = isDark ? THREE.AdditiveBlending : THREE.NormalBlending

  return (
    <group>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={pointSize}
          color={particleColor}
          transparent
          opacity={pointOpacity}
          sizeAttenuation
          depthWrite={false}
          blending={blendingMode}
        />
      </points>
      {linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={particleColor}
            transparent
            opacity={lineOpacity}
            blending={blendingMode}
          />
        </lineSegments>
      )}
    </group>
  )
}

export default function Hero3D({ accent = '#22c55e', theme = 'dark' }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  const isDark = theme === 'dark'

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
      <ParticleField color={accent} isDark={isDark} />
    </Canvas>
  )
}
