import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CharacterDossier } from './components/CharacterDossier';
import { ProjectShowcase } from './components/ProjectShowcase';
import { OriginStory } from './components/OriginStory';
import { DreamJournal } from './components/DreamJournal';
import { SecretDreamRoom } from './components/SecretDreamRoom';
import { Footer } from './components/Footer';
import { SparkleTrail } from './components/SparkleTrail';
import { useTheme } from './context/ThemeContext';

export function App() {
  const { chaosMode } = useTheme();

  return (
    <div className={`dreamverse-app ${chaosMode ? 'chaos-mode' : ''}`}>
      {/* Interactive Cursor Stardust Trail */}
      <SparkleTrail />

      {/* Floating Navigation */}
      <Navbar />

      {/* Main Long-Form Storybook Portfolio */}
      <main id="main">
        <Hero />
        <CharacterDossier />
        <ProjectShowcase />
        <OriginStory />
        <DreamJournal />
      </main>

      {/* Hidden Easter Egg (Secret Dream Room Star) */}
      <SecretDreamRoom />

      {/* Footer */}
      <Footer />

      {/* Playful Chaos Mode Floating Elements (+5 Hackathon Bonus) */}
      {chaosMode && (
        <div className="chaos-overlay" aria-hidden="true">
          <span className="chaos-sticker sticker-1">⭐ SO COZY</span>
          <span className="chaos-sticker sticker-2">🌙 YAAAWN</span>
          <span className="chaos-sticker sticker-3">☁️ CLOUD NINE</span>
          <span className="chaos-sticker sticker-4">💤 ZZZ...</span>
          <span className="chaos-sticker sticker-5">✦ STARDUST OVERLOAD</span>
        </div>
      )}
    </div>
  );
}

export default App;
