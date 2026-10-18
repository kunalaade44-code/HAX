import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Star,
  Award,
  RotateCcw,
  Bell,
  Heart,
  Feather,
  Cloud,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../context/AudioContext';

const PILLOW_PROTOTYPES = [
  {
    id: 'cumulus',
    name: 'Cumulus Cloud Puff',
    icon: Cloud,
    tag: 'Classic Standard',
    desc: 'Woven from low-altitude morning cumulus clouds. Sweet vanilla scent.',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.35)',
    reboundSpeed: 0.8,
  },
  {
    id: 'stardust',
    name: 'Stardust Memory Foam',
    icon: Sparkles,
    tag: 'Slow Rebound',
    desc: 'Dense celestial foam infused with tiny glowing stardust. Relieves baby cranium tension.',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.35)',
    reboundSpeed: 0.4,
  },
  {
    id: 'marshmallow',
    name: 'Marshmallow Dream-Silk',
    icon: Heart,
    tag: 'Ultra Squishy',
    desc: 'Spun sugar-soft silk with cinnamon milk essence. Maximum bounce factor.',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.35)',
    reboundSpeed: 1.2,
  },
  {
    id: 'moonbeam',
    name: 'Moonbeam Down',
    icon: Feather,
    tag: 'Legendary Fluff',
    desc: 'Featherlight down harvested from falling shooting stars. Almost floats away.',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.35)',
    reboundSpeed: 1.0,
  },
];

export function PillowTestingLab() {
  const { playPillowSquish, playAlarmBell, playChime, playStarSparkle, speakText } = useAudio();

  const [currentPillow, setCurrentPillow] = useState(PILLOW_PROTOTYPES[0]);
  const [fluffLevel, setFluffLevel] = useState(25);
  const [squishCount, setSquishCount] = useState(0);
  const [isSquishing, setIsSquishing] = useState(false);
  const [isPipAsleep, setIsPipAsleep] = useState(false);
  const [justWokenUp, setJustWokenUp] = useState(false);
  const [particles, setParticles] = useState([]);
  const pillowRef = useRef(null);

  // Trigger sleep when fluff reaches >= 95%
  useEffect(() => {
    if (fluffLevel >= 95 && !isPipAsleep && !justWokenUp) {
      setIsPipAsleep(true);
      playStarSparkle();
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#38bdf8', '#ffffff', '#a855f7'],
        });
      } catch (e) {}
    }
  }, [fluffLevel, isPipAsleep, justWokenUp, playStarSparkle]);

  const handleSquish = (e) => {
    e.preventDefault();
    if (isPipAsleep) return;

    playPillowSquish();
    setIsSquishing(true);
    setTimeout(() => setIsSquishing(false), 220);

    const boost = Math.floor(Math.random() * 8) + 10;
    setFluffLevel((prev) => Math.min(100, prev + boost));
    setSquishCount((prev) => prev + 1);

    // Spawn visual fluff particle
    const rect = pillowRef.current ? pillowRef.current.getBoundingClientRect() : null;
    const clickX = e.clientX && rect ? e.clientX - rect.left : 150;
    const clickY = e.clientY && rect ? e.clientY - rect.top : 75;

    const newParticle = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
      size: Math.random() * 14 + 10,
    };
    setParticles((prev) => [...prev.slice(-6), newParticle]);
  };

  const handleWakeUp = () => {
    playAlarmBell();
    setIsPipAsleep(false);
    setJustWokenUp(true);
    setFluffLevel(65);

    speakText('W-wha?! I was awake! Just testing the pillow density!');
    setTimeout(() => setJustWokenUp(false), 5000);
  };

  const [suggestionNote, setSuggestionNote] = useState(
    "Pip's Tip: Tap the pillow to squish and fluff it. At 95%+ fluffiness, Pip falls fast asleep!"
  );

  const handleSuggestPillow = () => {
    playStarSparkle();

    const currentIdx = PILLOW_PROTOTYPES.findIndex((p) => p.id === currentPillow.id);
    const nextIdx = (currentIdx + 1) % PILLOW_PROTOTYPES.length;
    const suggested = PILLOW_PROTOTYPES[nextIdx];

    setCurrentPillow(suggested);
    setFluffLevel(40);
    setIsPipAsleep(false);
    setJustWokenUp(false);

    const suggestions = {
      cumulus: "Pip suggests: 'If your mind is racing with tomorrow's thoughts, vanilla cumulus fluff will quiet your mind.'",
      stardust: "Pip suggests: 'Tested after a busy day! Celestial stardust memory foam melts away cranium tension.'",
      marshmallow: "Pip suggests: 'Need sweet, cozy dreams? Spun-sugar cinnamon silk provides maximum gentle bounce!'",
      moonbeam: "Pip suggests: 'For dreamers who want to float weightlessly, shooting-star featherdown is pure magic!'",
    };

    const note = suggestions[suggested.id];
    setSuggestionNote(note);
    speakText(note);
  };

  const handleSelectPillow = (pillow) => {
    playChime(523.25);
    setCurrentPillow(pillow);
    setFluffLevel(20);
    setIsPipAsleep(false);
    setJustWokenUp(false);
    setSquishCount(0);
    setSuggestionNote(`Selected ${pillow.name}: ${pillow.desc}`);
  };

  const handleReset = () => {
    playChime(440);
    setFluffLevel(20);
    setIsPipAsleep(false);
    setJustWokenUp(false);
    setSquishCount(0);
  };

  const getFluffRating = (level) => {
    if (level < 40) return { label: 'Too Lumpy / Firm', color: '#94a3b8' };
    if (level < 70) return { label: 'Cozy & Soft', color: '#38bdf8' };
    if (level < 95) return { label: 'Dreamy Cloud Fluff', color: '#a855f7' };
    return { label: '100% MAXIMUM SNOOZE!', color: '#10b981' };
  };

  const rating = getFluffRating(fluffLevel);

  return (
    <section className="pillow-lab-section" id="pillow-lab">
      <div className="section-header">
        <span className="section-badge">
          <Feather size={13} />
          STAFF DIRECTIVE · COMFORT VERIFICATION
        </span>
        <h2 className="section-title">
          Pip's <em>Pillow Fluffiness Lab</em>
        </h2>
        <p className="section-subtitle">
          Pip takes pillow ergonomics very seriously. Give the experimental cloud pillow a squish!
          Beware: when fluffiness peaks, Pip falls fast asleep on duty.
        </p>

        {/* Pip's Live Suggestion Banner */}
        <div className="pillow-suggestion-pill">
          <Sparkles size={14} className="suggest-sparkle-icon" />
          <span>{suggestionNote}</span>
          <button
            type="button"
            onClick={handleSuggestPillow}
            className="suggest-pillow-trigger-btn"
            title="Ask Pip to suggest a different pillow"
          >
            Ask Pip to Suggest ✦
          </button>
        </div>
      </div>

      <div className="pillow-lab-container">
        {/* Prototype Selector Ribbon */}
        <div className="pillow-prototype-tabs" role="tablist">
          {PILLOW_PROTOTYPES.map((p) => {
            const Icon = p.icon;
            const isSelected = p.id === currentPillow.id;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectPillow(p)}
                className={`pillow-tab ${isSelected ? 'active' : ''}`}
                style={{ '--tab-glow': p.glow, '--tab-color': p.color }}
              >
                <Icon size={16} className="tab-icon" />
                <div className="tab-text">
                  <span className="tab-name">{p.name}</span>
                  <span className="tab-tag">{p.tag}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Testing Bench */}
        <div className="pillow-bench-grid">
          {/* Left Column: Interactive Tactile Pillow */}
          <div className="pillow-test-stage">
            <div className="bench-stage-top">
              <span className="bench-status-tag">
                <Sparkles size={13} /> Tested {squishCount} times
              </span>
              <button
                onClick={handleReset}
                className="bench-reset-btn"
                title="Reset pillow fluff"
                aria-label="Reset Pillow"
              >
                <RotateCcw size={14} />
                <span>Reset Fluff</span>
              </button>
            </div>

            {/* Interactive Pillow Squish Target */}
            <div
              ref={pillowRef}
              className={`interactive-pillow-cushion ${isSquishing ? 'squished' : ''} ${
                isPipAsleep ? 'asleep-pillow' : ''
              }`}
              onClick={handleSquish}
              style={{
                '--pillow-accent': currentPillow.color,
                '--pillow-glow': currentPillow.glow,
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') handleSquish(e);
              }}
              title={isPipAsleep ? 'Pip is asleep on the pillow! Ring the bell to wake.' : 'Click to squish and fluff the pillow!'}
              aria-label="Experimental Pillow Cushion"
            >
              {/* Cushion visual puffs */}
              <div className="pillow-puff puff-left" />
              <div className="pillow-puff puff-center">
                <div className="pillow-stitching-seam">✦ ✦ ✦</div>
                <span className="pillow-tap-hint">
                  {isPipAsleep ? '💤 Pip is snoring' : 'Tap to Fluff!'}
                </span>
              </div>
              <div className="pillow-puff puff-right" />

              {/* Floating particles from squishing */}
              {particles.map((p) => (
                <span
                  key={p.id}
                  className="squish-stardust-particle"
                  style={{
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                  }}
                >
                  ✦
                </span>
              ))}
            </div>

            {/* Live Fluffiness Meter */}
            <div className="fluff-meter-box">
              <div className="meter-header">
                <div className="meter-title-wrap">
                  <span className="meter-label">Fluffiness Density:</span>
                  <span className="meter-badge" style={{ color: rating.color }}>
                    {rating.label}
                  </span>
                </div>
                <span className="meter-pct">{fluffLevel}%</span>
              </div>

              <div className="meter-track">
                <div
                  className="meter-bar"
                  style={{
                    width: `${fluffLevel}%`,
                    backgroundColor: rating.color,
                  }}
                />
              </div>
            </div>

            {/* Wake Up Bell Action */}
            {isPipAsleep && (
              <div className="asleep-alert-box">
                <div className="asleep-msg">
                  <span className="asleep-icon">🔔</span>
                  <div>
                    <strong>Pip dozed off mid-verification!</strong>
                    <p>The pillow reached peak fluffiness and Pip couldn't resist.</p>
                  </div>
                </div>
                <button onClick={handleWakeUp} className="btn btn-primary wake-bell-btn">
                  <Bell size={16} />
                  <span>Ring Silver Wake-Up Bell</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Pip's Quality Control Dossier */}
          <div className="pillow-dossier-card">
            <div className="dossier-avatar-row">
              <div className="dossier-pip-frame">
                <img
                  src="/assets/pip_avatar_cloud.png"
                  alt="Pip testing pillow"
                  className={`dossier-pip-img ${isPipAsleep ? 'slumped-asleep' : ''}`}
                />
                {isPipAsleep && (
                  <div className="pip-floating-zzz">
                    <span>z</span>
                    <span>z</span>
                    <span>Z</span>
                  </div>
                )}
              </div>
              <div className="dossier-meta">
                <span className="dossier-role">Chief Pillow Verifier</span>
                <h4 className="dossier-name">Pip the Skull Baby</h4>
                <span className={`inspector-status-badge ${isPipAsleep ? 'status-asleep' : ''}`}>
                  {isPipAsleep
                    ? '💤 Sleeping on Shift'
                    : justWokenUp
                    ? '⭐ Startled & Alert'
                    : '🔍 Evaluating Softness'}
                </span>
              </div>
            </div>

            <div className="dossier-quote-bubble">
              <p>
                {isPipAsleep
                  ? '"Zzz... cloud seam... 99.8% softness... don\'t wake me till morning... zzz"'
                  : justWokenUp
                  ? '"W-whoa! I wasn\'t sleeping! I was just conducting a cranial pressure test!"'
                  : fluffLevel > 70
                  ? '"Oof... this pillow is getting dangerously comfortable... my eye sockets feel so heavy..."'
                  : '"Keep fluffing! A good dream requires exactly zero lumps."'}
              </p>
            </div>

            {/* Field Notes on Selected Prototype */}
            <div className="dossier-spec-table">
              <div className="spec-row">
                <span className="spec-label">Prototype:</span>
                <span className="spec-val">{currentPillow.name}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Aroma:</span>
                <span className="spec-val">{currentPillow.desc}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Rebound:</span>
                <span className="spec-val">{currentPillow.tag}</span>
              </div>
            </div>

            {/* Certified Stamp */}
            {fluffLevel >= 95 && (
              <div className="official-stamp-card">
                <div className="stamp-icon-wrap">
                  <Award size={24} />
                </div>
                <div className="stamp-text">
                  <span className="stamp-title">CERTIFIED 100% CLOUD GRADE</span>
                  <span className="stamp-subtitle">
                    Approved by Midnight Nursery Sleep Engineering
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
