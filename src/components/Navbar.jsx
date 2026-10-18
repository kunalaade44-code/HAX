import React, { useState } from 'react';
import { Sun, Moon, Volume2, VolumeX, Sparkles, Menu, X, Compass, Feather } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

export function Navbar({ onOpenBedside, onOpenTelescope }) {
  const { theme, toggleTheme, chaosMode, toggleChaosMode } = useTheme();
  const { isMuted, toggleMute, playChime, playBoing } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    playChime(523.25);
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onSoundToggle = () => {
    toggleMute();
  };

  const onThemeToggle = () => {
    toggleTheme();
    playChime(659.25);
  };

  const onChaosToggle = () => {
    toggleChaosMode();
    playBoing();
  };

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main Navigation">
        {/* Brand wordmark with Pip emblem */}
        <a
          href="#top"
          className="nav-brand"
          onClick={(e) => handleNavClick(e, 'top')}
          aria-label="Pip's Midnight Dreamverse Home"
        >
          <img
            src="/assets/pip_avatar_cloud.png"
            alt="Pip Emblem"
            className="brand-avatar"
            width="36"
            height="36"
          />
          <div className="brand-text">
            <span className="brand-title">Pip's</span>
            <span className="brand-subname">Dreamverse</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-item">
            Meet Pip
          </a>
          <a href="#pillow-lab" onClick={(e) => handleNavClick(e, 'pillow-lab')} className="nav-item">
            Fluffiness Lab
          </a>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="nav-item">
            Dream Projects
          </a>
          <a href="#story" onClick={(e) => handleNavClick(e, 'story')} className="nav-item">
            Origin Story
          </a>
          <a href="#journal" onClick={(e) => handleNavClick(e, 'journal')} className="nav-item">
            Dream Journal
          </a>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Telescope Launcher Button (Desktop & Tablet) */}
          {onOpenTelescope && (
            <button
              onClick={() => {
                playChime(659.25);
                onOpenTelescope();
              }}
              className="action-btn action-btn-pill telescope-nav-btn desktop-only"
              title="Open Celestial Telescope Observatory"
              aria-label="Open Celestial Telescope"
            >
              <Compass size={14} />
              <span className="btn-label">Telescope</span>
            </button>
          )}

          {/* Bedside Mode Launcher Button (Desktop & Tablet) */}
          {onOpenBedside && (
            <button
              onClick={() => {
                playChime(587.33);
                onOpenBedside();
              }}
              className="action-btn action-btn-pill bedside-nav-btn desktop-only"
              title="Launch Bedside Nightlight Companion & ASMR Soundscapes"
              aria-label="Bedside Nightlight Mode"
            >
              <Moon size={14} />
              <span className="btn-label">Bedside</span>
            </button>
          )}

          {/* Chaos Mode Toggle (Desktop & Tablet) */}
          <button
            onClick={onChaosToggle}
            className={`action-btn action-btn-text chaos-btn desktop-only ${chaosMode ? 'active' : ''}`}
            title={chaosMode ? 'Chaos Mode Active! Click to calm down' : 'Activate Playful Chaos Mode (+5 bonus!)'}
            aria-label="Toggle Chaos Mode"
          >
            <span className="btn-label">
              {chaosMode ? 'Chaos ON' : 'Chaos'}
            </span>
          </button>

          {/* Sound / Mute Toggle (Always visible) */}
          <button
            onClick={onSoundToggle}
            className={`action-btn action-btn-text sound-btn ${!isMuted ? 'active' : ''}`}
            title={isMuted ? 'Sound is currently muted (Click to unmute)' : 'Sound is on (Click to mute)'}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            <span className="btn-label">
              {isMuted ? 'Muted' : 'Sound'}
            </span>
          </button>

          {/* Day / Night Theme Toggle (Always visible) */}
          <button
            onClick={onThemeToggle}
            className="action-btn action-btn-text theme-btn"
            title={`Switch to ${theme === 'day' ? 'Night' : 'Day'} theme`}
            aria-label={`Switch to ${theme === 'day' ? 'Night' : 'Day'} mode`}
          >
            <span className="btn-label">
              {theme === 'day' ? 'Night' : 'Day'}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="action-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-menu-drawer" role="menu">
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-heading">Pip's Dream Portal</span>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-nav-group">
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="mobile-nav-item">
                <span>Meet Pip</span>
                <span className="mobile-nav-arrow">✦</span>
              </a>
              <a href="#pillow-lab" onClick={(e) => handleNavClick(e, 'pillow-lab')} className="mobile-nav-item">
                <span>Fluffiness Lab</span>
                <span className="mobile-nav-badge">Softness Lab</span>
              </a>
              <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="mobile-nav-item">
                <span>Dream Projects</span>
                <span className="mobile-nav-arrow">✦</span>
              </a>
              <a href="#story" onClick={(e) => handleNavClick(e, 'story')} className="mobile-nav-item">
                <span>Origin Story</span>
                <span className="mobile-nav-arrow">✦</span>
              </a>
              <a href="#journal" onClick={(e) => handleNavClick(e, 'journal')} className="mobile-nav-item">
                <span>Dream Journal &amp; Alchemy</span>
                <span className="mobile-nav-arrow">✦</span>
              </a>
            </div>

            <div className="mobile-drawer-divider" />

            <div className="mobile-features-group">
              <span className="mobile-drawer-subheading">Night Nursery Experiences</span>

              {onOpenTelescope && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTelescope();
                  }}
                  className="mobile-feature-card telescope-card"
                >
                  <div className="mobile-feature-icon">🔭</div>
                  <div className="mobile-feature-info">
                    <strong>Celestial Telescope</strong>
                    <span>Chart constellations &amp; play star harp</span>
                  </div>
                  <span className="mobile-feature-badge">Launch</span>
                </button>
              )}

              {onOpenBedside && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBedside();
                  }}
                  className="mobile-feature-card bedside-card"
                >
                  <div className="mobile-feature-icon">🌙</div>
                  <div className="mobile-feature-info">
                    <strong>Bedside Companion</strong>
                    <span>Warm nightlight &amp; ASMR soundscapes</span>
                  </div>
                  <span className="mobile-feature-badge">Open</span>
                </button>
              )}

              <button
                type="button"
                onClick={onChaosToggle}
                className={`mobile-feature-card chaos-card ${chaosMode ? 'active' : ''}`}
              >
                <div className="mobile-feature-icon">✨</div>
                <div className="mobile-feature-info">
                  <strong>Playful Chaos Mode</strong>
                  <span>{chaosMode ? 'Chaos is active! Tap to calm' : 'Tap for playful stickers & sparkles'}</span>
                </div>
                <span className={`mobile-feature-badge ${chaosMode ? 'badge-amber' : ''}`}>
                  {chaosMode ? 'Active' : 'Toggle'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
