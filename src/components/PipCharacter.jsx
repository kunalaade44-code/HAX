import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PipCharacter({
  isNight = false,
  onPipClick,
  hasBlanket = false,
  isPetted = false,
  pipX = 0,
  lanternColor = '#f59e0b',
}) {
  const groupRef = useRef();
  const headRef = useRef();
  const leftEyePupilRef = useRef();
  const rightEyePupilRef = useRef();
  const armRef = useRef();
  const heartRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [localPetTrigger, setLocalPetTrigger] = useState(0);

  // Sync isPetted prop with animation
  useEffect(() => {
    if (isPetted) {
      setLocalPetTrigger(Date.now());
    }
  }, [isPetted]);

  // Animation frame loop for breathing, floating, and eye-tracking
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouse = state.pointer;

    // Relative mouse X position: Pip sits on the right on desktop (normalized X ≈ 0.45)
    const pipScreenX = pipX > 0 ? 0.45 : 0;
    const relativeX = mouse.x - pipScreenX;

    // Time since petting
    const timeSincePet = (Date.now() - localPetTrigger) / 1000;
    const isCurrentlyPetted = timeSincePet < 1.4;

    if (groupRef.current) {
      // Gentle floating bob
      const petSquish = isCurrentlyPetted ? Math.sin(timeSincePet * Math.PI) * 0.08 : 0;
      groupRef.current.position.y = -0.2 + Math.sin(time * 1.5) * 0.1 - petSquish;
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.06;
      groupRef.current.rotation.z = Math.cos(time * 1.1) * 0.025;
    }

    if (headRef.current) {
      if (isCurrentlyPetted) {
        // Affectionate head tilt into petting hand
        headRef.current.rotation.z = 0.16 * Math.sin(timeSincePet * Math.PI);
        headRef.current.rotation.x = -0.08;
      } else {
        // Head turns gently to look toward cursor / left text column
        const targetHeadYaw = THREE.MathUtils.clamp(relativeX * 0.22, -0.32, 0.18);
        const targetHeadPitch = THREE.MathUtils.clamp(-mouse.y * 0.12, -0.15, 0.18);
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetHeadYaw, 0.08);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetHeadPitch, 0.08);
      }
    }

    if (armRef.current) {
      // Subtle hand waving
      armRef.current.rotation.z = Math.sin(time * 3) * 0.18 + 0.3;
    }

    // Pupils smoothly look toward cursor and left text
    if (leftEyePupilRef.current && rightEyePupilRef.current) {
      const targetPupilX = THREE.MathUtils.clamp(relativeX * 0.09, -0.075, 0.075);
      const targetPupilY = THREE.MathUtils.clamp(mouse.y * 0.08, -0.06, 0.06);

      leftEyePupilRef.current.position.x = THREE.MathUtils.lerp(
        leftEyePupilRef.current.position.x,
        -0.32 + targetPupilX,
        0.12
      );
      leftEyePupilRef.current.position.y = THREE.MathUtils.lerp(
        leftEyePupilRef.current.position.y,
        0.05 + targetPupilY,
        0.12
      );

      rightEyePupilRef.current.position.x = THREE.MathUtils.lerp(
        rightEyePupilRef.current.position.x,
        0.32 + targetPupilX,
        0.12
      );
      rightEyePupilRef.current.position.y = THREE.MathUtils.lerp(
        rightEyePupilRef.current.position.y,
        0.05 + targetPupilY,
        0.12
      );
    }

    // Floating Pet Heart Particle
    if (heartRef.current) {
      if (isCurrentlyPetted) {
        heartRef.current.visible = true;
        heartRef.current.position.y = 1.2 + timeSincePet * 0.7;
        heartRef.current.position.x = Math.sin(timeSincePet * 4) * 0.08;
        const fade = Math.max(0, 1 - timeSincePet / 1.4);
        heartRef.current.scale.set(fade * 0.8, fade * 0.8, fade * 0.8);
      } else {
        heartRef.current.visible = false;
      }
    }
  });

  // Procedural soft-falloff radial canvas texture for lantern color shadow pools
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.65)');
    grad.addColorStop(0.68, 'rgba(255, 255, 255, 0.22)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Materials
  const skullColor = isNight ? '#f3eee6' : '#fffdf9';
  const capColor = isNight ? '#0d1b2a' : '#1e3a8a';
  // Bold, rich celestial cerulean blue for the baby doll's lower body (100% distinct from white clouds!)
  const dressColor = isNight ? '#1e1b4b' : '#0284c7';
  const starGold = '#fbbf24';
  const bowAccent = isNight ? '#06b6d4' : '#0284c7';
  const amberGlow = '#ffb347';

  return (
    <group
      ref={groupRef}
      position={[0, -0.2, 0]}
      scale={hovered ? 1.04 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onPipClick}
      cursor="pointer"
    >
      {/* Floating Glowing Heart Particle during Petting */}
      <group ref={heartRef} position={[0, 1.2, 0.4]} visible={false}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#fb7185"
            emissiveIntensity={2.4}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#f43f5e" intensity={1.8} distance={2.5} />
      </group>

      {/* ================= CLOUD SEAT (Pure White Cloud Cushion with Lantern Bounce) ================= */}
      <group position={[0, -1.2, 0]}>
        {/* Main cloud puffs cradling Pip */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.92, 24, 24]} />
          <meshStandardMaterial
            color={isNight ? '#0f1c35' : '#ffffff'}
            emissive={lanternColor}
            emissiveIntensity={isNight ? 0.22 : 0.14}
            roughness={0.7}
            metalness={0.02}
          />
        </mesh>
        <mesh position={[-0.7, -0.15, 0.2]}>
          <sphereGeometry args={[0.68, 20, 20]} />
          <meshStandardMaterial
            color={isNight ? '#132342' : '#ffffff'}
            emissive={lanternColor}
            emissiveIntensity={isNight ? 0.16 : 0.1}
            roughness={0.7}
          />
        </mesh>
        <mesh position={[0.7, -0.12, 0.2]}>
          <sphereGeometry args={[0.7, 20, 20]} />
          <meshStandardMaterial
            color={isNight ? '#132342' : '#ffffff'}
            emissive={lanternColor}
            emissiveIntensity={isNight ? 0.25 : 0.18}
            roughness={0.7}
          />
        </mesh>
        <mesh position={[0.2, 0.05, 0.6]}>
          <sphereGeometry args={[0.58, 20, 20]} />
          <meshStandardMaterial
            color={isNight ? '#0e1a32' : '#ffffff'}
            emissive={lanternColor}
            emissiveIntensity={isNight ? 0.22 : 0.15}
            roughness={0.72}
          />
        </mesh>
        <mesh position={[-0.3, -0.1, -0.5]}>
          <sphereGeometry args={[0.65, 20, 20]} />
          <meshStandardMaterial color={isNight ? '#0b162c' : '#f8faff'} roughness={0.75} />
        </mesh>
      </group>

      {/* ================= LANTERN COLOR SHADOW EFFECT ON LOWER PART ================= */}
      {/* 1. Primary contact shadow disk on cloud seat directly under Pip's lower body */}
      <mesh position={[0.06, -0.92, 0.24]} rotation={[-Math.PI / 2 + 0.12, 0, 0]}>
        <planeGeometry args={[1.35, 1.15]} />
        <meshBasicMaterial
          map={shadowTexture}
          color={lanternColor}
          transparent
          opacity={isNight ? 0.72 : 0.58}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* 2. Soft wide ambient shadow glow pool embracing the lower cloud contour */}
      <mesh position={[0.08, -0.94, 0.2]} rotation={[-Math.PI / 2 + 0.12, 0, 0]}>
        <planeGeometry args={[1.8, 1.5]} />
        <meshBasicMaterial
          map={shadowTexture}
          color={lanternColor}
          transparent
          opacity={isNight ? 0.38 : 0.26}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Deep contact shadow crease beneath Pip's lap and feet */}
      <mesh position={[0.04, -0.88, 0.38]} rotation={[-Math.PI / 2 + 0.2, 0, 0]}>
        <planeGeometry args={[0.9, 0.65]} />
        <meshBasicMaterial
          map={shadowTexture}
          color={lanternColor}
          transparent
          opacity={isNight ? 0.8 : 0.65}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Directional lantern point light casting vibrant Lantern Color shadow/shading on lower body & clouds */}
      <pointLight
        position={[1.1, -0.45, 0.85]}
        color={lanternColor}
        intensity={isNight ? 2.8 : 2.0}
        distance={3.2}
      />

      {/* 5. Colored bounce light tinting Pip's underside and lap in lantern color */}
      <pointLight
        position={[-0.1, -1.05, 0.7]}
        color={lanternColor}
        intensity={isNight ? 1.6 : 1.1}
        distance={2.2}
      />

      {/* ================= LOWER PART OF BABY DOLL (Distinct Rich Celestial Blue Pajamas) ================= */}
      {/* 1. Main Baby Tummy / Torso */}
      <mesh position={[0, -0.62, 0.05]}>
        <sphereGeometry args={[0.72, 28, 28]} />
        <meshStandardMaterial
          color={dressColor}
          emissive={lanternColor}
          emissiveIntensity={isNight ? 0.22 : 0.14}
          roughness={0.48}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Chubby Baby Doll Hips / Legs (extends lower body with clear color boundary over clouds) */}
      <mesh position={[-0.34, -0.72, 0.18]}>
        <sphereGeometry args={[0.44, 24, 24]} />
        <meshStandardMaterial
          color={dressColor}
          emissive={lanternColor}
          emissiveIntensity={isNight ? 0.2 : 0.12}
          roughness={0.48}
          metalness={0.02}
        />
      </mesh>
      <mesh position={[0.34, -0.72, 0.18]}>
        <sphereGeometry args={[0.44, 24, 24]} />
        <meshStandardMaterial
          color={dressColor}
          emissive={lanternColor}
          emissiveIntensity={isNight ? 0.25 : 0.16}
          roughness={0.48}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Golden Star Pajama Buttons on chest */}
      <mesh position={[0, -0.48, 0.74]}>
        <octahedronGeometry args={[0.055]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#f59e0b"
          emissiveIntensity={1.4}
        />
      </mesh>
      <mesh position={[0, -0.66, 0.73]}>
        <octahedronGeometry args={[0.055]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#f59e0b"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* 4. White Pajama Ankle Cuffs & Booties (cute baby doll feet) */}
      <mesh position={[-0.32, -0.72, 0.52]}>
        <torusGeometry args={[0.15, 0.05, 12, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.55} />
      </mesh>
      <mesh position={[0.32, -0.72, 0.52]}>
        <torusGeometry args={[0.15, 0.05, 12, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.55} />
      </mesh>
      <mesh position={[-0.32, -0.74, 0.56]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[0.32, -0.74, 0.56]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* 5. Resting Mitten Hands / Paws */}
      <mesh position={[-0.44, -0.48, 0.36]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* Extra Cozy Embroidered Blanket Swaddle (when hasBlanket is active) */}
      {hasBlanket && (
        <group position={[0, -0.6, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.82, 28, 28]} />
            <meshStandardMaterial
              color={isNight ? '#312e81' : '#38bdf8'}
              emissive={lanternColor}
              emissiveIntensity={isNight ? 0.25 : 0.16}
              roughness={0.45}
              metalness={0.06}
            />
          </mesh>
          {/* Blanket folded top trim - lying comfortably horizontal across his lap/chest */}
          <mesh position={[0, 0.08, 0.48]} rotation={[Math.PI / 2.3, 0, 0]}>
            <torusGeometry args={[0.44, 0.07, 16, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
          {/* Gold Star Embroidery Accents on Blanket */}
          <mesh position={[-0.36, -0.08, 0.62]}>
            <octahedronGeometry args={[0.085]} />
            <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={1.4} />
          </mesh>
          <mesh position={[0.26, -0.04, 0.66]}>
            <octahedronGeometry args={[0.095]} />
            <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={1.4} />
          </mesh>
          <mesh position={[-0.08, -0.28, 0.65]}>
            <octahedronGeometry args={[0.075]} />
            <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={1.4} />
          </mesh>
        </group>
      )}

      {/* Little gentle waving arm */}
      <group ref={armRef} position={[0.65, -0.55, 0.2]}>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={skullColor} roughness={0.4} />
        </mesh>
      </group>

      {/* ================= PUFFY WHITE NECK SCARF ================= */}
      <group position={[0, -0.16, 0.04]} rotation={[0.05, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.48, 0.14, 16, 32]} />
          <meshStandardMaterial
            color={isNight ? '#cbd5e1' : '#ffffff'}
            roughness={0.6}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* ================= ROUNDED BABY HEAD ================= */}
      <group ref={headRef} position={[0, 0.22, 0]}>
        {/* Main smooth white head */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.88, 36, 36]} />
          <meshStandardMaterial
            color={skullColor}
            roughness={0.32}
            metalness={0.02}
          />
        </mesh>

        {/* Baby lower cheek softness */}
        <mesh position={[0, -0.28, 0.16]} scale={[1, 0.72, 0.8]}>
          <sphereGeometry args={[0.56, 24, 24]} />
          <meshStandardMaterial color={skullColor} roughness={0.32} />
        </mesh>

        {/* Golden-yellow crescent blush accents under the eyes */}
        <mesh position={[-0.48, -0.12, 0.65]} rotation={[0, -0.35, -0.1]}>
          <circleGeometry args={[0.13, 16]} />
          <meshBasicMaterial
            color="#fde047"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0.48, -0.12, 0.65]} rotation={[0, 0.35, 0.1]}>
          <circleGeometry args={[0.13, 16]} />
          <meshBasicMaterial
            color="#fde047"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ================= BIG GLOSSY OVAL EYES ================= */}
        {/* Left Eye - Large Glossy Oval */}
        <mesh position={[-0.32, 0.08, 0.72]} scale={[1, 1.25, 0.45]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.12} metalness={0.1} />
        </mesh>

        {/* Right Eye - Large Glossy Oval */}
        <mesh position={[0.32, 0.08, 0.72]} scale={[1, 1.25, 0.45]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.12} metalness={0.1} />
        </mesh>

        {/* Left Glowing Crescent Pupil / Eye Highlight (Tracks Cursor) */}
        <mesh ref={leftEyePupilRef} position={[-0.32, 0.1, 0.82]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#fffef0"
            emissive="#fef08a"
            emissiveIntensity={1.4}
            roughness={0.15}
          />
        </mesh>

        {/* Right Glowing Crescent Pupil / Eye Highlight (Tracks Cursor) */}
        <mesh ref={rightEyePupilRef} position={[0.32, 0.1, 0.82]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#fffef0"
            emissive="#fef08a"
            emissiveIntensity={1.4}
            roughness={0.15}
          />
        </mesh>

        {/* ================= BEDTIME NIGHTCAP ================= */}
        <group position={[0, 0.7, -0.04]} rotation={[-0.12, 0.18, 0.32]}>
          {/* Nightcap Cone base */}
          <mesh position={[0, 0.52, 0]}>
            <coneGeometry args={[0.84, 1.45, 32]} />
            <meshStandardMaterial color={capColor} roughness={0.55} />
          </mesh>

          {/* Curved nightcap tip trailing down */}
          <mesh position={[0.48, 1.2, -0.18]} rotation={[0, 0, -0.92]}>
            <coneGeometry args={[0.36, 1.05, 24]} />
            <meshStandardMaterial color={capColor} roughness={0.55} />
          </mesh>

          {/* Fluffy star pom-pom at the very tip */}
          <mesh position={[1.05, 1.3, -0.28]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={starGold}
              emissive={starGold}
              emissiveIntensity={0.9}
              roughness={0.3}
            />
          </mesh>

          {/* Thick, puffy white rolled brim cuff */}
          <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.86, 0.16, 16, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.65} />
          </mesh>

          {/* Golden confetti square on the front-left brim as seen in reference */}
          <mesh position={[-0.42, 0.28, 0.65]} rotation={[0.1, -0.2, 0.25]}>
            <boxGeometry args={[0.16, 0.16, 0.03]} />
            <meshStandardMaterial
              color="#facc15"
              emissive="#eab308"
              emissiveIntensity={1.0}
              roughness={0.25}
            />
          </mesh>

          {/* Small star accent on the side of the cap */}
          <mesh position={[0.25, 0.68, 0.45]} rotation={[0.3, 0.2, -0.2]}>
            <octahedronGeometry args={[0.08]} />
            <meshStandardMaterial
              color={starGold}
              emissive={starGold}
              emissiveIntensity={1.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
