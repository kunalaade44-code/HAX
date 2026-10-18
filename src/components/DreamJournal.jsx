import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Trash2, Heart, Sparkles, Star, FlaskConical } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { DreamBlender } from './DreamBlender';

export function DreamJournal() {
  const { playChime, playTone } = useAudio();
  const [activeTab, setActiveTab] = useState('guestbook'); // 'guestbook' | 'blender'

  const initialDreams = [
    {
      id: 'default-1',
      author: 'Pip (Junior Dream Engineer)',
      wish: 'That every wandering night-wanderer finds a blanket made of warm cinnamon starlight.',
      date: 'Midnight Nursery Staff Log · Canon'
    },
    {
      id: 'default-2',
      author: 'Little Barn Owl',
      wish: 'A wind that blows gently enough to whisper forest secrets without rustling the tree leaves.',
      date: 'Delivered Wish'
    }
  ];

  const [dreams, setDreams] = useState(() => {
    try {
      const saved = localStorage.getItem('pip-dreams');
      return saved ? JSON.parse(saved) : initialDreams;
    } catch {
      return initialDreams;
    }
  });

  const [authorName, setAuthorName] = useState('');
  const [dreamText, setDreamText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('pip-dreams', JSON.stringify(dreams));
  }, [dreams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAuthor = authorName.trim() || 'Sleepy Friend';
    const cleanText = dreamText.trim();

    if (!cleanText) {
      setErrorMsg('Please whisper a dream into the journal first.');
      playTone(330, 0.2);
      return;
    }

    if (cleanText.length > 200) {
      setErrorMsg('Dreams should be cozy and under 200 characters.');
      return;
    }

    setErrorMsg('');
    playChime(659.25);

    const newDream = {
      id: Date.now().toString(),
      author: cleanAuthor,
      wish: cleanText,
      date: `Saved tonight (${new Date().toLocaleDateString()})`
    };

    setDreams([newDream, ...dreams]);
    setAuthorName('');
    setDreamText('');
    setJustSubmitted(true);

    setTimeout(() => {
      setJustSubmitted(false);
    }, 4000);
  };

  const handleDelete = (id) => {
    playTone(392, 0.2);
    setDreams(dreams.filter((d) => d.id !== id));
  };

  return (
    <section className="journal-section" id="journal">
      <div className="section-header">
        <span className="section-badge">
          <BookOpen size={13} />
          BEDTIME GUESTBOOK &amp; ALCHEMY LAB
        </span>
        <h2 className="section-title">
          The Midnight <em>Dream Repository</em>
        </h2>
        <p className="section-subtitle">
          Whisper a nighttime wish into Pip’s dream journal, or blend magical bedtime ingredients to generate your official Dream Passport!
        </p>

        {/* Tab Switcher */}
        <div className="journal-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'guestbook'}
            onClick={() => {
              playChime(523.25);
              setActiveTab('guestbook');
            }}
            className={`journal-tab-btn ${activeTab === 'guestbook' ? 'active' : ''}`}
          >
            <BookOpen size={15} />
            <span>Whisper a Wish (Guestbook)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'blender'}
            onClick={() => {
              playChime(659.25);
              setActiveTab('blender');
            }}
            className={`journal-tab-btn ${activeTab === 'blender' ? 'active' : ''}`}
          >
            <FlaskConical size={15} />
            <span>Dream Alchemy &amp; Passport</span>
          </button>
        </div>
      </div>

      {activeTab === 'blender' ? (
        <DreamBlender />
      ) : (
        <div className="journal-grid">
        {/* Left Column: Form to Write Dream */}
        <div className="journal-form-card">
          <div className="card-top-header">
            <Sparkles size={18} />
            <h3>Whisper a Dream</h3>
          </div>
          <p className="form-subnote">
            Saved locally to your device’s nocturnal memory log.
          </p>

          <form onSubmit={handleSubmit} className="dream-form">
            <div className="form-group">
              <label htmlFor="author-input" className="form-label">Your Name / Night Nickname:</label>
              <input
                id="author-input"
                type="text"
                placeholder="e.g. Star Chaser, Cozy Bear..."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={40}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dream-textarea" className="form-label">
                Your Dream or Bedtime Wish:
                <span className="char-count">({200 - dreamText.length} left)</span>
              </label>
              <textarea
                id="dream-textarea"
                rows={4}
                placeholder="What dream should Pip engineer for you tonight?..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                maxLength={200}
                className="form-textarea"
              />
            </div>

            {errorMsg && <p className="form-error">{errorMsg}</p>}

            {justSubmitted && (
              <div className="form-success">
                <Heart size={16} />
                <span>Your dream has been tucked safely into the starlight log! ♡</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary submit-dream-btn">
              <Send size={15} />
              <span>Send Wish to the Stars</span>
            </button>
          </form>
        </div>

        {/* Right Column: List of Saved Dreams */}
        <div className="journal-entries-col">
          <div className="entries-header-row">
            <span className="entries-count-badge">
              ✦ {dreams.length} Dreams in Registry
            </span>
            <span className="entries-notice-note">
              Stored locally on this device
            </span>
          </div>

          <div className="dreams-scroll-container">
            {dreams.map((dream) => (
              <div key={dream.id} className="dream-entry-card">
                <div className="entry-header">
                  <div className="entry-author-row">
                    <Star size={14} className="entry-star-icon" />
                    <strong className="entry-author">{dream.author}</strong>
                  </div>
                  <span className="entry-date">{dream.date}</span>
                </div>

                <p className="entry-wish">"{dream.wish}"</p>

                {dream.id !== 'default-1' && (
                  <button
                    onClick={() => handleDelete(dream.id)}
                    className="entry-delete-btn"
                    title="Remove this dream"
                    aria-label={`Remove dream from ${dream.author}`}
                  >
                    <Trash2 size={13} />
                    <span>Forget</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </section>
  );
}

