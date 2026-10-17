import React, { useState } from 'react';
import { Star, Moon, Heart, Sparkles, Coffee, Music, ShieldCheck, Smile } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export function CharacterDossier() {
  const { playChime, playTone } = useAudio();
  const [activeTab, setActiveTab] = useState('dossier');

  const traits = [
    { label: "Species", value: "Skull Baby", icon: <Smile size={16} />, detail: "Friendly, rounded cranium with glowing amber eyes" },
    { label: "Occupation", value: "Junior Dream Engineer", icon: <Sparkles size={16} />, detail: "Designs restful slumbers for restless critters" },
    { label: "Workplace", value: "The Midnight Nursery", icon: <Moon size={16} />, detail: "An attic observatory floating above twilight rooftops" },
    { label: "Personality", value: "Gentle, sleepy, imaginative, caring", icon: <Heart size={16} />, detail: "Approaches every quiet creature with tender patience" },
    { label: "Favorite Things", value: "Moonlight, music boxes, warm blankets", icon: <Music size={16} />, detail: "Loves soft textures and gentle pentatonic scales" },
    { label: "Signature Quirk", value: "Falls asleep mid-test", icon: <Coffee size={16} />, detail: "Frequently dozes off while verifying pillow fluffiness" }
  ];

  const handleCardClick = (trait) => {
    playChime(587.33); // D5
  };

  return (
    <section className="dossier-section" id="about">
      <div className="section-header">
        <span className="section-badge">
          <Star size={13} />
          PERSONNEL ARCHIVE · DOSSIER NO. 01
        </span>
        <h2 className="section-title">
          Meet Pip, the <em>Skull Baby</em>
        </h2>
        <p className="section-subtitle">
          A gentle guardian of bedtime hours. Get to know the dreamer behind the nightlights.
        </p>
      </div>

      <div className="dossier-grid">
        {/* Left Column: Official Portrait Card */}
        <div className="portrait-card">
          <div className="portrait-image-wrapper">
            <img
              src="/assets/pip_portrait.png"
              alt="Official studio portrait of Pip the Skull Baby wearing starry nightcap"
              className="portrait-img"
              loading="lazy"
            />
            <div className="portrait-corner-tag">Official Studio Portrait</div>
          </div>

          <div className="portrait-caption">
            <div className="portrait-status-row">
              <span className="status-indicator-live"></span>
              <strong className="portrait-name">Pip (They/Them)</strong>
            </div>
            <p className="portrait-quote">
              "Every big dream starts as a tiny sleepy whisper."
            </p>
            <div className="portrait-meta-chips">
              <span>Junior Engineer</span>
              <span>Nightcap Certified</span>
              <span>Cloud Pilot</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Dossier Grid */}
        <div className="dossier-cards-col">
          <div className="dossier-intro-box">
            <h3>A gentle perspective in a noisy world.</h3>
            <p>
              While other creatures scramble under the sunlight, Pip wakes up when twilight paints the sky in shades of plum and lavender. 
              Equipped with a star-stitched nightcap and a brass lantern, Pip's mission is simple: ensure that no child or forest critter feels alone in the dark.
            </p>
          </div>

          <div className="traits-grid">
            {traits.map((trait, idx) => (
              <div
                key={idx}
                className="trait-card"
                onClick={() => handleCardClick(trait)}
                title="Click for note"
              >
                <div className="trait-icon-bubble">
                  {trait.icon}
                </div>
                <div className="trait-info">
                  <span className="trait-label">{trait.label}</span>
                  <strong className="trait-value">{trait.value}</strong>
                  <span className="trait-detail">{trait.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Audio Bedtime Soundcheck Widget */}
          <div className="dossier-widget-box">
            <div className="widget-header">
              <Sparkles size={16} />
              <span>Pip's Nighttime Readiness Meter</span>
            </div>
            <div className="readiness-meter-bar">
              <div className="meter-fill" style={{ width: '92%' }}>
                <span>92% Cozy</span>
              </div>
            </div>
            <p className="readiness-note">
              ✧ Stardust tanks full · Pillows plumped · Nightcap securely tied with celestial cyan ribbon bow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
