import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, X, Sparkles, Heart } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export function SecretDreamRoom() {
  const { playStarSparkle, playTone } = useAudio();
  const [clickCount, setClickCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const handleStarClick = (e) => {
    e.stopPropagation();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    // Audio chime rising in pitch
    playTone(440 + nextCount * 80, 0.2, 'sine', 0.1);

    if (nextCount >= 5) {
      setUnlocked(true);
      playStarSparkle();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#38bdf8', '#fbbf24', '#ffffff', '#6366f1', '#34d399']
      });
    }
  };

  const handleClose = () => {
    setUnlocked(false);
    setClickCount(0);
  };

  return (
    <>
      {/* Hidden Clickable Golden Star Widget */}
      <button
        onClick={handleStarClick}
        className="secret-star-trigger"
        title="A tiny twinkling star... does it hide something?"
        aria-label="Twinkling mystery star"
      >
        <Star
          size={18}
          className={`mystery-star-icon ${clickCount > 0 ? 'glowing-intense' : ''}`}
        />
        {clickCount > 0 && clickCount < 5 && (
          <span className="secret-click-counter">{clickCount}/5</span>
        )}
      </button>

      {/* Secret Dream Room Modal Dialog */}
      {unlocked && (
        <div className="secret-modal-overlay" onClick={handleClose} role="dialog" aria-modal="true">
          <div className="secret-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleClose}
              className="secret-close-btn"
              aria-label="Close secret dream room"
            >
              <X size={18} />
            </button>

            <div className="secret-badge">
              <Sparkles size={16} />
              <span>SECRET DREAM ROOM UNLOCKED</span>
            </div>

            <div className="secret-avatar-circle">
              <img
                src="/assets/pip_avatar_cloud.png"
                alt="Pip celebrating"
                className="secret-pip-img"
              />
            </div>

            <h3 className="secret-heading">You Found Pip's Secret Sanctuary!</h3>

            <blockquote className="secret-message">
              "You found my little secret. The universe is brighter because you're here. ♡"
            </blockquote>

            <p className="secret-subtext">
              Pip tucked this note behind the third star of the Big Dipper. 
              You now hold the honorary rank of <strong>Master Dream Engineer</strong> at the Midnight Nursery.
            </p>

            <div className="secret-footer-action">
              <button onClick={handleClose} className="btn btn-primary">
                <Heart size={16} />
                <span>Keep the Secret Warm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
