'use client'

// --- KeyModel3D — React Three Fiber rotating key mesh with violet glow ---

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

// --- Key geometry built from primitives ---
function KeyMesh() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    // Slow Y rotation + subtle wobble
    groupRef.current.rotation.y += 0.012
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.08
  })

  return (
    <group ref={groupRef}>
      {/* Key bow (the round top) */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.28, 0.07, 12, 32]} />
        <meshStandardMaterial
          color="#BC13FE"
          emissive="#BC13FE"
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Key blade (shaft) */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[0.1, 0.8, 0.06]} />
        <meshStandardMaterial
          color="#9010CC"
          emissive="#BC13FE"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Key tooth 1 */}
      <mesh position={[0.1, -0.28, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.06]} />
        <meshStandardMaterial
          color="#FF00FF"
          emissive="#FF00FF"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Key tooth 2 */}
      <mesh position={[0.1, -0.48, 0]}>
        <boxGeometry args={[0.09, 0.08, 0.06]} />
        <meshStandardMaterial
          color="#FF00FF"
          emissive="#FF00FF"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Glow sphere behind key — bloom-like effect */}
      <mesh position={[0, 0.1, -0.2]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial
          color="#BC13FE"
          emissive="#BC13FE"
          emissiveIntensity={0.25}
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  )
}

export default function KeyModel3D() {
  return (
    <div className="w-full" style={{ height: 160 }}>
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[2,  2, 2]} intensity={2.5} color="#BC13FE" />
        <pointLight position={[-2, -1, 1]} intensity={1.5} color="#00FFE7" />
        <pointLight position={[0,  3, -1]} intensity={1}   color="#FF00FF" />

        {/* Floating key */}
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
          <KeyMesh />
        </Float>
      </Canvas>
    </div>
  )
}