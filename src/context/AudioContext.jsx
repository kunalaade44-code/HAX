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

  // Ensure that whenever isMuted becomes true, all sounds and speech stop immediately
  useEffect(() => {
    if (isMuted) {
      stopAllSounds();
    }
  }, [isMuted]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopAllSounds();
    } else {
      // AudioContext needs resume if suspended
      const ctx = getAudioContext();
      if (ctx) {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
      }
    }
  };

  const stopAllSounds = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    stopAllASMR();
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

  // ASMR Soundscape active nodes and intervals
  const asmrNodesRef = useRef({
    rain: null,
    crickets: null,
    brownNoise: null,
  });
  const asmrMusicBoxTimerRef = useRef(null);

  const createPinkNoiseBuffer = (ctx) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  };

  const createBrownNoiseBuffer = (ctx) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.8;
    }
    return buffer;
  };

  const stopASMRChannel = (channel) => {
    if (channel === 'musicBox') {
      if (asmrMusicBoxTimerRef.current) {
        clearInterval(asmrMusicBoxTimerRef.current);
        asmrMusicBoxTimerRef.current = null;
      }
      return;
    }
    const nodeObj = asmrNodesRef.current[channel];
    if (nodeObj) {
      try {
        nodeObj.gain.gain.setValueAtTime(nodeObj.gain.gain.value, getAudioContext().currentTime);
        nodeObj.gain.gain.linearRampToValueAtTime(0.0001, getAudioContext().currentTime + 0.3);
        setTimeout(() => {
          try {
            nodeObj.source.stop();
            nodeObj.source.disconnect();
          } catch (e) {}
        }, 350);
      } catch (e) {}
      asmrNodesRef.current[channel] = null;
    }
  };

  const setASMRChannelVolume = (channel, volume) => {
    if (channel === 'musicBox') return;
    const nodeObj = asmrNodesRef.current[channel];
    if (nodeObj && audioCtxRef.current) {
      try {
        nodeObj.gain.gain.setValueAtTime(nodeObj.gain.gain.value, audioCtxRef.current.currentTime);
        nodeObj.gain.gain.linearRampToValueAtTime(Math.max(0.0001, volume * 0.3), audioCtxRef.current.currentTime + 0.1);
      } catch (e) {}
    }
  };

  const startASMRChannel = (channel, volume = 0.5) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    stopASMRChannel(channel);

    if (channel === 'rain') {
      try {
        const buffer = createPinkNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.25, ctx.currentTime + 0.8);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();
        asmrNodesRef.current.rain = { source, gain };
      } catch (e) {
        console.warn('Rain ASMR error', e);
      }
    } else if (channel === 'crickets') {
      try {
        // High frequency modulated bandpass for summer crickets
        const buffer = createPinkNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4600, ctx.currentTime);
        filter.Q.setValueAtTime(8, ctx.currentTime);

        // Amplitude modulation for cricket chirping cadence
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(4.5, ctx.currentTime); // 4.5 chirps/sec

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.18, ctx.currentTime + 0.8);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();
        asmrNodesRef.current.crickets = { source, gain };
      } catch (e) {
        console.warn('Crickets ASMR error', e);
      }
    } else if (channel === 'brownNoise') {
      try {
        const buffer = createBrownNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.32, ctx.currentTime + 0.8);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();
        asmrNodesRef.current.brownNoise = { source, gain };
      } catch (e) {
        console.warn('Brown noise error', e);
      }
    } else if (channel === 'musicBox') {
      const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 523.25];
      let noteIdx = 0;
      const playNext = () => {
        if (!isMuted) {
          playMusicBoxChime(melody[noteIdx % melody.length], { volume: volume * 0.1, duration: 1.8 });
          noteIdx++;
        }
      };
      playNext();
      asmrMusicBoxTimerRef.current = setInterval(playNext, 1600);
    }
  };

  const stopAllASMR = () => {
    stopASMRChannel('rain');
    stopASMRChannel('crickets');
    stopASMRChannel('brownNoise');
    stopASMRChannel('musicBox');
  };

  // Sound Effect: Pip's Purr / Cozy Petting Reaction
  const playPipPurr = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(145, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.7);

      lfo.frequency.setValueAtTime(12, ctx.currentTime); // 12Hz purr flutter
      lfoGain.gain.setValueAtTime(15, ctx.currentTime);
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
      lfo.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  // Sound Effect: Pillow Squish / Puffy Fluff
  const playPillowSquish = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const buffer = createPinkNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.22);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      source.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  // Sound Effect: Bedside Silver Bell
  const playAlarmBell = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      [1567.98, 3135.96].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(i === 0 ? 0.14 : 0.06, ctx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.95);
      });
    } catch (e) {}
  };

  // Sound Effect: Harp / Constellation note
  const playHarpNote = (semitone = 0) => {
    if (isMuted) return;
    const baseFreq = 392.0; // G4
    const freq = baseFreq * Math.pow(2, semitone / 12);
    playMusicBoxChime(freq, { duration: 1.5, volume: 0.15, overtone: true });
  };

  // Sound Effect: Telescope Constellation Complete
  const playTelescopeComplete = () => {
    if (isMuted) return;
    const scale = [0, 4, 7, 11, 14, 16, 19];
    scale.forEach((semi, idx) => {
      setTimeout(() => {
        playHarpNote(semi);
      }, idx * 110);
    });
  };

  // Sound Effect: Dream Blender Bubbling
  const playBubblingBlender = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (isMuted) return;
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startF = 350 + Math.random() * 200;
          const endF = startF + 250 + Math.random() * 200;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(startF, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(endF, ctx.currentTime + 0.08);

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
      }, i * 75);
    }
  };

  const speakText = (text, options = {}) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    // Strictly do not speak when muted
    if (isMuted) {
      stopSpeech();
      return;
    }

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
        // New unique ASMR & interactive effects
        startASMRChannel,
        stopASMRChannel,
        setASMRChannelVolume,
        stopAllASMR,
        playPipPurr,
        playPillowSquish,
        playAlarmBell,
        playHarpNote,
        playTelescopeComplete,
        playBubblingBlender,
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

