import React, { useState, useEffect, useRef } from 'react';
import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  X,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  CloudRain,
  Radio,
  Music,
  Bug,
  Flame,
  Check
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const AMBIENT_TONES = [
  { id: 'amber', name: 'Moon Amber', glow: 'rgba(255, 179, 71, 0.22)', hex: '#ffb347' },
  { id: 'lavender', name: 'Lavender Mist', glow: 'rgba(168, 85, 247, 0.22)', hex: '#a855f7' },
  { id: 'starlight', name: 'Deep Starlight', glow: 'rgba(56, 189, 248, 0.22)', hex: '#38bdf8' },
  { id: 'candle', name: 'Candle Hearth', glow: 'rgba(249, 115, 22, 0.24)', hex: '#f97316' },
];

export function BedsideCompanion({ isOpen, onClose }) {
  const {
    isMuted,
    toggleMute,
    startASMRChannel,
    stopASMRChannel,
    setASMRChannelVolume,
    stopAllASMR,
    playChime,
    playTone,
  } = useAudio();

  const [ambientTone, setAmbientTone] = useState(AMBIENT_TONES[0]);
  const [dimLevel, setDimLevel] = useState(0); // 0 to 80% darkness
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ASMR Channels
  const [channels, setChannels] = useState({
    rain: { active: false, volume: 55 },
    crickets: { active: false, volume: 40 },
    brownNoise: { active: false, volume: 60 },
    musicBox: { active: false, volume: 45 },
  });

  // Sleep Timer
  const [timerPreset, setTimerPreset] = useState(0); // minutes (0 = off)
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerIntervalRef = useRef(null);

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle sleep timer countdown
  useEffect(() => {
    if (timerPreset > 0) {
      setSecondsRemaining(timerPreset * 60);
      setTimerFinished(false);
    } else {
      setSecondsRemaining(0);
      setTimerFinished(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [timerPreset]);

  useEffect(() => {
    if (secondsRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerFinished(true);
            stopAllASMR();
            setDimLevel(85);
            return 0;
          }
          // Dynamic dimming in the last 60 seconds
          if (prev <= 60) {
            setDimLevel((prevDim) => Math.min(85, prevDim + 0.3));
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [secondsRemaining > 0]);

  // Sync ASMR channels with mute state
  useEffect(() => {
    if (!isMuted) {
      Object.entries(channels).forEach(([key, ch]) => {
        if (ch.active) {
          startASMRChannel(key, ch.volume / 100);
        }
      });
    } else {
      stopAllASMR();
    }
  }, [isMuted]);

  // Channel toggle handler
  const handleToggleChannel = (channelKey) => {
    setChannels((prev) => {
      const nextActive = !prev[channelKey].active;
      if (nextActive) {
        startASMRChannel(channelKey, prev[channelKey].volume / 100);
      } else {
        stopASMRChannel(channelKey);
      }
      return {
        ...prev,
        [channelKey]: { ...prev[channelKey], active: nextActive },
      };
    });
  };

  const handleVolumeChange = (channelKey, newVol) => {
    const volNum = parseInt(newVol, 10);
    setChannels((prev) => ({
      ...prev,
      [channelKey]: { ...prev[channelKey], volume: volNum },
    }));
    setASMRChannelVolume(channelKey, volNum / 100);
  };

  const handleClose = () => {
    playTone(440, 0.15);
    onClose();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const formatRemaining = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="bedside-companion-overlay"
      style={{
        '--ambient-glow': ambientTone.glow,
        '--ambient-color': ambientTone.hex,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Pip's Bedside Nightlight Companion"
    >
      {/* Dimmer overlay layer */}
      <div
        className="bedside-dim-layer"
        style={{ opacity: dimLevel / 100 }}
        aria-hidden="true"
      />

      {/* Floating starry stardust particles */}
      <div className="bedside-stars-bg" aria-hidden="true">
        <div className="bedside-star star-1">✦</div>
        <div className="bedside-star star-2">★</div>
        <div className="bedside-star star-3">✧</div>
        <div className="bedside-star star-4">✦</div>
        <div className="bedside-star star-5">★</div>
      </div>

      <div className="bedside-container">
        {/* Top App Bar */}
        <div className="bedside-header">
          <div className="bedside-badge">
            <span className="bedside-pulse-dot" />
            <span>Bedside Slumber Mode · Midnight Nursery</span>
          </div>

          <div className="bedside-top-actions">
            <button
              onClick={toggleFullscreen}
              className="bedside-icon-btn"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={handleClose}
              className="bedside-icon-btn bedside-close-btn"
              title="Close Bedside Mode (Esc)"
              aria-label="Close Bedside Mode"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Centerpiece: Glowing Clock & Pip Avatar */}
        <div className="bedside-clock-hero">
          <div className="bedside-pip-sleeping-ring">
            <div className="pip-halo-glow" />
            <img
              src="/assets/pip_avatar_cloud.png"
              alt="Sleeping Pip on cloud"
              className={`bedside-pip-img ${timerFinished ? 'deep-sleep' : ''}`}
            />
            <div className="bedside-zzz-container">
              <span className="bedside-zzz z1">z</span>
              <span className="bedside-zzz z2">z</span>
              <span className="bedside-zzz z3">Z</span>
            </div>
          </div>

          <div className="bedside-time-display">
            <h1 className="bedside-clock-digits">{timeStr}</h1>
            <p className="bedside-date-label">{dateStr}</p>
          </div>

          {timerFinished ? (
            <div className="bedside-status-pill sleep-complete">
              <Sparkles size={14} />
              <span>Pip has tucked you in. Sweet dreams! ♡</span>
            </div>
          ) : (
            <div className="bedside-status-pill">
              <Moon size={14} />
              <span>
                {secondsRemaining > 0
                  ? `Sleep timer active · ${formatRemaining(secondsRemaining)} remaining`
                  : 'Breathe slowly. Safe starlight surrounds you.'}
              </span>
            </div>
          )}
        </div>

        {/* Controls Layout: 2 Columns */}
        <div className="bedside-controls-grid">
          {/* Card 1: ASMR Soundscape Mixer */}
          <div className="bedside-card">
            <div className="bedside-card-title">
              <Volume2 size={16} />
              <h3>Bedside ASMR Soundscape</h3>
              {isMuted && (
                <button
                  type="button"
                  onClick={toggleMute}
                  className="bedside-muted-warning"
                  title="Sound is muted. Click to turn on."
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  🔇 Muted (Click to enable sound)
                </button>
              )}
            </div>
            <p className="bedside-card-desc">
              Layer calming nocturnal frequencies synthesized natively in real-time.
            </p>

            <div className="asmr-channels-list">
              {/* Rain */}
              <div className={`asmr-channel-row ${channels.rain.active ? 'active' : ''}`}>
                <button
                  type="button"
                  className="asmr-toggle-btn"
                  onClick={() => handleToggleChannel('rain')}
                  aria-pressed={channels.rain.active}
                >
                  <CloudRain size={16} />
                  <span>Attic Rain</span>
                </button>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={channels.rain.volume}
                  onChange={(e) => handleVolumeChange('rain', e.target.value)}
                  disabled={!channels.rain.active}
                  className="asmr-slider"
                  aria-label="Rain volume"
                />
                <span className="asmr-vol-num">{channels.rain.volume}%</span>
              </div>

              {/* Crickets */}
              <div className={`asmr-channel-row ${channels.crickets.active ? 'active' : ''}`}>
                <button
                  type="button"
                  className="asmr-toggle-btn"
                  onClick={() => handleToggleChannel('crickets')}
                  aria-pressed={channels.crickets.active}
                >
                  <Bug size={16} />
                  <span>Night Crickets</span>
                </button>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={channels.crickets.volume}
                  onChange={(e) => handleVolumeChange('crickets', e.target.value)}
                  disabled={!channels.crickets.active}
                  className="asmr-slider"
                  aria-label="Crickets volume"
                />
                <span className="asmr-vol-num">{channels.crickets.volume}%</span>
              </div>

              {/* Brown Noise */}
              <div className={`asmr-channel-row ${channels.brownNoise.active ? 'active' : ''}`}>
                <button
                  type="button"
                  className="asmr-toggle-btn"
                  onClick={() => handleToggleChannel('brownNoise')}
                  aria-pressed={channels.brownNoise.active}
                >
                  <Radio size={16} />
                  <span>Cosmic Brown Noise</span>
                </button>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={channels.brownNoise.volume}
                  onChange={(e) => handleVolumeChange('brownNoise', e.target.value)}
                  disabled={!channels.brownNoise.active}
                  className="asmr-slider"
                  aria-label="Brown noise volume"
                />
                <span className="asmr-vol-num">{channels.brownNoise.volume}%</span>
              </div>

              {/* Music Box */}
              <div className={`asmr-channel-row ${channels.musicBox.active ? 'active' : ''}`}>
                <button
                  type="button"
                  className="asmr-toggle-btn"
                  onClick={() => handleToggleChannel('musicBox')}
                  aria-pressed={channels.musicBox.active}
                >
                  <Music size={16} />
                  <span>Music Box Chime</span>
                </button>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={channels.musicBox.volume}
                  onChange={(e) => handleVolumeChange('musicBox', e.target.value)}
                  disabled={!channels.musicBox.active}
                  className="asmr-slider"
                  aria-label="Music box volume"
                />
                <span className="asmr-vol-num">{channels.musicBox.volume}%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Ambient Nightlight & Sleep Timer */}
          <div className="bedside-card">
            <div className="bedside-card-title">
              <Flame size={16} />
              <h3>Bedside Nightlight & Sleep Timer</h3>
            </div>
            <p className="bedside-card-desc">
              Select your ambient bedroom halo tone and automated sleep fade-out.
            </p>

            {/* Ambient Tone Selector */}
            <div className="bedside-tone-selector">
              <label className="bedside-label">Ambient Halo Glow:</label>
              <div className="tone-chips-row">
                {AMBIENT_TONES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      setAmbientTone(tone);
                      playChime(587.33);
                    }}
                    className={`tone-chip ${ambientTone.id === tone.id ? 'selected' : ''}`}
                    style={{ '--chip-color': tone.hex }}
                  >
                    <span className="tone-color-dot" />
                    <span>{tone.name}</span>
                    {ambientTone.id === tone.id && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Dimmer Slider */}
            <div className="bedside-dim-control">
              <div className="dim-header">
                <label className="bedside-label">Room Screen Dimmer:</label>
                <span className="dim-pct">{dimLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={dimLevel}
                onChange={(e) => setDimLevel(parseInt(e.target.value, 10))}
                className="bedside-range"
                aria-label="Screen dimmer"
              />
            </div>

            {/* Sleep Timer Preset Chips */}
            <div className="bedside-timer-control">
              <label className="bedside-label">
                <Clock size={13} className="inline-icon" /> Automated Sleep Timer:
              </label>
              <div className="timer-chips-row">
                {[
                  { label: 'Off', val: 0 },
                  { label: '5 min', val: 5 },
                  { label: '15 min', val: 15 },
                  { label: '30 min', val: 30 },
                  { label: '45 min', val: 45 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => {
                      setTimerPreset(preset.val);
                      playChime(659.25);
                    }}
                    className={`timer-chip ${timerPreset === preset.val ? 'selected' : ''}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              {secondsRemaining > 0 && (
                <div className="timer-progress-bar-wrapper">
                  <div
                    className="timer-progress-fill"
                    style={{
                      width: `${(secondsRemaining / (timerPreset * 60)) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
