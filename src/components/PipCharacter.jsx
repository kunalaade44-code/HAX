import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PipCharacter({ isNight = false, onPipClick }) {
  const groupRef = useRef();
  const leftEyePupilRef = useRef();
  const rightEyePupilRef = useRef();
  const armRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animation frame loop for breathing, floating, and eye-tracking
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating bob
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.12;
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
      groupRef.current.rotation.z = Math.cos(time * 1.1) * 0.03;
    }

    if (armRef.current) {
      // Subtle hand waving
      armRef.current.rotation.z = Math.sin(time * 3) * 0.2 + 0.3;
    }

    // Gentle eye pupil tracking within a safe natural boundary
    const mouse = state.pointer;
    if (leftEyePupilRef.current && rightEyePupilRef.current) {
      const targetX = THREE.MathUtils.clamp(mouse.x * 0.08, -0.07, 0.07);
      const targetY = THREE.MathUtils.clamp(mouse.y * 0.08, -0.06, 0.06);

      leftEyePupilRef.current.position.x = -0.32 + targetX;
      leftEyePupilRef.current.position.y = 0.05 + targetY;

      rightEyePupilRef.current.position.x = 0.32 + targetX;
      rightEyePupilRef.current.position.y = 0.05 + targetY;
    }
  });

  // Materials
  const skullColor = isNight ? '#f3eee6' : '#fffdf9';
  const capColor = isNight ? '#0d1b2a' : '#1e3a8a';
  const starGold = '#fbbf24';
  const bowAccent = isNight ? '#06b6d4' : '#0284c7';
  const amberGlow = '#ffb347';

  return (
    <group
      ref={groupRef}
      position={[0, -0.2, 0]}
      scale={hovered ? 1.05 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onPipClick}
      cursor="pointer"
    >
      {/* ================= CLOUD SEAT ================= */}
      <group position={[0, -1.2, 0]}>
        {/* Main cloud puffs */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.9, 24, 24]} />
          <meshStandardMaterial
            color={isNight ? '#0f1c35' : '#ffffff'}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[-0.7, -0.15, 0.2]}>
          <sphereGeometry args={[0.65, 20, 20]} />
          <meshStandardMaterial color={isNight ? '#132342' : '#ffffff'} roughness={0.7} />
        </mesh>
        <mesh position={[0.7, -0.12, 0.2]}>
          <sphereGeometry args={[0.68, 20, 20]} />
          <meshStandardMaterial color={isNight ? '#132342' : '#ffffff'} roughness={0.7} />
        </mesh>
        <mesh position={[0.2, 0.05, 0.6]}>
          <sphereGeometry args={[0.55, 20, 20]} />
          <meshStandardMaterial color={isNight ? '#0e1a32' : '#f0f7ff'} roughness={0.75} />
        </mesh>
        <mesh position={[-0.3, -0.1, -0.5]}>
          <sphereGeometry args={[0.62, 20, 20]} />
          <meshStandardMaterial color={isNight ? '#0b162c' : '#eaf2fd'} roughness={0.8} />
        </mesh>
      </group>

      {/* ================= BABY BODY (Swaddle / Blanket) ================= */}
      <mesh position={[0, -0.65, 0.05]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial
          color={isNight ? '#0f2038' : '#dbeafe'}
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>

      {/* Little waving arm */}
      <group ref={armRef} position={[0.55, -0.6, 0.25]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={skullColor} roughness={0.4} />
        </mesh>
      </group>

      {/* Other tiny resting arm */}
      <mesh position={[-0.5, -0.65, 0.25]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={skullColor} roughness={0.4} />
      </mesh>

      {/* ================= ROUNDED SKULL BABY HEAD ================= */}
      <group position={[0, 0.2, 0]}>
        {/* Main smooth skull cranium */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshStandardMaterial
            color={skullColor}
            roughness={0.35}
            metalness={0.05}
          />
        </mesh>

        {/* Baby cheeks / lower jaw softness */}
        <mesh position={[0, -0.32, 0.18]} scale={[1, 0.7, 0.8]}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color={skullColor} roughness={0.35} />
        </mesh>

        {/* Warm stardust glow on cheeks */}
        <mesh position={[-0.52, -0.18, 0.58]} rotation={[0, -0.4, 0]}>
          <circleGeometry args={[0.16, 16]} />
          <meshBasicMaterial
            color="#fcd34d"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0.52, -0.18, 0.58]} rotation={[0, 0.4, 0]}>
          <circleGeometry args={[0.16, 16]} />
          <meshBasicMaterial
            color="#fcd34d"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ================= SOFT RECESSED EYE SOCKETS ================= */}
        {/* Left Socket */}
        <mesh position={[-0.32, 0.05, 0.68]} scale={[1, 1.15, 0.5]}>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial color="#1a1420" roughness={0.9} />
        </mesh>

        {/* Right Socket */}
        <mesh position={[0.32, 0.05, 0.68]} scale={[1, 1.15, 0.5]}>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshStandardMaterial color="#1a1420" roughness={0.9} />
        </mesh>

        {/* ================= TINY GLOWING AMBER PUPILS ================= */}
        {/* Left Glowing Pupil */}
        <mesh ref={leftEyePupilRef} position={[-0.32, 0.05, 0.8]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            color={amberGlow}
            emissive={amberGlow}
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>

        {/* Right Glowing Pupil */}
        <mesh ref={rightEyePupilRef} position={[0.32, 0.05, 0.8]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            color={amberGlow}
            emissive={amberGlow}
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>

        {/* Tiny Skull Nose Indent (Soft heart / inverted triangle) */}
        <mesh position={[0, -0.15, 0.77]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.06, 0.08, 12]} />
          <meshStandardMaterial color="#2d2232" roughness={0.8} />
        </mesh>

        {/* Tiny Crooked Baby Smile */}
        <mesh position={[0.02, -0.34, 0.74]} rotation={[0, 0, 0.1]}>
          <torusGeometry args={[0.13, 0.025, 12, 24, Math.PI * 0.9]} />
          <meshStandardMaterial color="#35263a" roughness={0.6} />
        </mesh>

        {/* ================= BEDTIME NIGHTCAP ================= */}
        <group position={[0, 0.65, -0.05]} rotation={[-0.15, 0.2, 0.35]}>
          {/* Nightcap Cone base */}
          <mesh position={[0, 0.5, 0]}>
            <coneGeometry args={[0.82, 1.4, 28]} />
            <meshStandardMaterial color={capColor} roughness={0.6} />
          </mesh>

          {/* Curved nightcap tip trailing down */}
          <mesh position={[0.45, 1.15, -0.2]} rotation={[0, 0, -0.9]}>
            <coneGeometry args={[0.35, 1.0, 20]} />
            <meshStandardMaterial color={capColor} roughness={0.6} />
          </mesh>

          {/* Fluffy star pom-pom at the very tip */}
          <mesh position={[1.0, 1.25, -0.3]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={starGold}
              emissive={starGold}
              emissiveIntensity={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Nightcap brim / trim */}
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.84, 0.14, 16, 32]} />
            <meshStandardMaterial color="#fff6eb" roughness={0.7} />
          </mesh>

          {/* Star decorations stitched on nightcap */}
          <mesh position={[-0.35, 0.4, 0.52]} rotation={[0.2, -0.3, 0.4]}>
            <octahedronGeometry args={[0.11]} />
            <meshStandardMaterial
              color={starGold}
              emissive={starGold}
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh position={[0.25, 0.65, 0.42]} rotation={[0.4, 0.2, -0.2]}>
            <octahedronGeometry args={[0.09]} />
            <meshStandardMaterial
              color={starGold}
              emissive={starGold}
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Celestial Cyan Ribbon Bow on the nightcap brim */}
          <group position={[-0.45, -0.15, 0.75]} rotation={[0, 0.3, -0.2]}>
            <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.4]}>
              <boxGeometry args={[0.16, 0.08, 0.05]} />
              <meshStandardMaterial color={bowAccent} roughness={0.5} />
            </mesh>
            <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.4]}>
              <boxGeometry args={[0.16, 0.08, 0.05]} />
              <meshStandardMaterial color={bowAccent} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
