import React, { useState } from 'react';
import { Sun, Moon, Star, Sparkles, Lightbulb } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export function NightlightCollection() {
  const { playTone } = useAudio();

  const lanterns = [
    {
      id: 'moonbeam',
      name: 'Moonbeam Lantern',
      hue: '#b7a4e0',
      haloColor: 'rgba(183, 164, 224, 0.45)',
      icon: <Moon size={18} />,
      effect: 'Casts a gentle silvery-violet mist that invites dreams of sailing paper boats on lavender cloud rivers.',
      fieldNote: 'Best for restless dreamers who worry about tomorrow.'
    },
    {
      id: 'auroraglow',
      name: 'Aurora Borealis Lantern',
      hue: '#06b6d4',
      haloColor: 'rgba(6, 182, 212, 0.45)',
      icon: <Sparkles size={18} />,
      effect: 'Casts dancing waves of celestial cyan and emerald light, turning bedside shadows into quiet northern lights.',
      fieldNote: 'Tested on restless night owls; 100% reported feeling like they were floating in deep space peace.'
    },
    {
      id: 'littlestar',
      name: 'Little Star Lantern',
      hue: '#f2c66d',
      haloColor: 'rgba(242, 198, 109, 0.5)',
      icon: <Star size={18} />,
      effect: 'Catches stray nighttime nightmares, filters out scary shadows, and spins them into quiet shooting stars.',
      fieldNote: 'Pip’s personal bedside favorite. Never gets hot to the touch.'
    }
  ];

  const [activeLantern, setActiveLantern] = useState(lanterns[2]); // Little star default

  const handleSelectLantern = (lantern) => {
    setActiveLantern(lantern);
    playTone(523.25, 0.35, 'sine', 0.12);
  };

  return (
    <div
      className="project-card nightlight-card"
      style={{
        '--lantern-halo': activeLantern.haloColor,
        '--lantern-hue': activeLantern.hue,
      }}
    >
      <div className="project-grid">
        {/* Left Visual Column */}
        <div className="project-visual-col">
          <div
            className="lantern-preview-wrapper"
            style={{
              background: `radial-gradient(circle at center, ${activeLantern.haloColor} 0%, transparent 70%)`
            }}
          >
            <img
              src="/assets/pip_dream_lantern.png"
              alt="Pip's glowing Bedside Dream Lantern"
              className="lantern-feature-img"
            />
            <div
              className="lantern-glow-halo"
              style={{ backgroundColor: activeLantern.hue }}
            ></div>
          </div>

          <div className="project-tag-strip">
            <span>PROJECT NO. 02</span>
            <span>BEDSIDE LUMINESCENCE</span>
          </div>
        </div>

        {/* Right Interaction Column */}
        <div className="project-info-col">
          <span className="project-eyebrow">NOCTURNAL ILLUMINATION</span>
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

          {/* Active Lantern Specification Box */}
          <div
            className="lantern-spec-box"
            style={{ borderLeftColor: activeLantern.hue }}
          >
            <div className="spec-header">
              <Lightbulb size={16} color={activeLantern.hue} />
              <strong style={{ color: activeLantern.hue }}>{activeLantern.name} Active</strong>
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
