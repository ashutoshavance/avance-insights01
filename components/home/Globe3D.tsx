'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

function GlobePoints() {
  const pointsRef = useRef<THREE.Points>(null)

  // Generate points on sphere surface
  const particles = useMemo(() => {
    const points = []
    const numPoints = 2000

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints)
      const theta = Math.sqrt(numPoints * Math.PI) * phi

      const x = Math.cos(theta) * Math.sin(phi) * 2
      const y = Math.sin(theta) * Math.sin(phi) * 2
      const z = Math.cos(phi) * 2

      points.push(x, y, z)
    }

    return new Float32Array(points)
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}

function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null)

  // Generate connection lines between random points
  const lines = useMemo(() => {
    const connections = []
    const numConnections = 20

    for (let i = 0; i < numConnections; i++) {
      // Random start point
      const phi1 = Math.random() * Math.PI
      const theta1 = Math.random() * Math.PI * 2
      const start = new THREE.Vector3(
        Math.sin(phi1) * Math.cos(theta1) * 2,
        Math.sin(phi1) * Math.sin(theta1) * 2,
        Math.cos(phi1) * 2
      )

      // Random end point
      const phi2 = Math.random() * Math.PI
      const theta2 = Math.random() * Math.PI * 2
      const end = new THREE.Vector3(
        Math.sin(phi2) * Math.cos(theta2) * 2,
        Math.sin(phi2) * Math.sin(theta2) * 2,
        Math.cos(phi2) * 2
      )

      // Create curved path
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(2.5)

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      connections.push(curve.getPoints(20))
    }

    return connections
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={linesRef}>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#d946ef"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  )
}

function GlowingSphere() {
  return (
    <Sphere args={[1.98, 64, 64]}>
      <meshBasicMaterial
        color="#1e40af"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </Sphere>
  )
}

function CityMarkers() {
  const markersRef = useRef<THREE.Group>(null)

  // Major cities coordinates (lat, lon converted to 3D)
  const cities = useMemo(() => {
    const cityCoords = [
      { lat: 28.6139, lon: 77.209, name: 'Delhi' }, // Delhi
      { lat: 19.076, lon: 72.8777, name: 'Mumbai' }, // Mumbai
      { lat: 40.7128, lon: -74.006, name: 'New York' }, // New York
      { lat: 51.5074, lon: -0.1278, name: 'London' }, // London
      { lat: 35.6762, lon: 139.6503, name: 'Tokyo' }, // Tokyo
      { lat: 1.3521, lon: 103.8198, name: 'Singapore' }, // Singapore
      { lat: -33.8688, lon: 151.2093, name: 'Sydney' }, // Sydney
    ]

    return cityCoords.map((city) => {
      const phi = (90 - city.lat) * (Math.PI / 180)
      const theta = (city.lon + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -2 * Math.sin(phi) * Math.cos(theta),
        2 * Math.cos(phi),
        2 * Math.sin(phi) * Math.sin(theta)
      )
    })
  }, [])

  useFrame((state) => {
    if (markersRef.current) {
      markersRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={markersRef}>
      {cities.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
      ))}
    </group>
  )
}

export default function Globe3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <GlowingSphere />
        <GlobePoints />
        <ConnectionLines />
        <CityMarkers />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}