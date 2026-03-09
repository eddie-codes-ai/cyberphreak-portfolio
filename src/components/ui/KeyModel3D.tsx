'use client'

// --- KeyModel3D — React Three Fiber rotating key mesh ---

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function KeyMesh() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y  += 0.01
    groupRef.current.rotation.x   = Math.sin(state.clock.elapsedTime * 0.5) * 0.12
    groupRef.current.rotation.z   = Math.cos(state.clock.elapsedTime * 0.35) * 0.06
  })

  return (
    <group ref={groupRef}>

      {/* --- Key bow (ring at top) --- */}
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.26, 0.065, 16, 48]} />
        <meshStandardMaterial
          color="#BC13FE"
          emissive="#BC13FE"
          emissiveIntensity={1.6}
          metalness={0.7}
          roughness={0.15}
        />
      </mesh>

      {/* --- Inner bow hole detail --- */}
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.14, 0.025, 12, 32]} />
        <meshStandardMaterial
          color="#00FFE7"
          emissive="#00FFE7"
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* --- Key shaft --- */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.1, 0.85, 0.065]} />
        <meshStandardMaterial
          color="#8A0DC4"
          emissive="#BC13FE"
          emissiveIntensity={0.8}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* --- Tooth 1 (larger) --- */}
      <mesh position={[0.12, -0.22, 0]}>
        <boxGeometry args={[0.13, 0.09, 0.065]} />
        <meshStandardMaterial
          color="#FF00FF"
          emissive="#FF00FF"
          emissiveIntensity={1.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* --- Tooth 2 (medium) --- */}
      <mesh position={[0.11, -0.38, 0]}>
        <boxGeometry args={[0.10, 0.08, 0.065]} />
        <meshStandardMaterial
          color="#FF00FF"
          emissive="#FF00FF"
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* --- Tooth 3 (small) --- */}
      <mesh position={[0.105, -0.52, 0]}>
        <boxGeometry args={[0.085, 0.07, 0.065]} />
        <meshStandardMaterial
          color="#BC13FE"
          emissive="#BC13FE"
          emissiveIntensity={1.0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* --- Shaft tip --- */}
      <mesh position={[0, -0.625, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.065]} />
        <meshStandardMaterial
          color="#00FFE7"
          emissive="#00FFE7"
          emissiveIntensity={0.9}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* --- Glow orb behind key --- */}
      <mesh position={[0, 0.05, -0.3]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color="#BC13FE"
          emissive="#BC13FE"
          emissiveIntensity={0.4}
          transparent
          opacity={0.08}
        />
      </mesh>

    </group>
  )
}

export default function KeyModel3D() {
  return (
    <div className="w-full" style={{ height: 160 }}>
      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Ambient base */}
        <ambientLight intensity={0.2} />

        {/* Key violet key light */}
        <pointLight position={[1.5,  2,   2  ]} intensity={3}   color="#BC13FE" />

        {/* Cyan fill light from below */}
        <pointLight position={[-1,  -2,   1.5]} intensity={2}   color="#00FFE7" />

        {/* Pink rim light */}
        <pointLight position={[0,    1,  -1  ]} intensity={1.5} color="#FF00FF" />

        {/* Subtle white front fill so geometry is readable */}
        <pointLight position={[0,    0,   3  ]} intensity={0.6} color="#ffffff" />

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
          <KeyMesh />
        </Float>
      </Canvas>
    </div>
  )
}