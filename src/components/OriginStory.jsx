import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export function OriginStory() {
  const { playChime, playTone } = useAudio();
  const [activeScene, setActiveScene] = useState(0);

  const scenes = [
    {
      number: "01",
      title: "The First Star",
      time: "Twilight Hour · The Beginning",
      text: "Pip woke up on a drift of downy white cloud, clutching a tiny starlight ember that buzzed with quiet warmth. Around them, the twilight sky was hushed and vast, dotted with sleeping little critters whose pillows were empty of wonder. Pip blew gently on the star's embers, watching its sparks dance like fireflies into the nocturnal breeze, wondering where dreams came from.",
      illustration: "/assets/pip_avatar_cloud.png",
      tag: "EMERGENCE",
      quote: "Even the darkest midnight is just waiting for one tiny spark."
    },
    {
      number: "02",
      title: "The Midnight Nursery",
      time: "Midnight · The Discovery",
      text: "Tucked behind a sleepy crescent moon, Pip found an old attic observatory stacked with wound-down music boxes, tarnished brass lanterns, and forgotten bedtime tales. With a crooked smile and sticky little fingers, Pip began tinkering—polishing gears with stardust, tuning music combs to the rhythm of slow breathing, and realizing these old relics could become comforting dreams.",
      illustration: "/assets/pip_lullaby_box.png",
      tag: "THE WORKSHOP",
      quote: "Broken music boxes just need someone who listens patiently."
    },
    {
      number: "03",
      title: "The Dream Engineer",
      time: "Starlight Dawn · The Calling",
      text: "Equipped with a star-stitched nightcap and a satchel of sleepy sparks, Pip began delivering custom dreams across the sleepy rooftops. Each lantern hung by a window brought peace; each lullaby placed under a pillow brought soft smiles. Pip discovered that a small skull baby with gentle intentions could make the entire world feel safe until morning.",
      illustration: "/assets/pip_dream_lantern.png",
      tag: "PURPOSE",
      quote: "A small act of kindness can make someone's entire night brighter."
    }
  ];

  const handlePrev = () => {
    playTone(440, 0.2);
    setActiveScene((prev) => (prev > 0 ? prev - 1 : scenes.length - 1));
  };

  const handleNext = () => {
    playTone(523.25, 0.2);
    setActiveScene((prev) => (prev < scenes.length - 1 ? prev + 1 : 0));
  };

  const handleReplay = () => {
    playChime(659.25);
    setActiveScene(0);
  };

  const current = scenes[activeScene];

  return (
    <section className="story-section" id="story">
      <div className="section-header">
        <span className="section-badge">
          <BookOpen size={13} />
          ORIGIN CHRONICLES · THREE ACTS
        </span>
        <h2 className="section-title">
          The Story of <em>Pip</em>
        </h2>
        <p className="section-subtitle">
          How a sleepy little skull baby found their place among the stars.
        </p>
      </div>

      <div className="story-stage">
        {/* Progress Stepper Bar */}
        <div className="story-stepper-bar" role="tablist" aria-label="Story Scene Progress">
          {scenes.map((scene, idx) => (
            <button
              key={idx}
              onClick={() => {
                playTone(440 + idx * 60, 0.2);
                setActiveScene(idx);
              }}
              className={`story-step-btn ${idx === activeScene ? 'active-step' : ''}`}
              role="tab"
              aria-selected={idx === activeScene}
            >
              <span className="step-num">{scene.number}</span>
              <span className="step-name">{scene.title}</span>
            </button>
          ))}
        </div>

        {/* Story Card Content */}
        <div className="story-scene-card">
          <div className="story-scene-grid">
            {/* Visual Column */}
            <div className="story-visual-col">
              <div className="story-img-frame">
                <img
                  src={current.illustration}
                  alt={`Illustration for ${current.title}`}
                  className="story-illustration"
                />
                <span className="story-scene-tag">{current.tag}</span>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="story-text-col">
              <div className="scene-meta-row">
                <span className="scene-num-badge">SCENE {current.number} / 03</span>
                <span className="scene-time-stamp">{current.time}</span>
              </div>

              <h3 className="scene-heading">{current.title}</h3>
              <p className="scene-narrative-text">{current.text}</p>

              <blockquote className="scene-quote-box">
                <Sparkles size={14} className="quote-sparkle" />
                <span>"{current.quote}"</span>
              </blockquote>

              {/* Navigation Controls */}
              <div className="story-nav-buttons">
                <button
                  onClick={handlePrev}
                  className="story-control-btn"
                  aria-label="Previous scene"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  className="story-control-btn primary-step"
                  aria-label="Next scene"
                >
                  <span>{activeScene === scenes.length - 1 ? 'Start Over' : 'Next Scene'}</span>
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={handleReplay}
                  className="story-replay-btn"
                  title="Replay from Scene 1"
                  aria-label="Replay story from the beginning"
                >
                  <RotateCcw size={16} />
                  <span>Replay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
