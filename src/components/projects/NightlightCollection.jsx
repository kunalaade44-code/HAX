import React, { useState } from 'react';
import { Sun, Moon, Star, Sparkles, Lightbulb, Power, Sliders } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export function NightlightCollection() {
  const { playTone, playMusicBoxChime } = useAudio();

  const lanterns = [
    {
      id: 'moonbeam',
      name: 'Moonbeam Lantern',
      hue: '#b7a4e0',
      haloColor: 'rgba(183, 164, 224, 0.55)',
      icon: <Moon size={18} />,
      effect: 'Casts a gentle silvery-violet mist that invites dreams of sailing paper boats on lavender cloud rivers.',
      fieldNote: 'Best for restless dreamers who worry about tomorrow.',
      soundType: 'moon',
    },
    {
      id: 'auroraglow',
      name: 'Aurora Borealis Lantern',
      hue: '#06b6d4',
      haloColor: 'rgba(6, 182, 212, 0.55)',
      icon: <Sparkles size={18} />,
      effect: 'Casts dancing waves of celestial cyan and emerald light, turning bedside shadows into quiet northern lights.',
      fieldNote: 'Tested on restless night owls; 100% reported feeling like they were floating in deep space peace.',
      soundType: 'aurora',
    },
    {
      id: 'littlestar',
      name: 'Little Star Lantern',
      hue: '#f2c66d',
      haloColor: 'rgba(242, 198, 109, 0.6)',
      icon: <Star size={18} />,
      effect: 'Catches stray nighttime nightmares, filters out scary shadows, and spins them into quiet shooting stars.',
      fieldNote: 'Pip’s personal bedside favorite. Never gets hot to the touch.',
      soundType: 'star',
    }
  ];

  const [activeLantern, setActiveLantern] = useState(lanterns[2]); // Little star default
  const [isLampOn, setIsLampOn] = useState(true);
  const [brightness, setBrightness] = useState(85); // 25 to 100%
  const [isSwaying, setIsSwaying] = useState(false);

  const handleSelectLantern = (lantern) => {
    setActiveLantern(lantern);
    if (!isLampOn) setIsLampOn(true);

    if (lantern.soundType === 'moon') {
      // Warm resonant singing bowl tone
      playTone(440, 0.7, 'sine', 0.15);
    } else if (lantern.soundType === 'aurora') {
      // Cascading celestial arpeggio
      [587.33, 739.99, 880, 1174.66].forEach((f, idx) => {
        setTimeout(() => playTone(f, 0.45, 'triangle', 0.09), idx * 80);
      });
    } else {
      // Crystalline star chime
      playMusicBoxChime(1046.5, { overtone: true, duration: 1.4, volume: 0.16 });
    }
  };

  const handleTogglePower = () => {
    playTone(isLampOn ? 220 : 660, 0.15, 'sine', 0.12);
    setIsLampOn(!isLampOn);
  };

  const handleLanternClick = () => {
    playTone(523.25, 0.25, 'triangle', 0.1);
    setIsSwaying(true);
    setTimeout(() => setIsSwaying(false), 1200);
  };

  const calculatedHalo = isLampOn
    ? activeLantern.haloColor.replace(/[\d.]+\)$/, `${(brightness / 100) * 0.75})`)
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <div
      className="project-card nightlight-card"
      style={{
        '--lantern-halo': calculatedHalo,
        '--lantern-hue': isLampOn ? activeLantern.hue : '#64748b',
        '--lantern-brightness': isLampOn ? `${brightness}%` : '20%',
      }}
    >
      <div className="project-grid">
        {/* Left Visual Column */}
        <div className="project-visual-col">
          <div
            className={`lantern-preview-wrapper ${!isLampOn ? 'lamp-off' : ''} ${isSwaying ? 'swaying' : ''}`}
            onClick={handleLanternClick}
            title="Click lantern to gently sway!"
            style={{
              background: `radial-gradient(circle at center, ${calculatedHalo} 0%, transparent 72%)`,
            }}
          >
            {/* Floating Celestial Stardust Aura */}
            {isLampOn && (
              <div className="lantern-particles-orbit" aria-hidden="true">
                <span className="orbit-sparkle sp1" style={{ color: activeLantern.hue }}>✦</span>
                <span className="orbit-sparkle sp2" style={{ color: activeLantern.hue }}>★</span>
                <span className="orbit-sparkle sp3" style={{ color: activeLantern.hue }}>✧</span>
                <span className="orbit-sparkle sp4" style={{ color: activeLantern.hue }}>✦</span>
              </div>
            )}

            <img
              src="/assets/pip_dream_lantern.png"
              alt="Pip's glowing Bedside Dream Lantern"
              className="lantern-feature-img"
              style={{
                filter: isLampOn
                  ? `drop-shadow(0 0 ${(brightness / 100) * 35}px ${activeLantern.haloColor}) brightness(${0.7 + (brightness / 100) * 0.45})`
                  : 'brightness(0.4) grayscale(0.5)',
              }}
            />
            <div
              className="lantern-glow-halo"
              style={{
                backgroundColor: isLampOn ? activeLantern.hue : 'transparent',
                opacity: isLampOn ? (brightness / 100) * 0.85 : 0,
              }}
            />

            <span className="lantern-sway-hint">
              {isLampOn ? 'Tap to sway lamp' : 'Lamp is sleeping'}
            </span>
          </div>

          <div className="project-tag-strip">
            <span>PROJECT NO. 02</span>
            <span>BEDSIDE LUMINESCENCE</span>
          </div>
        </div>

        {/* Right Interaction Column */}
        <div className="project-info-col">
          <div className="nightlight-top-bar">
            <span className="project-eyebrow">NOCTURNAL ILLUMINATION</span>

            {/* Quick Lamp Power Switch */}
            <button
              onClick={handleTogglePower}
              className={`lamp-power-switch ${isLampOn ? 'on' : 'off'}`}
              title={isLampOn ? 'Turn lantern off' : 'Turn lantern on'}
              aria-label="Toggle Lantern Power"
            >
              <Power size={14} />
              <span>{isLampOn ? 'Lamp Lit' : 'Dimmed'}</span>
            </button>
          </div>

          <h3 className="project-title">The Nightlight Collection</h3>
          <p className="project-desc">
            Magical bedside lanterns designed for little dreamers who get uneasy in the dark.
            Select a lantern to illuminate the nursery with its signature starlight wavelength.
          </p>

          {/* Lantern Selection Pills */}
          <div className="lantern-selector-row" role="radiogroup" aria-label="Select Bedside Lantern">
            {lanterns.map((lantern) => {
              const isSelected = activeLantern.id === lantern.id;
              return (
                <button
                  key={lantern.id}
                  onClick={() => handleSelectLantern(lantern)}
                  className={`lantern-choice-btn ${isSelected ? 'active' : ''}`}
                  style={{
                    borderColor: isSelected ? lantern.hue : undefined,
                    color: isSelected ? lantern.hue : undefined,
                    boxShadow: isSelected ? `0 0 16px ${lantern.haloColor}` : undefined,
                  }}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <span className="choice-icon">{lantern.icon}</span>
                  <span className="choice-name">{lantern.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Brightness Dimmer Controls */}
          <div className="lantern-dimmer-bar">
            <div className="dimmer-label-wrap">
              <span className="dimmer-title">
                <Sliders size={13} className="inline-icon" /> Luminescence Dimmer:
              </span>
              <span className="dimmer-val">{brightness}% Intensity</span>
            </div>
            <div className="dimmer-presets-row">
              {[
                { label: 'Soft Slumber', val: 35 },
                { label: 'Cozy Reading', val: 70 },
                { label: 'Starlight Radiance', val: 100 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => {
                    playTone(400 + p.val * 3, 0.15);
                    setBrightness(p.val);
                    if (!isLampOn) setIsLampOn(true);
                  }}
                  className={`dimmer-pill-btn ${brightness === p.val && isLampOn ? 'active' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Lantern Specification Box */}
          <div
            className="lantern-spec-box"
            style={{
              borderLeftColor: activeLantern.hue,
              opacity: isLampOn ? 1 : 0.6,
            }}
          >
            <div className="spec-header">
              <Lightbulb size={16} color={activeLantern.hue} />
              <strong style={{ color: activeLantern.hue }}>{activeLantern.name} Active</strong>
              <span className="spec-wavelength-pill" style={{ color: activeLantern.hue }}>
                ✦ {activeLantern.soundType.toUpperCase()} FREQUENCY
              </span>
            </div>
            <p className="spec-effect">{activeLantern.effect}</p>
            <span className="spec-field-note">
              ✧ <strong>Pip's Field Note:</strong> {activeLantern.fieldNote}
            </span>
          </div>

          <div className="project-foot-role">
            <strong>Pip's Creative Role:</strong> "I hand-blow the glass so the starlight feels like a warm hug, never like a glaring flashlight."
          </div>
        </div>
      </div>
    </div>
  );
}
