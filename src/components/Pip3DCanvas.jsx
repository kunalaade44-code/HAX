import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { PipCharacter } from './PipCharacter';

// Floating Background Crescent Moon
function CrescentMoon({ isNight }) {
  const moonRef = useRef();

  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 - 0.2;
    }
  });

  return (
    <group ref={moonRef} position={[-2.4, 1.8, -3]}>
      {/* Outer Moon Sphere */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial
          color={isNight ? '#ffeab3' : '#fff3d1'}
          emissive={isNight ? '#f5b041' : '#fce6a8'}
          emissiveIntensity={isNight ? 0.7 : 0.4}
          roughness={0.4}
        />
      </mesh>
      {/* Subtle Moon Glow halo */}
      <pointLight
        color={isNight ? '#ffcc66' : '#fff0b3'}
        intensity={isNight ? 1.4 : 0.8}
        distance={6}
      />
    </group>
  );
}

// Floating Twinkle Stars in the Scene
function DreamStars({ count = 25, isNight }) {
  const starsRef = useRef();

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    }
  });

  const starPositions = React.useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 6 + 0.5;
      const z = (Math.random() - 0.5) * 5 - 1;
      const size = 0.05 + Math.random() * 0.08;
      pos.push({ x, y, z, size });
    }
    return pos;
  }, [count]);

  return (
    <group ref={starsRef}>
      {starPositions.map((s, idx) => (
        <mesh key={idx} position={[s.x, s.y, s.z]}>
          <octahedronGeometry args={[s.size]} />
          <meshStandardMaterial
            color={isNight ? '#fde3a7' : '#f7ca18'}
            emissive={isNight ? '#f9bf3b' : '#f39c12'}
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating Bedside Lantern
function HangingLantern({ isNight }) {
  const lanternRef = useRef();

  useFrame((state) => {
    if (lanternRef.current) {
      lanternRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.8) * 0.08 + 0.05;
    }
  });

  return (
    <group ref={lanternRef} position={[2.2, 1.2, -1]}>
      {/* Chain */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.4, 8]} />
        <meshStandardMaterial color="#8c7051" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Lantern Cap */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.3, 0.2, 8]} />
        <meshStandardMaterial color={isNight ? '#0b162c' : '#0284c7'} roughness={0.4} />
      </mesh>
      {/* Glowing Lantern Glass Core */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.32, 12]} />
        <meshStandardMaterial
          color="#fce8b3"
          emissive="#ffab40"
          emissiveIntensity={2.0}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Pointlight radiating from lantern */}
      <pointLight color="#ff9e3b" intensity={2.2} distance={4} />
    </group>
  );
}

export function Pip3DCanvas({ isNight, onPipClick }) {
  const [hasWebGLError, setHasWebGLError] = useState(false);

  // Check WebGL availability
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
      }
    } catch (e) {
      setHasWebGLError(true);
    }
  }, []);

  if (hasWebGLError) {
    // Graceful fallback to official transparent artwork
    return (
      <div className="pip-3d-fallback" onClick={onPipClick} title="Click to greet Pip!">
        <div className="pip-fallback-glow"></div>
        <img
          src="/assets/pip_avatar_cloud.png"
          alt="Pip the Skull Baby floating on a cozy dream cloud"
          className="pip-fallback-img"
        />
        <span className="pip-fallback-badge">Pip on Cloud ✦</span>
      </div>
    );
  }

  return (
    <div
      className="pip-canvas-wrapper"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        touchAction: 'pan-y',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.2, 4.4], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
        onError={() => setHasWebGLError(true)}
      >
        <Suspense fallback={null}>
          {/* Dynamic Scene Lighting */}
          <ambientLight intensity={isNight ? 0.6 : 0.9} color={isNight ? '#7d6c96' : '#fff7eb'} />
          
          <directionalLight
            position={[4, 5, 4]}
            intensity={isNight ? 1.2 : 1.6}
            color={isNight ? '#ffeedd' : '#fff5ea'}
          />

          <directionalLight
            position={[-4, 2, -2]}
            intensity={isNight ? 0.9 : 0.5}
            color={isNight ? '#38bdf8' : '#bae6fd'}
          />

          {/* Gentle Floating Celestial Elements */}
          <CrescentMoon isNight={isNight} />
          <HangingLantern isNight={isNight} />
          <DreamStars count={isNight ? 36 : 18} isNight={isNight} />

          {/* Golden Stardust Sparkles */}
          <Sparkles
            count={isNight ? 45 : 25}
            scale={[6, 5, 5]}
            size={isNight ? 3 : 2}
            speed={0.4}
            color={isNight ? '#f9d689' : '#f4a460'}
          />

          {/* Centerpiece 3D Pip Character */}
          <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.3}>
            <PipCharacter isNight={isNight} onPipClick={onPipClick} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
