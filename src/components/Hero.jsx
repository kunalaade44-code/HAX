import React, { useState } from 'react';
import { ArrowDown, Sparkles, Star, Moon, Heart, Volume2, Feather } from 'lucide-react';
import { Pip3DCanvas } from './Pip3DCanvas';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

const LANTERN_COLORS = [
  { name: 'Amber Gold', hex: '#f59e0b', lampHex: '#ff9e3b' },
  { name: 'Moonbeam Cyan', hex: '#38bdf8', lampHex: '#0ea5e9' },
  { name: 'Lavender Dream', hex: '#c084fc', lampHex: '#a855f7' },
  { name: 'Candle Hearth', hex: '#fb923c', lampHex: '#f97316' },
  { name: 'Emerald Aurora', hex: '#34d399', lampHex: '#10b981' },
];

export function Hero({ onOpenBedside, onOpenTelescope }) {
  const { theme } = useTheme();
  const { isMuted, playChime, playTone, playPipPurr, playPillowSquish, speakText, isSpeaking } = useAudio();
  const isNight = theme === 'night';

  const pipQuotes = [
    "Oh! You found me.",
    "I was just testing a cloud pillow.",
    "Do you think stars get sleepy too?",
    "Psst... the moon has a secret.",
    "Yaaawn... 5 more minutes of dream testing...",
    "Warm blankets make the best ideas. ♡"
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [speechBubbleVisible, setSpeechBubbleVisible] = useState(true);
  const [customQuoteText, setCustomQuoteText] = useState(null);
  const [hasBlanket, setHasBlanket] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [petCount, setPetCount] = useState(0);
  const [lanternColorIdx, setLanternColorIdx] = useState(0);

  const handlePipClick = () => {
    playChime(659.25);
    setCustomQuoteText(null);

    const nextIndex = (currentQuoteIndex + 1) % pipQuotes.length;
    setCurrentQuoteIndex(nextIndex);
    setSpeechBubbleVisible(true);

    speakText(pipQuotes[nextIndex]);
  };

  const handlePetPip = (e) => {
    if (e) e.stopPropagation();
    playPipPurr();
    setIsPetted(true);
    setPetCount((prev) => prev + 1);
    setTimeout(() => setIsPetted(false), 1400);

    const petResponses = [
      "Purrr... that warms my heart right up! ♡",
      "Soft cuddles make the sweetest dreams! ♡",
      "*happy skull baby purr*... Pip feels so loved! ♡",
      "Warm hugs for the best dream companion! ♡",
    ];
    const quote = petResponses[petCount % petResponses.length];
    setCustomQuoteText(quote);
    setSpeechBubbleVisible(true);
    speakText(quote);
  };

  const handleToggleBlanket = (e) => {
    if (e) e.stopPropagation();
    playChime(587.33);
    const nextBlanket = !hasBlanket;
    setHasBlanket(nextBlanket);
    setCustomQuoteText(
      nextBlanket
        ? "Tucked in nice and snug with star embroidery! ♡"
        : "Blanket untucked. Ready for night nursery exploration!"
    );
    setSpeechBubbleVisible(true);
    speakText(
      nextBlanket
        ? "Tucked in nice and snug with star embroidery! Sweet dreams!"
        : "Blanket untucked. Ready for night nursery exploration!"
    );
  };

  const handleCycleLantern = (e) => {
    if (e) e.stopPropagation();
    playTone(587.33, 0.25);
    const nextIdx = (lanternColorIdx + 1) % LANTERN_COLORS.length;
    setLanternColorIdx(nextIdx);
    const chosen = LANTERN_COLORS[nextIdx];
    setCustomQuoteText(`The Moon & Lantern are glowing in ${chosen.name}! ✦`);
    setSpeechBubbleVisible(true);
    speakText(`Illuminating the moon and lantern in ${chosen.name}!`);
  };

  const handleFluffinessClick = (e) => {
    e.preventDefault();
    playPillowSquish();
    setCustomQuoteText("✦ Pip suggests: 'Try testing the Stardust Memory Foam or Cloud Puff tonight for maximum softness!'");
    setSpeechBubbleVisible(true);
    speakText("Pillow testing time! Pip suggests checking the Stardust Memory Foam for sweet dreams!");

    const el = document.getElementById('pillow-lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplayCurrent = (e) => {
    e.stopPropagation();
    playChime(659.25);
    speakText(customQuoteText || pipQuotes[currentQuoteIndex]);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    playTone(523.25, 0.2);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="top">
      {/* Layer 0: Full-Bleed 3D Scene Background */}
      <div className="hero-3d-backdrop" aria-hidden="false">
        <Pip3DCanvas
          isNight={isNight}
          onPipClick={handlePipClick}
          hasBlanket={hasBlanket}
          isPetted={isPetted}
          activeColor={LANTERN_COLORS[lanternColorIdx].hex}
          lampColor={LANTERN_COLORS[lanternColorIdx].lampHex || LANTERN_COLORS[lanternColorIdx].hex}
          onCycleColor={handleCycleLantern}
        />
      </div>

      {/* Layer 1: Foreground Content Container */}
      <div className="hero-container">
        {/* Left Column: Headlines & CTA Buttons */}
        <div className="hero-text-col">
          <div className="hero-status-pill">
            <span className="pulsing-amber-dot"></span>
            <span className="status-label">Currently awake-ish · Accepting dream requests</span>
          </div>

          <span className="hero-eyebrow">
            <Star size={12} className="inline-star" />
            MIDNIGHT NURSERY · STAFF NO. 001
          </span>

          <h1 className="hero-headline">
            Small baby.<br />
            <em>Big dreams.</em>
          </h1>

          <p className="hero-supporting">
            Hello, sleepyhead! I'm <strong>Pip</strong>, a Junior Dream Engineer at the Midnight Nursery.
            I craft tiny dreams, sleepy songs, and comforting little nightlights for everyone who needs a peaceful slumber.
          </p>

          <div className="hero-cta-group">
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className="btn btn-primary hero-btn hero-primary-btn"
            >
              <span>Explore my dream projects</span>
              <ArrowDown size={16} />
            </a>
            <a
              href="#pillow-lab"
              onClick={handleFluffinessClick}
              className="btn btn-secondary hero-btn hero-secondary-btn"
              title="Click for Pip's Pillow Suggestions & Fluffiness Lab"
            >
              <span>Fluffiness Lab</span>
              <Feather size={16} />
            </a>
          </div>
        </div>

        {/* Right Column: Overlay containing Speech Bubble above Pip & Care Buttons below Pip */}
        <div className="hero-right-overlay">
          {/* Interactive Speech Bubble directly above Pip */}
          {speechBubbleVisible && (
            <div
              className={`pip-speech-bubble ${isSpeaking ? 'speaking-active' : ''}`}
              onClick={handlePipClick}
              title="Click Pip or bubble to hear the next whisper!"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handlePipClick();
              }}
            >
              <div className="speech-bubble-top">
                <span className="speech-avatar-dot">✦ Pip whispers:</span>
                <button
                  type="button"
                  className="speech-listen-again-btn"
                  onClick={handleReplayCurrent}
                  title="Listen to Pip say this again"
                  aria-label="Listen again"
                >
                  <Volume2 size={12} className={isSpeaking ? 'speaking-pulse-icon' : ''} />
                  <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                </button>
              </div>

              <p className="speech-text">"{customQuoteText || pipQuotes[currentQuoteIndex]}"</p>

              <div className="speech-bubble-footer">
                <span className="speech-hint-label">
                  {isSpeaking ? '✧ Speaking bedtime thought...' : 'Click Pip or bubble to chat'}
                </span>
                <span className="speech-counter">
                  {currentQuoteIndex + 1}/{pipQuotes.length}
                </span>
              </div>
            </div>
          )}

          {/* Transparent Hitbox directly over Pip */}
          <div
            className="pip-character-hitbox"
            onClick={handlePipClick}
            title="Click Pip to greet him!"
            aria-label="Click Pip to chat"
          />

          {/* Pip 3D Care Action Bar (Pet, Blanket, Moon/Lantern) */}
          <div
            className="pip-interaction-bar"
            aria-label="Pip 3D Care Actions"
            style={{
              filter: `drop-shadow(0 10px 24px ${LANTERN_COLORS[lanternColorIdx].hex}44)`,
              transition: 'filter 0.4s ease',
            }}
          >
            <button
              type="button"
              onClick={handlePetPip}
              className={`pip-care-btn ${isPetted ? 'active-pet' : ''}`}
              title="Pet Pip on the head (Squishes & Purrs!)"
            >
              <Heart size={14} className={`pet-icon ${isPetted ? 'pet-pulse' : ''}`} />
              <span>{isPetted ? 'Purrr! ♡' : petCount > 0 ? `Pet Pip (${petCount})` : 'Pet Pip'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleBlanket}
              className={`pip-care-btn ${hasBlanket ? 'active-tuck' : ''}`}
              title="Tuck Pip in with an embroidered starlight blanket"
            >
              <Sparkles size={14} className={hasBlanket ? 'sparkle-active' : ''} />
              <span>{hasBlanket ? 'Tucked In ♡' : 'Tuck Blanket'}</span>
            </button>

            <button
              type="button"
              onClick={handleCycleLantern}
              className="pip-care-btn lantern-care-btn"
              style={{
                borderColor: LANTERN_COLORS[lanternColorIdx].hex + '99',
                boxShadow: `0 4px 18px ${LANTERN_COLORS[lanternColorIdx].hex}33`,
              }}
              title="Cycle bedside hanging lantern and moon balloon glow color"
            >
              <span
                className="lantern-dot-preview"
                style={{
                  backgroundColor: LANTERN_COLORS[lanternColorIdx].hex,
                  boxShadow: `0 0 10px ${LANTERN_COLORS[lanternColorIdx].hex}`,
                }}
              />
              <span>Moon &amp; Lantern ({LANTERN_COLORS[lanternColorIdx].name})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom-Left Dream Star Button as seen in reference */}
      <button
        type="button"
        className="hero-star-fab"
        onClick={() => playChime(784)}
        title="Pip's Dream Starlight Blessing"
        aria-label="Dream Star"
      >
        <Star size={18} className="hero-star-fab-icon" />
      </button>
    </section>
  );
}
