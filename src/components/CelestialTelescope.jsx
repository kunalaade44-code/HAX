import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Star,
  X,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Eye,
  PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../context/AudioContext';

const CONSTELLATIONS = [
  {
    id: 'ursa-slumber',
    name: 'Ursa Slumber (The Sleeping Bear)',
    lore: 'Legend says this celestial bear snores soft snowdrifts over sleepy villages every winter night.',
    points: [
      { id: 0, x: 260, y: 150, label: 'Star Alpha' },
      { id: 1, x: 380, y: 120, label: 'Left Ear' },
      { id: 2, x: 440, y: 190, label: 'Right Ear' },
      { id: 3, x: 410, y: 280, label: 'Cheek' },
      { id: 4, x: 280, y: 310, label: 'Snout' },
      { id: 5, x: 190, y: 230, label: 'Cranium' },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
  },
  {
    id: 'crescent-cradle',
    name: 'The Crescent Cradle',
    lore: 'A golden rocker floating above the highest cloud, keeping wandering stars safe from falling.',
    points: [
      { id: 0, x: 200, y: 140, label: 'Top Horn' },
      { id: 1, x: 170, y: 240, label: 'Moon Arc' },
      { id: 2, x: 230, y: 330, label: 'Bottom Horn' },
      { id: 3, x: 350, y: 320, label: 'Rocker Base' },
      { id: 4, x: 430, y: 240, label: 'Rocker Spine' },
      { id: 5, x: 340, y: 170, label: 'Star Pillow' },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
  },
  {
    id: 'cloud-baby',
    name: "Pip's Little Cloud",
    lore: 'Discovered by Pip on his very first night at the observatory. Softest shape in the northern sky.',
    points: [
      { id: 0, x: 180, y: 250, label: 'Left Puff' },
      { id: 1, x: 240, y: 160, label: 'Top Left' },
      { id: 2, x: 360, y: 150, label: 'Top Right' },
      { id: 3, x: 440, y: 230, label: 'Right Puff' },
      { id: 4, x: 370, y: 310, label: 'Bottom Right' },
      { id: 5, x: 240, y: 310, label: 'Bottom Left' },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
  },
];

export function CelestialTelescope({ isOpen, onClose }) {
  const { playHarpNote, playTelescopeComplete, playTone, playChime } = useAudio();

  const [activeConstellationIdx, setActiveConstellationIdx] = useState(0);
  const [clickedSequence, setClickedSequence] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [freeMode, setFreeMode] = useState(false);
  const [freeLines, setFreeLines] = useState([]);
  const [freeLastPoint, setFreeLastPoint] = useState(null);

  const current = CONSTELLATIONS[activeConstellationIdx];
  const isCurrentComplete = completedIds.includes(current.id);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleStarClick = (ptId) => {
    if (freeMode) {
      const pt = current.points.find((p) => p.id === ptId);
      if (!pt) return;
      playHarpNote(ptId * 2);

      if (freeLastPoint !== null) {
        setFreeLines((prev) => [...prev, [freeLastPoint, ptId]]);
        setFreeLastPoint(null);
      } else {
        setFreeLastPoint(ptId);
      }
      return;
    }

    if (isCurrentComplete) return;

    // Check if clicked in correct sequence or progressive addition
    if (!clickedSequence.includes(ptId)) {
      const nextSeq = [...clickedSequence, ptId];
      playHarpNote(nextSeq.length * 2);
      setClickedSequence(nextSeq);

      // Check if all stars connected
      if (nextSeq.length === current.points.length) {
        setCompletedIds((prev) => [...prev, current.id]);
        playTelescopeComplete();
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.5 },
            colors: ['#38bdf8', '#fbbf24', '#ffffff', '#c084fc'],
          });
        } catch (e) {}
      }
    }
  };

  const handleResetConstellation = () => {
    playTone(392, 0.2);
    setClickedSequence([]);
    setCompletedIds((prev) => prev.filter((id) => id !== current.id));
    setFreeLines([]);
    setFreeLastPoint(null);
  };

  const switchConstellation = (idx) => {
    playChime(523.25);
    setActiveConstellationIdx(idx);
    setClickedSequence([]);
    setFreeLines([]);
    setFreeLastPoint(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="telescope-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Pip's Celestial Telescope Observatory"
    >
      <div className="telescope-container">
        {/* Top Header */}
        <div className="telescope-header">
          <div className="telescope-badge">
            <Compass size={16} />
            <span>Midnight Observatory · 300mm Celestial Lens</span>
          </div>
          <button
            onClick={onClose}
            className="telescope-close-btn"
            title="Step away from telescope (Esc)"
            aria-label="Close Telescope"
          >
            <X size={20} />
          </button>
        </div>

        {/* Constellation Selector Tabs */}
        <div className="telescope-tabs-bar">
          {CONSTELLATIONS.map((c, idx) => {
            const isDone = completedIds.includes(c.id);
            const isActive = idx === activeConstellationIdx;
            return (
              <button
                key={c.id}
                onClick={() => switchConstellation(idx)}
                className={`telescope-tab ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              >
                <Star size={13} className={isDone ? 'gold-star' : ''} />
                <span>{c.name.split(' (')[0]}</span>
                {isDone && <CheckCircle2 size={13} className="check-done" />}
              </button>
            );
          })}
          <button
            onClick={() => {
              setFreeMode(!freeMode);
              setFreeLines([]);
              setFreeLastPoint(null);
            }}
            className={`telescope-tab free-tab ${freeMode ? 'active' : ''}`}
            title="Free Draw Mode: Connect any stars"
          >
            <PenTool size={13} />
            <span>Free Stargaze</span>
          </button>
        </div>

        {/* Viewfinder Circle (Brass bezel + deep cosmic viewport) */}
        <div className="telescope-viewfinder-frame">
          <div className="brass-bezel-outer">
            <div className="brass-bezel-inner">
              {/* Sky Canvas / SVG */}
              <svg
                viewBox="0 0 600 450"
                className="telescope-sky-svg"
                aria-label="Interactive starry sky"
              >
                {/* Background Twinkle Stars */}
                {[
                  [70, 80],
                  [120, 320],
                  [480, 80],
                  [530, 340],
                  [300, 50],
                  [150, 400],
                  [450, 400],
                  [80, 200],
                  [520, 200],
                ].map(([bx, by], i) => (
                  <circle
                    key={i}
                    cx={bx}
                    cy={by}
                    r={i % 2 === 0 ? 1.5 : 2}
                    fill="#ffffff"
                    opacity={0.4}
                  />
                ))}

                {/* Drawn Connections in Free Mode */}
                {freeMode &&
                  freeLines.map(([p1Id, p2Id], i) => {
                    const p1 = current.points.find((p) => p.id === p1Id);
                    const p2 = current.points.find((p) => p.id === p2Id);
                    if (!p1 || !p2) return null;
                    return (
                      <line
                        key={i}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray="3 3"
                      />
                    );
                  })}

                {/* Drawn Constellation Lines in Regular Mode */}
                {!freeMode &&
                  current.connections.map(([fromId, toId], idx) => {
                    const fromPt = current.points[fromId];
                    const toPt = current.points[toId];
                    const isFromClicked = clickedSequence.includes(fromId);
                    const isToClicked = clickedSequence.includes(toId);
                    const isDrawn = isCurrentComplete || (isFromClicked && isToClicked);

                    if (!isDrawn) return null;

                    return (
                      <line
                        key={idx}
                        x1={fromPt.x}
                        y1={fromPt.y}
                        x2={toPt.x}
                        y2={toPt.y}
                        stroke={isCurrentComplete ? '#fbbf24' : '#38bdf8'}
                        strokeWidth={isCurrentComplete ? 3 : 2}
                        className={isCurrentComplete ? 'constellation-glow-line' : ''}
                      />
                    );
                  })}

                {/* Glowing Constellation Core Fill on completion */}
                {isCurrentComplete && (
                  <polygon
                    points={current.points.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(251, 191, 36, 0.4)"
                    strokeWidth="1"
                  />
                )}

                {/* Interactive Star Nodes */}
                {current.points.map((pt) => {
                  const isClicked = clickedSequence.includes(pt.id) || isCurrentComplete;
                  const isSelectedForFree = freeLastPoint === pt.id;

                  return (
                    <g
                      key={pt.id}
                      className="telescope-star-group"
                      onClick={() => handleStarClick(pt.id)}
                      cursor="pointer"
                    >
                      {/* Outer pulse aura */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isClicked ? 16 : 12}
                        className={`star-halo-ring ${isClicked ? 'connected' : 'pulsing'}`}
                      />

                      {/* Center Star Point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelectedForFree ? 7 : isClicked ? 6 : 4.5}
                        fill={isClicked ? '#fbbf24' : isSelectedForFree ? '#ec4899' : '#ffffff'}
                      />

                      {/* Star label */}
                      <text
                        x={pt.x}
                        y={pt.y + 20}
                        textAnchor="middle"
                        fill={isClicked ? '#fde68a' : '#94a3b8'}
                        fontSize="11"
                        fontFamily="DM Sans, sans-serif"
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}

                {/* Reticle Crosshairs */}
                <line x1="300" y1="20" x2="300" y2="430" stroke="rgba(255,255,255,0.08)" />
                <line x1="40" y1="225" x2="560" y2="225" stroke="rgba(255,255,255,0.08)" />
                <circle
                  cx="300"
                  cy="225"
                  r="180"
                  stroke="rgba(255,255,255,0.06)"
                  fill="none"
                />
              </svg>

              {/* Lens Glare Sheen */}
              <div className="lens-glare-overlay" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Bottom Observatory Notes & Action */}
        <div className="telescope-footer">
          <div className="telescope-lore-box">
            <div className="lore-title-row">
              <Sparkles size={14} className="inline-star" />
              <h4>{current.name}</h4>
              {isCurrentComplete && (
                <span className="lore-discovered-tag">✦ Constellation Charted!</span>
              )}
            </div>
            <p className="lore-desc">
              {isCurrentComplete ? current.lore : 'Click all starry nodes to chart this slumber constellation and unlock Pip\'s notes.'}
            </p>
          </div>

          <div className="telescope-controls">
            <span className="telescope-progress-info">
              {freeMode
                ? `Free Draw: Click any 2 stars to bridge (${freeLines.length} lines)`
                : `Connected: ${clickedSequence.length}/${current.points.length} Stars`}
            </span>
            <button
              onClick={handleResetConstellation}
              className="btn btn-secondary telescope-reset-btn"
              title="Clear connected lines"
            >
              <RotateCcw size={14} />
              <span>Reset Sky</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
