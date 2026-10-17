import React, { useState } from 'react';
import { ArrowDown, Sparkles, Star, Moon, Heart, Volume2 } from 'lucide-react';
import { Pip3DCanvas } from './Pip3DCanvas';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

export function Hero() {
  const { theme } = useTheme();
  const { isMuted, setIsMuted, playChime, playTone, speakText, isSpeaking } = useAudio();
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

  const handlePipClick = () => {
    // Unmute if muted so the chime and Pip's voice are both heard
    if (isMuted) {
      setIsMuted(false);
    }
    playChime(659.25);

    const nextIndex = (currentQuoteIndex + 1) % pipQuotes.length;
    setCurrentQuoteIndex(nextIndex);
    setSpeechBubbleVisible(true);

    // Speak Pip's current text quote aloud
    speakText(pipQuotes[nextIndex]);
  };

  const handleReplayCurrent = (e) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
    }
    playChime(659.25);
    speakText(pipQuotes[currentQuoteIndex]);
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
      <div className="hero-container">
        {/* Left Column: Editorial Headlines & Badges */}
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
              className="btn btn-primary"
            >
              <span>Explore my dream projects</span>
              <ArrowDown size={16} />
            </a>
            <a
              href="#story"
              onClick={(e) => scrollToSection(e, 'story')}
              className="btn btn-secondary"
            >
              <span>Follow my story</span>
              <Sparkles size={16} />
            </a>
          </div>

          {/* Floating Specialty Badges */}
          <div className="hero-specialty-tags">
            <span className="specialty-badge">
              <Star size={11} /> Dream Engineer
            </span>
            <span className="specialty-badge">
              <Moon size={11} /> Bedtime Specialist
            </span>
            <span className="specialty-badge">
              <Heart size={11} /> Star Collector
            </span>
          </div>
        </div>

        {/* Right Column: Interactive 3D Pip Scene */}
        <div className="hero-canvas-col">
          {/* Interactive Speech Bubble */}
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

              <p className="speech-text">"{pipQuotes[currentQuoteIndex]}"</p>

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

          {/* 3D Canvas Scene */}
          <Pip3DCanvas isNight={isNight} onPipClick={handlePipClick} />

          <p className="canvas-instruction">
            <span>✧</span> Touch or move cursor to tilt Pip's dream observatory
          </p>
        </div>
      </div>
    </section>
  );
}
