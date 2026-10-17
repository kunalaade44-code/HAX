import React, { useEffect, useState } from 'react';

export function SparkleTrail() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Check reduced motion preference or touch device
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) return;

    let idCounter = 0;
    let throttleTimeout = null;

    const handleMouseMove = (e) => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
      }, 45);

      const newSparkle = {
        id: idCounter++,
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 8) + 10,
        rotation: Math.floor(Math.random() * 360),
      };

      setSparkles((prev) => [...prev.slice(-12), newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 700);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (sparkles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-particle"
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            userSelect: 'none',
            color: '#f9ca24',
            textShadow: '0 0 6px rgba(249, 202, 36, 0.8)',
            animation: 'sparkleFade 0.7s forwards ease-out',
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
