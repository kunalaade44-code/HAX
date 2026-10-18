import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Download,
  RotateCcw,
  Star,
  Check,
  Award,
  Bookmark,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../context/AudioContext';

const INGREDIENTS = [
  { id: 'milk', name: 'Warm Cinnamon Milk', icon: '🥛', note: 'Calms nighttime jitters', color: '#fef08a' },
  { id: 'lavender', name: 'Attic Lavender', icon: '🪻', note: 'Sweet fragrant slumber', color: '#c084fc' },
  { id: 'stardust', name: 'Rocket Stardust', icon: '🚀', note: 'For cosmic adventures', color: '#38bdf8' },
  { id: 'cloud', name: 'Cumulus Cloud Fluff', icon: '☁️', note: 'Floating weightlessness', color: '#93c5fd' },
  { id: 'purr', name: 'Kitten Purr Soundwave', icon: '🐈', note: 'Gentle vibration comfort', color: '#f472b6' },
  { id: 'moonbeam', name: 'Moonbeam Glaze', icon: '🌙', note: 'Silver luminescence', color: '#fde047' },
  { id: 'honey', name: 'Wild Honeycomb', icon: '🍯', note: 'Golden sweet thoughts', color: '#fb923c' },
  { id: 'parchment', name: 'Fairy Tale Parchment', icon: '📖', note: 'Old bedtime fables', color: '#e2e8f0' },
];

const DREAM_RHYMES = {
  cosmic: [
    "Across the velvet milky way, a paper rocket flies,\nWhile Pip tucks in the sleepy moon and sings to starry skies.",
    "A shower of gold and stardust bright shall light your cozy bed,\nNo monsters linger in the dark where starlight softly treads."
  ],
  cozy: [
    "A sip of warm sweet cinnamon, a blanket soft and deep,\nThe attic crickets hush their song to welcome peaceful sleep.",
    "Soft kitten purrs and velvet clouds will cradle you tonight,\nWake up with gentle morning sun and spirits shining bright."
  ],
  magical: [
    "Turn ancient storybook pages slow beneath the silver gleam,\nThe Midnight Nursery grants to you a wonder-weaving dream.",
    "From lavender mist to glowing stars, the night winds gently blow,\nA quiet secret from the moon is whispered sweet and low."
  ]
};

export function DreamBlender() {
  const { playBubblingBlender, playTelescopeComplete, playTone, playChime } = useAudio();

  const [selectedIds, setSelectedIds] = useState(['milk', 'lavender', 'stardust']);
  const [isBlending, setIsBlending] = useState(false);
  const [blendedResult, setBlendedResult] = useState(null);
  const constellationCanvasRef = useRef(null);

  const toggleIngredient = (id) => {
    playTone(523.25, 0.15);
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([...selectedIds.slice(1), id]);
      }
    }
  };

  const handleBlend = () => {
    playBubblingBlender();
    setIsBlending(true);
    setBlendedResult(null);

    setTimeout(() => {
      setIsBlending(false);

      // Determine category
      const hasCosmic = selectedIds.includes('stardust') || selectedIds.includes('moonbeam');
      const hasMagic = selectedIds.includes('parchment') || selectedIds.includes('honey');
      const category = hasCosmic ? 'cosmic' : hasMagic ? 'magical' : 'cozy';
      const rhymeList = DREAM_RHYMES[category];
      const rhyme = rhymeList[Math.floor(Math.random() * rhymeList.length)];

      const passportId = `MIDNIGHT-${Math.floor(1000 + Math.random() * 9000)}-PIP`;

      const result = {
        id: passportId,
        ingredients: INGREDIENTS.filter((ing) => selectedIds.includes(ing.id)),
        rhyme,
        category,
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      setBlendedResult(result);
      playTelescopeComplete();

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#fbbf24', '#38bdf8', '#c084fc', '#f472b6'],
        });
      } catch (e) {}
    }, 1400);
  };

  // Draw procedural constellation whenever blendedResult updates
  useEffect(() => {
    if (!blendedResult || !constellationCanvasRef.current) return;
    const canvas = constellationCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Deep cosmic gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0a1128');
    grad.addColorStop(1, '#060a17');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Procedural star nodes from selected ingredients
    const seed = blendedResult.id.charCodeAt(9) || 42;
    const starCount = 6;
    const points = [];

    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + (seed * 0.1);
      const radius = (w * 0.3) + ((i % 2) * (w * 0.12));
      const x = w / 2 + Math.cos(angle) * radius;
      const y = h / 2 + Math.sin(angle) * (radius * 0.75);
      points.push({ x, y });
    }

    // Draw starlight lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw cross star diagonals
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.moveTo(points[1].x, points[1].y);
    ctx.lineTo(points[4].x, points[4].y);
    ctx.stroke();

    // Draw glowing star nodes
    points.forEach((pt, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#fbbf24' : '#38bdf8';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [blendedResult]);

  // Export Passport as PNG
  const handleDownloadPassport = () => {
    if (!blendedResult) return;
    playChime(659.25);

    // Create high-resolution export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 640;
    exportCanvas.height = 800;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Vintage deep parchment / starry navy background
    const bgGrad = ctx.createLinearGradient(0, 0, 640, 800);
    bgGrad.addColorStop(0, '#0c1527');
    bgGrad.addColorStop(0.5, '#070d1a');
    bgGrad.addColorStop(1, '#050914');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 800);

    // Golden foil double border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 592, 752);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 32, 576, 736);

    // Header badge
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 15px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ MIDNIGHT NURSERY · OFFICIAL DREAM PASSPORT ✦', 320, 75);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic bold 28px "Playfair Display", serif';
    ctx.fillText('Authorized Bedtime Slumber Permit', 320, 115);

    // Passport ID
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "DM Sans", sans-serif';
    ctx.fillText(`PERMIT NO: ${blendedResult.id}`, 320, 150);

    // Draw Constellation Chart in center
    const cx = 320;
    const cy = 290;
    const rad = 100;
    ctx.fillStyle = 'rgba(15, 28, 53, 0.8)';
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.stroke();

    // Draw constellation lines
    const starPts = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = rad * 0.75 + ((i % 2) * 15);
      starPts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(starPts[0].x, starPts[0].y);
    for (let i = 1; i < starPts.length; i++) ctx.lineTo(starPts[i].x, starPts[i].y);
    ctx.closePath();
    ctx.stroke();

    starPts.forEach((p) => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "DM Sans", sans-serif';
    ctx.fillText('Aligned Constellation: Ursa Slumber & The Cloud Baby', 320, 420);

    // Ingredients
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 15px "DM Sans", sans-serif';
    const ingNames = blendedResult.ingredients.map((i) => `${i.icon} ${i.name}`).join('   ');
    ctx.fillText(ingNames, 320, 465);

    // Rhyme
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'italic 17px "Playfair Display", serif';
    const lines = blendedResult.rhyme.split('\n');
    ctx.fillText(`"${lines[0]}"`, 320, 520);
    if (lines[1]) ctx.fillText(`"${lines[1]}"`, 320, 550);

    // Wax Seal & Signature
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(200, 660, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "DM Sans", sans-serif';
    ctx.fillText('MIDNIGHT', 200, 655);
    ctx.fillText('NURSERY', 200, 672);

    // Pip Signature
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px "DM Sans", sans-serif';
    ctx.fillText('VERIFIED BY CHIEF DREAM ENGINEER:', 270, 645);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 20px "Playfair Display", serif';
    ctx.fillText('Pip the Skull Baby ♡', 270, 675);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px "DM Sans", sans-serif';
    ctx.fillText(`Issued: ${blendedResult.date} · Staff Stamp #001`, 270, 700);

    // Download image trigger
    const link = document.createElement('a');
    link.download = `pip-dream-passport-${blendedResult.id}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="dream-blender-module">
      <div className="blender-header">
        <span className="blender-badge">
          <Sparkles size={13} />
          PIP'S DREAM ALCHEMY · CO-CREATION
        </span>
        <h3 className="blender-title">
          The <em>Dream Ingredient Blender</em>
        </h3>
        <p className="blender-subtitle">
          Choose 3 dreamy ingredients from Pip’s pantry to synthesize a personalized bedtime prophecy and official stamped dream passport.
        </p>
      </div>

      {/* Ingredient Pantry Grid */}
      <div className="blender-pantry-grid">
        {INGREDIENTS.map((ing) => {
          const isSelected = selectedIds.includes(ing.id);
          return (
            <button
              key={ing.id}
              onClick={() => toggleIngredient(ing.id)}
              className={`pantry-ingredient-card ${isSelected ? 'selected' : ''}`}
              style={{ '--ing-color': ing.color }}
              aria-pressed={isSelected}
            >
              <div className="ing-icon-wrap">
                <span className="ing-emoji">{ing.icon}</span>
                {isSelected && (
                  <span className="ing-check-badge">
                    <Check size={11} />
                  </span>
                )}
              </div>
              <span className="ing-name">{ing.name}</span>
              <span className="ing-note">{ing.note}</span>
            </button>
          );
        })}
      </div>

      {/* Action Row */}
      <div className="blender-actions-bar">
        <span className="blender-selection-count">
          Selected: <strong>{selectedIds.length}/3</strong> ingredients
        </span>
        <button
          onClick={handleBlend}
          disabled={selectedIds.length === 0 || isBlending}
          className="btn btn-primary blend-trigger-btn"
        >
          <Sparkles size={16} />
          <span>{isBlending ? 'Synthesizing Dream Recipe...' : 'Blend Dream Recipe ✦'}</span>
        </button>
      </div>

      {/* Blended Result Passport Card */}
      {blendedResult && (
        <div className="passport-reveal-card">
          <div className="passport-inner-frame">
            <div className="passport-top-header">
              <span className="passport-badge">
                <Award size={14} /> MIDNIGHT NURSERY · OFFICIAL PERMIT
              </span>
              <span className="passport-number">{blendedResult.id}</span>
            </div>

            <div className="passport-content-grid">
              {/* Left Column: Procedural Constellation Canvas */}
              <div className="passport-canvas-box">
                <canvas
                  ref={constellationCanvasRef}
                  width={240}
                  height={180}
                  className="passport-constellation-canvas"
                  aria-label="Generated star constellation"
                />
                <span className="passport-constellation-caption">
                  ✦ Unique Aligned Constellation
                </span>
              </div>

              {/* Right Column: Custom Rhyme & Approval */}
              <div className="passport-details-col">
                <h4 className="passport-title">Bedtime Slumber Permit</h4>

                <div className="passport-ingredients-tags">
                  {blendedResult.ingredients.map((ing) => (
                    <span key={ing.id} className="passport-ing-pill">
                      {ing.icon} {ing.name}
                    </span>
                  ))}
                </div>

                <div className="passport-rhyme-quote">
                  <p>"{blendedResult.rhyme}"</p>
                </div>

                <div className="passport-signature-footer">
                  <div className="passport-wax-seal">
                    <span>SEAL</span>
                  </div>
                  <div className="passport-sig-text">
                    <span className="passport-sig-name">Pip the Skull Baby ♡</span>
                    <span className="passport-sig-title">Junior Dream Engineer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="passport-export-row">
              <button
                onClick={handleDownloadPassport}
                className="btn btn-secondary download-passport-btn"
              >
                <Download size={16} />
                <span>Download Official Dream Passport (PNG)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
