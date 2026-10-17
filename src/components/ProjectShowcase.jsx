import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { LullabyLab } from './projects/LullabyLab';
import { NightlightCollection } from './projects/NightlightCollection';
import { DreamDelivery } from './projects/DreamDelivery';

export function ProjectShowcase() {
  return (
    <section className="projects-section" id="projects">
      <div className="section-header">
        <span className="section-badge">
          <Star size={13} />
          CREATIVE INVENTIONS · DREAM ENGINEERING
        </span>
        <h2 className="section-title">
          Pip's <em>Dream Projects</em>
        </h2>
        <p className="section-subtitle">
          From acoustic lullabies to starlight bedtime lanterns and village delivery maps.
          Each project is handcrafted to make bedtime safe, warm, and comforting.
        </p>
      </div>

      <div className="projects-stack">
        <LullabyLab />
        <NightlightCollection />
        <DreamDelivery />
      </div>
    </section>
  );
}
