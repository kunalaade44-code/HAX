import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Music, Volume2, Sparkles, RefreshCw, Disc } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export function LullabyLab() {
  const { isMuted, setIsMuted, playMusicBoxChime, stopAllSounds } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [selectedTempo, setSelectedTempo] = useState('dreamy'); // 'sleepy' | 'dreamy' | 'gentle'
  const intervalRef = useRef(null);

  // 3 Distinct, Enchanting, High-Quality Music Box Compositions:
  const melodies = {
    sleepy: {
      id: 'sleepy',
      title: 'The Starlight Lullaby',
      subtitle: 'Tender Brahms lullaby with peaceful deep bass chimes',
      speedMs: 640,
      icon: '🌙',
      notes: [
        { lead: { note: 'E4', freq: 329.63, dur: 0.9 }, bass: { freq: 130.81, dur: 1.5 }, desc: 'E4 (C root)' },
        { lead: { note: 'E4', freq: 329.63, dur: 0.8 }, desc: 'E4' },
        { lead: { note: 'G4', freq: 392.00, dur: 1.3 }, bass: { freq: 196.00, dur: 1.5 }, desc: 'G4 (G root)' },
        { lead: { note: 'E4', freq: 329.63, dur: 0.9 }, bass: { freq: 130.81, dur: 1.5 }, desc: 'E4 (C root)' },
        { lead: { note: 'E4', freq: 329.63, dur: 0.8 }, desc: 'E4' },
        { lead: { note: 'G4', freq: 392.00, dur: 1.3 }, bass: { freq: 196.00, dur: 1.5 }, desc: 'G4 (G root)' },
        { lead: { note: 'E4', freq: 329.63, dur: 0.7 }, bass: { freq: 130.81, dur: 1.2 }, desc: 'E4' },
        { lead: { note: 'G4', freq: 392.00, dur: 0.7 }, harmony: { freq: 261.63, dur: 1.2 }, desc: 'G4 & C4' },
        { lead: { note: 'C5', freq: 523.25, dur: 1.4 }, bass: { freq: 220.00, dur: 1.6 }, desc: 'C5 (Am root)' },
        { lead: { note: 'B4', freq: 493.88, dur: 0.7 }, desc: 'B4' },
        { lead: { note: 'A4', freq: 440.00, dur: 0.7 }, bass: { freq: 174.61, dur: 1.4 }, desc: 'A4 (F root)' },
        { lead: { note: 'A4', freq: 440.00, dur: 0.7 }, desc: 'A4' },
        { lead: { note: 'G4', freq: 392.00, dur: 1.4 }, bass: { freq: 130.81, dur: 1.6 }, desc: 'G4 (C root)' },
        { lead: { note: 'D4', freq: 293.66, dur: 0.7 }, bass: { freq: 196.00, dur: 1.4 }, desc: 'D4 (G root)' },
        { lead: { note: 'E4', freq: 329.63, dur: 0.7 }, desc: 'E4' },
        { lead: { note: 'F4', freq: 349.23, dur: 1.2 }, bass: { freq: 146.83, dur: 1.4 }, desc: 'F4 (D root)' },
        { lead: { note: 'D4', freq: 293.66, dur: 0.7 }, bass: { freq: 196.00, dur: 1.4 }, desc: 'D4' },
        { lead: { note: 'E4', freq: 329.63, dur: 0.7 }, desc: 'E4' },
        { lead: { note: 'F4', freq: 349.23, dur: 1.2 }, bass: { freq: 196.00, dur: 1.4 }, desc: 'F4 (G root)' },
        { lead: { note: 'D4', freq: 293.66, dur: 0.7 }, desc: 'D4' },
        { lead: { note: 'F4', freq: 349.23, dur: 0.7 }, bass: { freq: 246.94, dur: 1.2 }, desc: 'F4' },
        { lead: { note: 'B4', freq: 493.88, dur: 1.2 }, bass: { freq: 196.00, dur: 1.4 }, desc: 'B4 (G root)' },
        { lead: { note: 'A4', freq: 440.00, dur: 0.7 }, bass: { freq: 174.61, dur: 1.4 }, desc: 'A4 (F root)' },
        { lead: { note: 'G4', freq: 392.00, dur: 1.1 }, bass: { freq: 164.81, dur: 1.4 }, desc: 'G4 (Em root)' },
        { lead: { note: 'B4', freq: 493.88, dur: 0.7 }, desc: 'B4' },
        { lead: { note: 'C5', freq: 523.25, dur: 2.0 }, bass: { freq: 130.81, dur: 2.4 }, harmony: { freq: 261.63, dur: 2.0 }, desc: 'C5 (Lullaby Chimes)' },
      ]
    },
    dreamy: {
      id: 'dreamy',
      title: "Pip's Celestial Carousel",
      subtitle: 'Enchanting Canon & Studio Ghibli melody with lush harmonies',
      speedMs: 440,
      icon: '🎠',
      notes: [
        { lead: { note: 'E5', freq: 659.25, dur: 0.8 }, harmony: { freq: 392.00, dur: 0.7 }, bass: { freq: 130.81, dur: 1.2 }, desc: 'E5 (C Major)' },
        { lead: { note: 'G5', freq: 783.99, dur: 0.6 }, harmony: { freq: 523.25, dur: 0.6 }, desc: 'G5' },
        { lead: { note: 'D5', freq: 587.33, dur: 0.8 }, harmony: { freq: 349.23, dur: 0.7 }, bass: { freq: 196.00, dur: 1.2 }, desc: 'D5 (G Major)' },
        { lead: { note: 'G5', freq: 783.99, dur: 0.6 }, harmony: { freq: 392.00, dur: 0.6 }, desc: 'G5' },
        { lead: { note: 'C5', freq: 523.25, dur: 0.8 }, harmony: { freq: 440.00, dur: 0.7 }, bass: { freq: 220.00, dur: 1.2 }, desc: 'C5 (A Minor)' },
        { lead: { note: 'E5', freq: 659.25, dur: 0.6 }, harmony: { freq: 261.63, dur: 0.6 }, desc: 'E5' },
        { lead: { note: 'B4', freq: 493.88, dur: 0.8 }, harmony: { freq: 329.63, dur: 0.7 }, bass: { freq: 164.81, dur: 1.2 }, desc: 'B4 (E Minor)' },
        { lead: { note: 'E5', freq: 659.25, dur: 0.6 }, harmony: { freq: 392.00, dur: 0.6 }, desc: 'E5' },
        { lead: { note: 'A4', freq: 440.00, dur: 0.8 }, harmony: { freq: 349.23, dur: 0.7 }, bass: { freq: 174.61, dur: 1.2 }, desc: 'A4 (F Major)' },
        { lead: { note: 'C5', freq: 523.25, dur: 0.6 }, harmony: { freq: 261.63, dur: 0.6 }, desc: 'C5' },
        { lead: { note: 'G4', freq: 392.00, dur: 0.8 }, harmony: { freq: 329.63, dur: 0.7 }, bass: { freq: 130.81, dur: 1.2 }, desc: 'G4 (C Major)' },
        { lead: { note: 'C5', freq: 523.25, dur: 0.6 }, harmony: { freq: 261.63, dur: 0.6 }, desc: 'C5' },
        { lead: { note: 'F4', freq: 349.23, dur: 0.8 }, harmony: { freq: 261.63, dur: 0.7 }, bass: { freq: 174.61, dur: 1.2 }, desc: 'F4 (F Major)' },
        { lead: { note: 'A4', freq: 440.00, dur: 0.6 }, harmony: { freq: 349.23, dur: 0.6 }, desc: 'A4' },
        { lead: { note: 'G4', freq: 392.00, dur: 0.8 }, harmony: { freq: 293.66, dur: 0.7 }, bass: { freq: 196.00, dur: 1.2 }, desc: 'G4 (G Major)' },
        { lead: { note: 'B4', freq: 493.88, dur: 0.6 }, harmony: { freq: 392.00, dur: 0.6 }, desc: 'B4' },
        { lead: { note: 'C6', freq: 1046.50, dur: 0.9 }, harmony: { freq: 523.25, dur: 0.8 }, bass: { freq: 130.81, dur: 1.4 }, desc: 'C6 (Starlight)' },
        { lead: { note: 'B5', freq: 987.77, dur: 0.6 }, harmony: { freq: 659.25, dur: 0.6 }, desc: 'B5' },
        { lead: { note: 'A5', freq: 880.00, dur: 0.8 }, harmony: { freq: 440.00, dur: 0.7 }, bass: { freq: 174.61, dur: 1.2 }, desc: 'A5' },
        { lead: { note: 'G5', freq: 783.99, dur: 0.6 }, harmony: { freq: 523.25, dur: 0.6 }, desc: 'G5' },
        { lead: { note: 'F5', freq: 698.46, dur: 0.8 }, harmony: { freq: 349.23, dur: 0.7 }, bass: { freq: 174.61, dur: 1.2 }, desc: 'F5' },
        { lead: { note: 'E5', freq: 659.25, dur: 0.6 }, harmony: { freq: 392.00, dur: 0.6 }, desc: 'E5' },
        { lead: { note: 'D5', freq: 587.33, dur: 0.8 }, harmony: { freq: 293.66, dur: 0.7 }, bass: { freq: 196.00, dur: 1.2 }, desc: 'D5' },
        { lead: { note: 'G5', freq: 783.99, dur: 0.6 }, harmony: { freq: 493.88, dur: 0.6 }, desc: 'G5' },
        { lead: { note: 'C5', freq: 523.25, dur: 1.8 }, harmony: { freq: 659.25, dur: 1.8 }, bass: { freq: 130.81, dur: 2.2 }, desc: 'C5 (Harmonic Bell)' },
      ]
    },
    gentle: {
      id: 'gentle',
      title: 'Dancing Stardust',
      subtitle: 'Joyful, bright music box waltz that makes hearts smile',
      speedMs: 310,
      icon: '✨',
      notes: [
        { lead: { note: 'C5', freq: 523.25, dur: 0.5 }, bass: { freq: 130.81, dur: 0.8 }, desc: 'C5 (Spark)' },
        { lead: { note: 'E5', freq: 659.25, dur: 0.4 }, harmony: { freq: 392.00, dur: 0.4 }, desc: 'E5' },
        { lead: { note: 'G5', freq: 783.99, dur: 0.5 }, desc: 'G5' },
        { lead: { note: 'C6', freq: 1046.50, dur: 0.7 }, bass: { freq: 261.63, dur: 0.9 }, desc: 'C6 (Star)' },
        { lead: { note: 'B5', freq: 987.77, dur: 0.4 }, desc: 'B5' },
        { lead: { note: 'A5', freq: 880.00, dur: 0.6 }, bass: { freq: 174.61, dur: 0.9 }, desc: 'A5 (Glow)' },
        { lead: { note: 'F5', freq: 698.46, dur: 0.4 }, harmony: { freq: 523.25, dur: 0.4 }, desc: 'F5' },
        { lead: { note: 'A5', freq: 880.00, dur: 0.5 }, desc: 'A5' },
        { lead: { note: 'G5', freq: 783.99, dur: 0.7 }, bass: { freq: 196.00, dur: 0.9 }, desc: 'G5 (Breeze)' },
        { lead: { note: 'E5', freq: 659.25, dur: 0.4 }, harmony: { freq: 493.88, dur: 0.4 }, desc: 'E5' },
        { lead: { note: 'C5', freq: 523.25, dur: 0.5 }, desc: 'C5' },
        { lead: { note: 'D5', freq: 587.33, dur: 0.6 }, bass: { freq: 196.00, dur: 0.9 }, desc: 'D5 (Play)' },
        { lead: { note: 'F5', freq: 698.46, dur: 0.4 }, desc: 'F5' },
        { lead: { note: 'B5', freq: 987.77, dur: 0.6 }, harmony: { freq: 587.33, dur: 0.6 }, desc: 'B5' },
        { lead: { note: 'C6', freq: 1046.50, dur: 0.8 }, bass: { freq: 130.81, dur: 1.0 }, desc: 'C6 (Twinkle)' },
        { lead: { note: 'G5', freq: 783.99, dur: 0.4 }, desc: 'G5' },
        { lead: { note: 'E5', freq: 659.25, dur: 0.5 }, desc: 'E5' },
        { lead: { note: 'D5', freq: 587.33, dur: 0.5 }, bass: { freq: 196.00, dur: 0.8 }, desc: 'D5' },
        { lead: { note: 'B4', freq: 493.88, dur: 0.4 }, desc: 'B4' },
        { lead: { note: 'C5', freq: 523.25, dur: 1.4 }, bass: { freq: 130.81, dur: 1.8 }, harmony: { freq: 659.25, dur: 1.4 }, desc: 'C5 (Waltz Finish)' },
      ]
    }
  };

  const currentMelody = melodies[selectedTempo] || melodies.dreamy;

  // Interactive chime keys (C4 through D5)
  const chimeKeys = [
    { label: 'C4', freq: 261.63, name: 'Cloud' },
    { label: 'D4', freq: 293.66, name: 'Dew' },
    { label: 'E4', freq: 329.63, name: 'Evening' },
    { label: 'G4', freq: 392.00, name: 'Glimmer' },
    { label: 'A4', freq: 440.00, name: 'Amber' },
    { label: 'B4', freq: 493.88, name: 'Bedtime' },
    { label: 'C5', freq: 523.25, name: 'Celestial' },
    { label: 'D5', freq: 587.33, name: 'Dream' },
  ];

  const handleStartLullaby = (tempoKey = selectedTempo) => {
    handleStopLullaby();

    if (isMuted) {
      setIsMuted(false);
    }

    const melody = melodies[tempoKey] || melodies.dreamy;
    setIsPlaying(true);
    let step = 0;

    const tick = () => {
      const noteData = melody.notes[step];
      if (!noteData) return;

      setActiveStep(step);

      // 1. Play Lead Melody Note
      if (noteData.lead) {
        playMusicBoxChime(noteData.lead.freq, {
          duration: noteData.lead.dur || 1.2,
          volume: 0.15,
          overtone: true,
        });
      }

      // 2. Play Harmony Counter-Melody Note with gentle micro-offset
      if (noteData.harmony) {
        setTimeout(() => {
          playMusicBoxChime(noteData.harmony.freq, {
            duration: noteData.harmony.dur || 1.0,
            volume: 0.08,
            overtone: true,
          });
        }, 30);
      }

      // 3. Play Warm Bass Chime Note
      if (noteData.bass) {
        playMusicBoxChime(noteData.bass.freq, {
          duration: noteData.bass.dur || 1.6,
          volume: 0.11,
          type: 'triangle',
          overtone: false,
        });
      }

      step++;
      if (step >= melody.notes.length) {
        step = 0;
      }
    };

    // Play initial note immediately
    tick();
    intervalRef.current = setInterval(tick, melody.speedMs);
  };

  const handleStopLullaby = () => {
    setIsPlaying(false);
    setActiveStep(-1);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopAllSounds();
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handleStopLullaby();
    } else {
      handleStartLullaby(selectedTempo);
    }
  };

  const handleTempoSelect = (newTempo) => {
    setSelectedTempo(newTempo);
    if (isPlaying) {
      handleStartLullaby(newTempo);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleKeyClick = (freq) => {
    if (isMuted) {
      setIsMuted(false);
    }
    playMusicBoxChime(freq, { duration: 1.4, volume: 0.16 });
  };

  // Determine which chime key is currently sounding for glowing indicator
  const currentLeadNote = currentMelody.notes[activeStep]?.lead?.note;

  return (
    <div className="project-card lullaby-card">
      <div className="project-grid">
        {/* Left Visual Column */}
        <div className="project-visual-col">
          <div className="music-box-preview-wrap">
            <img
              src="/assets/pip_lullaby_box.png"
              alt="Pip's Lullaby Lab Music Box with golden star crank"
              className={`music-box-img ${isPlaying ? 'rotating-crank' : ''}`}
            />
            {isPlaying && (
              <div className="floating-notes-overlay">
                <span className="note note-1">♪</span>
                <span className="note note-2">♫</span>
                <span className="note note-3">♩</span>
                <span className="note note-4">✦</span>
              </div>
            )}
          </div>
          <div className="project-tag-strip">
            <span>PROJECT NO. 01</span>
            <span>POLYPHONIC MUSIC BOX</span>
          </div>
        </div>

        {/* Right Interaction Column */}
        <div className="project-info-col">
          <span className="project-eyebrow">ACOUSTIC DREAM ENGINEERING</span>
          <h3 className="project-title">The Lullaby Lab</h3>
          <p className="project-desc">
            A miniature dream music studio crafted with clockwork gears and starlight bells.
            Pip tunes each comb to slow down rapid heartbeats and ease little thoughts into deep, peaceful sleep.
          </p>

          {/* Active Track Title Pill */}
          <div className="melody-info-card">
            <div className="melody-track-text">
              <span className="melody-track-title">
                <span>{currentMelody.icon}</span>
                <span>{currentMelody.title}</span>
              </span>
              <span className="melody-track-desc">{currentMelody.subtitle}</span>
            </div>
            {isPlaying && (
              <span className="melody-playing-indicator">
                <Disc size={15} className="spinning-disc" />
                <span>Playing</span>
              </span>
            )}
          </div>

          {/* Player Controls */}
          <div className="lullaby-controls">
            <button
              onClick={handleTogglePlay}
              className={`btn ${isPlaying ? 'btn-active' : 'btn-primary'}`}
              aria-label={isPlaying ? 'Pause Midnight Melody' : 'Play Midnight Melody'}
            >
              {isPlaying ? <Square size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause Melody' : 'Play Midnight Melody'}</span>
            </button>

            <div className="tempo-selector">
              <label htmlFor="tempo-select" className="tempo-label">Melody &amp; Tempo:</label>
              <select
                id="tempo-select"
                value={selectedTempo}
                onChange={(e) => handleTempoSelect(e.target.value)}
                className="tempo-dropdown"
              >
                <option value="sleepy">🌙 Sleepy — Starlight Lullaby</option>
                <option value="dreamy">🎠 Dreamy — Celestial Carousel</option>
                <option value="gentle">✨ Breezy — Dancing Stardust</option>
              </select>
            </div>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="equalizer-display">
            {[45, 80, 55, 92, 65, 85, 50, 95].map((h, i) => (
              <div
                key={i}
                className="eq-bar"
                style={{
                  height: isPlaying ? `${Math.sin((activeStep + i) * 0.9) * 20 + 26}px` : '6px',
                  backgroundColor: isPlaying ? 'var(--color-amber)' : 'var(--color-muted-border)',
                }}
              ></div>
            ))}
            <span className="eq-status">
              {isPlaying
                ? `Note: ${currentMelody.notes[activeStep]?.desc || 'Bell Chime'}`
                : 'Wind star crank to play'}
            </span>
          </div>

          {/* Interactive Music Box Keys */}
          <div className="interactive-keys-section">
            <span className="keys-label">✦ Tap star chimes to compose with Pip:</span>
            <div className="chime-keys-row">
              {chimeKeys.map((key, idx) => {
                const isSounding = isPlaying && currentLeadNote === key.label;
                return (
                  <button
                    key={idx}
                    onClick={() => handleKeyClick(key.freq)}
                    className={`chime-key-btn ${isSounding ? 'active-key-playing' : ''}`}
                    title={`${key.name} (${key.label})`}
                  >
                    <span className="key-char">{key.label}</span>
                    <span className="key-sub">{key.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="project-foot-role">
            <strong>Pip's Creative Role:</strong> "I tuned each chime comb so every note rings clear and sweet like morning dew drops."
          </div>
        </div>
      </div>
    </div>
  );
}

