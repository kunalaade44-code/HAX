import React, { useState, useEffect } from 'react';
import { ArrowUp, Heart, Star, Sparkles, Moon } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export function Footer() {
  const { playChime } = useAudio();

  // Retro Odometer Visitor Counter (Local/Session based)
  const [visitorCount, setVisitorCount] = useState(() => {
    const stored = localStorage.getItem('pip-visitor-count');
    const base = stored ? parseInt(stored, 10) : 1420;
    const nextCount = base + 1;
    localStorage.setItem('pip-visitor-count', nextCount.toString());
    return nextCount;
  });

  const scrollToTop = () => {
    playChime(523.25);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format count into 6 digits [0][0][1][4][2][1]
  const countDigits = visitorCount.toString().padStart(6, '0').split('');

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Row: Wordmark, Closing Quote, and Back-to-Top */}
        <div className="footer-top-row">
          <div className="footer-brand">
            <img
              src="/assets/pip_avatar_cloud.png"
              alt="Pip the Skull Baby Emblem"
              className="footer-avatar"
              width="44"
              height="44"
            />
            <div>
              <span className="footer-title">Pip's Midnight Dreamverse</span>
              <p className="footer-closing-quote">
                "Every little star has a dream. Sweet dreams from Pip. ♡"
              </p>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="footer-back-to-top"
            aria-label="Scroll back to top"
            title="Float back to the stars"
          >
            <span>Back to the stars</span>
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Middle Row: Links & Odometer */}
        <div className="footer-middle-row">
          <div className="footer-nav-col">
            <span className="footer-heading">Dream Navigation</span>
            <ul className="footer-links-list">
              <li><a href="#top">Hero Observatory</a></li>
              <li><a href="#about">Meet Pip (Dossier)</a></li>
              <li><a href="#projects">Dream Projects</a></li>
              <li><a href="#story">Origin Story</a></li>
              <li><a href="#journal">Dream Journal</a></li>
            </ul>
          </div>

          <div className="footer-credits-col">
            <span className="footer-heading">Hackathon Track 1 Credits</span>
            <p className="credits-text">
              Built for <strong>haX.baby — Baby's First Website Hackathon</strong>.<br />
              Character canon &amp; official artwork by <strong>haX.baby</strong>.<br />
              Audio synthesized natively via the <strong>Web Audio API</strong>.
            </p>
          </div>

          <div className="footer-odometer-col">
            <span className="footer-heading">Bedtime Visitor Counter</span>
            <div className="odometer-box" title="Local session dream counter">
              {countDigits.map((digit, idx) => (
                <span key={idx} className="odometer-digit">{digit}</span>
              ))}
            </div>
            <span className="odometer-disclaimer">
              ✦ Nocturnal Dreamers Welcomed (Device Log)
            </span>
          </div>
        </div>

        {/* Bottom Row: Copyright & Warm Goodbye */}
        <div className="footer-bottom-row">
          <span>© 2026 Pip's Midnight Dreamverse · Handcrafted with Stardust</span>
          <span>Made for Track 1 · Sleep gently tonight</span>
        </div>
      </div>
    </footer>
  );
}
