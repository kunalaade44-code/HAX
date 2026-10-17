import React, { useState } from 'react';
import { Sun, Moon, Volume2, VolumeX, Sparkles, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

export function Navbar() {
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
            <span className="brand-title">Pip's Dreamverse</span>
            <span className="brand-subtitle">Midnight Nursery · Staff No. 001</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-item">
            Meet Pip
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
          {/* Chaos Mode Toggle */}
          <button
            onClick={onChaosToggle}
            className={`action-btn chaos-btn ${chaosMode ? 'active' : ''}`}
            title={chaosMode ? 'Chaos Mode Active! Click to calm down' : 'Activate Playful Chaos Mode (+5 bonus!)'}
            aria-label="Toggle Chaos Mode"
          >
            <Sparkles size={16} />
            <span className="btn-label desktop-only">
              {chaosMode ? 'Chaos ON' : 'Chaos'}
            </span>
          </button>

          {/* Sound / Mute Toggle */}
          <button
            onClick={onSoundToggle}
            className={`action-btn sound-btn ${!isMuted ? 'active' : ''}`}
            title={isMuted ? 'Sound is currently muted (Click to unmute)' : 'Sound is on (Click to mute)'}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span className="btn-label desktop-only">
              {isMuted ? 'Muted' : 'Sound'}
            </span>
          </button>

          {/* Day / Night Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="action-btn theme-btn"
            title={`Switch to ${theme === 'day' ? 'Night' : 'Day'} theme`}
            aria-label={`Switch to ${theme === 'day' ? 'Night' : 'Day'} mode`}
          >
            {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
            <span className="btn-label desktop-only">
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
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="mobile-nav-item">
              <span>Meet Pip</span>
              <span className="mobile-nav-arrow">✦</span>
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
              <span>Dream Journal</span>
              <span className="mobile-nav-arrow">✦</span>
            </a>
          </div>
        </>
      )}
    </header>
  );
}
