import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CharacterDossier } from './components/CharacterDossier';
import { PillowTestingLab } from './components/PillowTestingLab';
import { ProjectShowcase } from './components/ProjectShowcase';
import { OriginStory } from './components/OriginStory';
import { DreamJournal } from './components/DreamJournal';
import { SecretDreamRoom } from './components/SecretDreamRoom';
import { BedsideCompanion } from './components/BedsideCompanion';
import { CelestialTelescope } from './components/CelestialTelescope';
import { Footer } from './components/Footer';
import { SparkleTrail } from './components/SparkleTrail';
import { useTheme } from './context/ThemeContext';

export function App() {
  const { chaosMode } = useTheme();
  const [bedsideOpen, setBedsideOpen] = useState(false);
  const [telescopeOpen, setTelescopeOpen] = useState(false);

  return (
    <div className={`dreamverse-app ${chaosMode ? 'chaos-mode' : ''}`}>
      {/* Interactive Cursor Stardust Trail */}
      <SparkleTrail />

      {/* Floating Navigation with Quick Launchers */}
      <Navbar
        onOpenBedside={() => setBedsideOpen(true)}
        onOpenTelescope={() => setTelescopeOpen(true)}
      />

      {/* Main Long-Form Storybook Portfolio */}
      <main id="main">
        <Hero
          onOpenBedside={() => setBedsideOpen(true)}
          onOpenTelescope={() => setTelescopeOpen(true)}
        />
        <CharacterDossier />
        <PillowTestingLab />
        <ProjectShowcase />
        <OriginStory />
        <DreamJournal />
      </main>

      {/* Bedside Nightlight & ASMR Sleep Companion Modal */}
      <BedsideCompanion
        isOpen={bedsideOpen}
        onClose={() => setBedsideOpen(false)}
      />

      {/* Celestial Telescope Observatory Viewfinder Modal */}
      <CelestialTelescope
        isOpen={telescopeOpen}
        onClose={() => setTelescopeOpen(false)}
      />

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
