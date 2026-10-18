import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { PipCharacter } from './PipCharacter';

// Helper to create a classic 5-pointed cartoon star shape
function createStarShape(outerRadius = 0.32, innerRadius = 0.15, points = 5) {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

// 3D Puffy Cartoon Star (as seen in the reference image)
function PuffyStar({ isNight, scale = 1, rotationSpeed = 0.6 }) {
  const meshRef = useRef();

  const starShape = useMemo(() => createStarShape(0.32, 0.15, 5), []);
  const extrudeSettings = useMemo(
    () => ({
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * rotationSpeed) * 0.15;
    }
  });

  const starGold = isNight ? '#fde047' : '#fcd34d';
  const emissiveGold = isNight ? '#eab308' : '#f59e0b';

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <extrudeGeometry args={[starShape, extrudeSettings]} />
      <meshStandardMaterial
        color={starGold}
        emissive={emissiveGold}
        emissiveIntensity={isNight ? 1.4 : 0.9}
        roughness={0.25}
        metalness={0.1}
      />
    </mesh>
  );
}

// Hanging Star with thin cord from top
function HangingStar({ position, isNight, scale = 1, cordLength = 2.4 }) {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 1.1 + position[0]) * 0.07;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.7 + position[0]) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Hanging Cord */}
      <mesh position={[0, cordLength / 2, 0]}>
        <cylinderGeometry args={[0.007, 0.007, cordLength, 8]} />
        <meshStandardMaterial color={isNight ? '#475569' : '#cbd5e1'} roughness={0.6} />
      </mesh>
      {/* Puffy 3D Star */}
      <PuffyStar isNight={isNight} scale={scale} />
    </group>
  );
}

// Floating Twinkling Star
function FloatingStar({ position, isNight, scale = 1, speed = 1.2 }) {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * speed + position[0] * 2) * 0.06;
      groupRef.current.rotation.z = Math.sin(t * 0.5 + position[1]) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <PuffyStar isNight={isNight} scale={scale} />
    </group>
  );
}

// Big Glowing Celestial Moon Balloon (in the center-top)
function BigMoonBalloon({ isNight, activeColor, position, onBalloonClick }) {
  const groupRef = useRef();
  const starRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.035;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.04;
    }
    if (starRef.current) {
      starRef.current.rotation.z = Math.sin(t * 1.2) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (onBalloonClick) onBalloonClick();
      }}
      cursor="pointer"
    >
      {/* Large Glowing Spherical Moon Balloon - Pure Soft Warm Cream Ivory */}
      <mesh>
        <sphereGeometry args={[1.08, 40, 40]} />
        <meshStandardMaterial
          color={isNight ? '#fff5db' : '#fffdf8'}
          emissive={activeColor || (isNight ? '#fde047' : '#fff8e7')}
          emissiveIntensity={isNight ? 0.55 : 0.3}
          roughness={0.65}
          metalness={0.0}
        />
      </mesh>

      {/* Radiant Glow Point Light in active lantern color */}
      <pointLight color={activeColor || '#fde047'} intensity={isNight ? 2.2 : 1.4} distance={7} />

      {/* Balloon tie / knot at the bottom */}
      <mesh position={[0, -1.12, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.11, 0.16, 16]} />
        <meshStandardMaterial color={isNight ? '#fde68a' : '#fff8e7'} roughness={0.6} />
      </mesh>

      {/* Hanging Cord: upper section from balloon knot to dangling star */}
      <mesh position={[0, -1.55, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.72, 8]} />
        <meshStandardMaterial color={isNight ? '#64748b' : '#cbd5e1'} roughness={0.6} />
      </mesh>

      {/* Little 3D Star dangling halfway down the cord */}
      <group ref={starRef} position={[0, -1.95, 0]}>
        <PuffyStar isNight={isNight} scale={0.64} />
      </group>

      {/* Hanging Cord: lower section continuing below the star */}
      <mesh position={[0, -2.6, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 1.2, 8]} />
        <meshStandardMaterial color={isNight ? '#64748b' : '#cbd5e1'} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Hanging Bedside Lantern on top-right
function HangingLantern({ isNight, activeColor, lampColor, position, onLanternClick }) {
  const lanternRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lanternRef.current) {
      lanternRef.current.rotation.z = Math.sin(t * 1.3) * 0.05 + 0.02;
    }
  });

  const glow = lampColor || activeColor || '#ff9e3b';

  return (
    <group
      ref={lanternRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (onLanternClick) onLanternClick();
      }}
      cursor="pointer"
    >
      {/* Chain to the top */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.9, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </mesh>

      {/* Teal / Cyan Cone Cap */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.36, 0.24, 24]} />
        <meshStandardMaterial color={isNight ? '#0b213f' : '#0284c7'} roughness={0.25} />
      </mesh>

      {/* Inner Glowing Saturated Core / Bulb (immune to daylight washout!) */}
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.34, 16]} />
        <meshBasicMaterial color={glow} />
      </mesh>

      {/* Vibrant Lantern Colored Glass Cylinder */}
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.4, 24]} />
        <meshStandardMaterial
          color={glow}
          emissive={glow}
          emissiveIntensity={1.2}
          roughness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Soft Ambient Radial Light Halo */}
      <mesh position={[0, -0.24, 0]}>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.28}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Base ring */}
      <mesh position={[0, -0.46, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.06, 24]} />
        <meshStandardMaterial color={isNight ? '#0b213f' : '#0284c7'} roughness={0.25} />
      </mesh>

      {/* Pointlight radiating color onto nearby scene elements */}
      <pointLight color={glow} intensity={isNight ? 3.5 : 4.5} distance={6} />
    </group>
  );
}

// Soft Puffy 3D Cloud Bed lining the bottom horizon
function BottomCloudBed({ isNight, width, height }) {
  const groupRef = useRef();

  const cloudPuffs = useMemo(() => {
    const puffs = [];
    const count = 18;
    const startX = -width * 0.65;
    const endX = width * 0.65;
    const step = (endX - startX) / (count - 1);

    for (let i = 0; i < count; i++) {
      const x = startX + i * step + (Math.sin(i * 1.5) * 0.15);
      const y = -height * 0.52 + (Math.cos(i * 2.1) * 0.12);
      const z = -0.7 + (Math.sin(i * 3.1) * 0.5);
      const radius = 0.85 + ((i % 3) * 0.18);
      puffs.push({ x, y, z, radius });
    }

    // Framing clouds on far left and right edges (kept strictly behind character)
    puffs.push({ x: -width * 0.46, y: -height * 0.4, z: -0.8, radius: 1.05 });
    puffs.push({ x: width * 0.46, y: -height * 0.4, z: -0.8, radius: 1.1 });

    return puffs;
  }, [width, height]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.02;
    }
  });

  const cloudColor = isNight ? '#0f1c35' : '#ffffff';

  return (
    <group ref={groupRef}>
      {cloudPuffs.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.radius, 22, 22]} />
          <meshStandardMaterial
            color={cloudColor}
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
      ))}
    </group>
  );
}

// Complete 3D Scene Assembly
function Hero3DScene({
  isNight,
  onPipClick,
  hasBlanket,
  isPetted,
  activeColor,
  lampColor,
  onCycleColor,
}) {
  const { width, height } = useThree((state) => state.viewport);
  const isDesktop = width > 5.5;

  // Pip scale & position calibrated to match reference image
  const pipScale = isDesktop ? 0.58 : 0.52;
  const pipX = isDesktop ? width * 0.24 : 0;
  const pipY = isDesktop ? -0.34 : -0.52;

  // Big Moon Balloon: positioned in upper-middle sky between text and Pip
  const balloonPos = useMemo(() => {
    const bx = isDesktop ? width * 0.08 : 0;
    const by = height * 0.25;
    return [bx, by, -2.4];
  }, [isDesktop, width, height]);

  // Lantern position on top right
  const lanternPos = useMemo(() => {
    const lx = isDesktop ? width * 0.44 : 2.0;
    const ly = height * 0.3;
    return [lx, ly, -0.7];
  }, [isDesktop, width, height]);

  return (
    <>
      {/* Radiant celestial lighting without dark shadows */}
      <ambientLight intensity={isNight ? 0.7 : 1.7} color={isNight ? '#8b7aae' : '#ffffff'} />
      <hemisphereLight
        skyColor={isNight ? '#1e293b' : '#ffffff'}
        groundColor={isNight ? '#0b1329' : '#dbeafe'}
        intensity={isNight ? 0.8 : 1.3}
      />
      <directionalLight
        position={[0, 2, 5]}
        intensity={isNight ? 0.9 : 1.2}
        color={isNight ? '#f8fafc' : '#ffffff'}
      />
      <directionalLight
        position={[4, 5, 2]}
        intensity={isNight ? 1.0 : 1.1}
        color={isNight ? '#fef08a' : '#fffbeb'}
      />

      {/* Puffy 3D Cloud Horizon across the bottom */}
      <BottomCloudBed isNight={isNight} width={width} height={height} />

      {/* Big Glowing Celestial Moon Balloon (Warm Soft Cream Ivory) */}
      <BigMoonBalloon
        isNight={isNight}
        activeColor={activeColor}
        position={balloonPos}
        onBalloonClick={onCycleColor}
      />

      {/* Hanging Bedside Lantern on top-right */}
      <HangingLantern
        isNight={isNight}
        activeColor={activeColor}
        lampColor={lampColor}
        position={lanternPos}
        onLanternClick={onCycleColor}
      />

      {/* Yellow 3D Stars: Floating & Hanging across Left, Center, and Right */}
      {/* 1. Top-Left Hanging Star */}
      <HangingStar
        position={[-width * 0.44, height * 0.36, -0.6]}
        isNight={isNight}
        scale={0.85}
        cordLength={2.6}
      />

      {/* 2. Left-Side Floating Star (near "Small baby.") */}
      <FloatingStar
        position={[-width * 0.43, 0.06, -0.5]}
        isNight={isNight}
        scale={0.68}
        speed={1.0}
      />

      {/* 3. Center-bottom Star (below balloon string, above clouds) */}
      <FloatingStar
        position={[width * 0.07, -height * 0.18, -0.9]}
        isNight={isNight}
        scale={0.7}
        speed={1.1}
      />

      {/* 4. Star directly above Pip's nightcap */}
      <FloatingStar
        position={[pipX + 0.22, height * 0.34, -0.7]}
        isNight={isNight}
        scale={0.58}
        speed={1.4}
      />

      {/* 5. Star between Pip's hat and the lantern */}
      <FloatingStar
        position={[pipX + 0.58, height * 0.16, -0.6]}
        isNight={isNight}
        scale={0.72}
        speed={1.2}
      />

      {/* 6. Star to the right of Pip near lantern */}
      <FloatingStar
        position={[pipX + 1.15, 0.05, -0.7]}
        isNight={isNight}
        scale={0.75}
        speed={1.2}
      />

      {/* 7. Star below Pip's cloud */}
      <FloatingStar
        position={[pipX + 0.48, -height * 0.24, -0.6]}
        isNight={isNight}
        scale={0.6}
        speed={0.9}
      />

      {/* Gentle Floating Stardust Sparkles */}
      <Sparkles
        count={isNight ? 50 : 35}
        scale={[width * 1.2, height * 1.2, 5]}
        position={[0, 0, -0.5]}
        size={isNight ? 3 : 2}
        speed={0.3}
        color={isNight ? '#fde047' : '#f59e0b'}
      />

      {/* Centerpiece 3D Pip Character */}
      <Float speed={1.3} rotationIntensity={0.14} floatIntensity={0.22}>
        <group position={[pipX, pipY, 0]} scale={[pipScale, pipScale, pipScale]}>
          <PipCharacter
            isNight={isNight}
            onPipClick={onPipClick}
            hasBlanket={hasBlanket}
            isPetted={isPetted}
            pipX={pipX}
            lanternColor={lampColor || activeColor || '#ff9e3b'}
          />
        </group>
      </Float>
    </>
  );
}

export function Pip3DCanvas({
  isNight,
  onPipClick,
  hasBlanket = false,
  isPetted = false,
  activeColor = '#ff9e3b',
  lampColor = '#ff9e3b',
  onCycleColor,
}) {
  const [hasWebGLError, setHasWebGLError] = useState(false);

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
      className="pip-canvas-full-wrapper"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        touchAction: 'pan-y',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.1, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
        onError={() => setHasWebGLError(true)}
      >
        <Suspense fallback={null}>
          <Hero3DScene
            isNight={isNight}
            onPipClick={onPipClick}
            hasBlanket={hasBlanket}
            isPetted={isPetted}
            activeColor={activeColor}
            lampColor={lampColor}
            onCycleColor={onCycleColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
