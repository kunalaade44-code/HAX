import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContextState = createContext();

export function AudioProvider({ children }) {
  // Hackathon rule: Audio MUST start MUTED by default
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioCtxRef = useRef(null);
  const activeOscillatorsRef = useRef([]);

  // Initialize SpeechSynthesis voice list
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopAllSounds();
    } else {
      // Play a tiny confirmation chime on unmute
      playTone(523.25, 0.25, 'sine', 0.08); // High C
    }
  };

  const stopAllSounds = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    activeOscillatorsRef.current.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {
        // Ignored
      }
    });
    activeOscillatorsRef.current = [];
  };

  const playTone = (freq, duration = 0.4, type = 'sine', volume = 0.12) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Warm attack & gentle natural exponential decay
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      activeOscillatorsRef.current.push(osc);
      setTimeout(() => {
        activeOscillatorsRef.current = activeOscillatorsRef.current.filter((o) => o !== osc);
      }, duration * 1000 + 100);
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  };

  const playChime = (freq = 440) => {
    if (isMuted) return;
    playTone(freq, 0.45, 'triangle', 0.1);
  };

  const playStarSparkle = () => {
    if (isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.35, 'sine', 0.07);
      }, idx * 60);
    });
  };

  const playBoing = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Ignored
    }
  };

  const playMusicBoxChime = (freq, options = {}) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = options.duration || 1.3;
      const volume = options.volume || 0.13;

      // 1. Primary body tone (warm pure sine/triangle)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = options.type || 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(volume, now + 0.005);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + duration + 0.05);
      activeOscillatorsRef.current.push(osc1);

      // 2. High crystalline metallic harmonic overtone (classic music box tine ring)
      if (freq < 1400 && options.overtone !== false) {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        // 2.756x inharmonic ratio simulates mechanical music box steel tine resonance
        osc2.frequency.setValueAtTime(freq * 2.756, now);

        gain2.gain.setValueAtTime(0.0001, now);
        gain2.gain.linearRampToValueAtTime(volume * 0.42, now + 0.002);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(duration, 0.24));

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.3);
        activeOscillatorsRef.current.push(osc2);
      }

      setTimeout(() => {
        activeOscillatorsRef.current = activeOscillatorsRef.current.filter((o) => o !== osc1);
      }, duration * 1000 + 100);
    } catch (err) {
      console.warn('Music box audio error:', err);
    }
  };

  const speakText = (text, options = {}) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      // Clean text for speech
      const clean = text
        .replace(/♡/g, '')
        .replace(/[★✦✧☆]/g, '')
        .replace(/\.\.\./g, ', ')
        .replace(/Yaaawn/gi, 'Yawn')
        .trim();

      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);

      const voices = window.speechSynthesis.getVoices();
      const preferredNames = [
        'Natural', 'Samantha', 'Victoria', 'Karen', 'Moira', 'Google US English',
        'Microsoft Zira', 'Microsoft Jenny', 'Jenny', 'Ana', 'Child'
      ];
      let selectedVoice = null;
      for (const name of preferredNames) {
        selectedVoice = voices.find((v) => v.lang.startsWith('en') && v.name.includes(name));
        if (selectedVoice) break;
      }
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.pitch = options.pitch !== undefined ? options.pitch : 1.35;
      utterance.rate = options.rate !== undefined ? options.rate : 0.95;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AudioContextState.Provider
      value={{
        isMuted,
        setIsMuted,
        toggleMute,
        playTone,
        playChime,
        playStarSparkle,
        playBoing,
        stopAllSounds,
        playMusicBoxChime,
        speakText,
        stopSpeech,
        isSpeaking,
      }}
    >
      {children}
    </AudioContextState.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContextState);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
