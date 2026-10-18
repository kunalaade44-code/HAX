# ✦ Pip's Midnight Dreamverse — A Little World of Big Dreams ✦
**haX.baby — Baby's First Website Hackathon (Track 1: Pip the Skull Baby)**

> *"Every little star has a dream. Sweet dreams from Pip. ♡"*

An interactive, production-quality 3D storybook character portfolio built for **Pip the Skull Baby**, Junior Dream Engineer at the Midnight Nursery.

---

## 🌟 Project Overview

**Pip's Midnight Dreamverse** invites visitors into a nocturnal observatory floating above sleepy rooftops. Instead of an ordinary corporate portfolio, this project blends tactile early-web whimsy with modern 3D web engineering, Web Audio synthesis, and bedtime storytelling.

### Who is Pip?
- **Species:** Skull Baby (friendly, rounded cranium, soft eye sockets with glowing amber pupils, tiny crooked smile)
- **Occupation:** Junior Dream Engineer
- **Workplace:** The Midnight Nursery
- **Personality:** Sleepy, gentle, curious, imaginative, caring
- **Favorite Things:** Moonlight, music boxes, tiny stars, warm blankets
- **Quirk:** Frequently falls asleep mid-test while verifying pillow fluffiness
- **Voice:** Short, tender, playful sentences with cozy bedtime humor

---

## 🎮 Hackathon Requirements & Features Matrix

| Requirement | Implementation Details |
|---|---|
| **Character Introduction** | Hero section with live 3D character, status pill, and comprehensive **Character Dossier** featuring official portrait `pip_portrait.png`. |
| **Centerpiece 3D Scene** | Interactive 3D scene using **React Three Fiber** & **Three.js**: stylized 3D Pip sitting on a cloud with mouse-tracking amber eyes, floating crescent moon, bedside lantern, and rotating dream stars. |
| **3 Creative Projects** | 1. **The Lullaby Lab:** Interactive Web Audio music box synthesizer with star crank, tempo selector, equalizer, and playable star chime keys.<br>2. **The Nightlight Collection:** 3 bedside lanterns (*Moonbeam*, *Cloud Glow*, *Little Star*) with interactive ambient color halo and Pip's field notes.<br>3. **Dream Delivery Routes:** Interactive nocturnal village map with moving starlight courier and delivered dream scrolls. |
| **Origin Story** | 3-act illustrated storybook (*The First Star*, *The Midnight Nursery*, *The Dream Engineer*), all strictly under 150 words each, with stepper progress and replay controls. |
| **Hidden Easter Egg** | Clickable secret twinkling star in the bottom-left corner. Clicking it 5 times unlocks the **Secret Dream Room** with celebratory confetti (`canvas-confetti`) and Pip's secret message. |
| **Side Quest: Guestbook** | **The Midnight Dream Journal:** Visitors can whisper a dream or bedtime wish, validated and saved locally in `localStorage` with a clear "Saved on this device" disclaimer. |
| **Side Quest: Sparkle Trail** | Golden stardust particles trailing cursor movements (automatically disabled on touch screens and when `prefers-reduced-motion` is enabled). |
| **Side Quest: Visitor Counter** | Retro 90s digital odometer counter `[0][0][1][4][2][8]` tracking local dreamers welcomed. |
| **Side Quest: Sound & Mute** | Synthesized Web Audio API chimes & tones. **Starts muted by default** with a persistent accessible mute toggle. |
| **Side Quest: Chaos Mode (+5)** | Toggle button in the header that scatters playful bedtime stickers and bouncing stardust without breaking layout or text readability. |
| **Day / Night Theme** | Global theme toggle that dynamically updates both CSS color tokens AND the 3D scene lighting, ambient intensity, and star visibility. |
| **Responsive & Accessible** | Handcrafted responsive layout down to 320px mobile viewports; semantic landmarks, visible focus rings, ARIA controls, and reduced-motion compliance. |
| **✨ UNIQUE FEATURE: Bedside Companion & ASMR Mixer** | Dedicated full-screen ambient nightlight & desk clock companion with 4-track native generative Web Audio soundscape mixer (Attic Rain, Crickets, Brown Noise, Lullaby), room dimmer, and automated sleep fade-out timer. |
| **✨ UNIQUE FEATURE: Pillow Fluffiness Lab** | Gamifying Pip's canon lore quirk: interactive tactile test bench with spring squish physics, 4 experimental pillow prototypes, live fluffiness meter, Pip falling asleep on shift, and silver wake-up bell. |
| **✨ UNIQUE FEATURE: Dream Blender & Passport** | Co-creation dream alchemy pantry mixing 3 ingredients to synthesize custom bedtime prophecies, live procedural constellation star charts, and downloadable official stamped PNG Dream Passports. |
| **✨ UNIQUE FEATURE: Direct 3D Pip Care & Touch** | Tactile 3D pet & care system: petting Pip triggers squash/stretch spring physics, head tilt, blushing cheeks, warm synthesized purr hum, toggleable stitched starry quilt, and clickable lantern color cycling. |
| **✨ UNIQUE FEATURE: Celestial Telescope** | Brass Victorian viewfinder observatory overlay with star-connecting minigame, ethereal ascending harp chimes, nursery constellation lore, and free-hand stargazing mode. |


---

## 🛠️ Technology Stack

- **Framework:** React 18 + Vite
- **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Audio:** Web Audio API (100% native synthesized oscillators; zero external audio files required)
- **Motion & Confetti:** Framer Motion, `canvas-confetti`
- **Icons:** `lucide-react`
- **Typography:** Playfair Display (Serif headings), Fredoka (Playful labels/badges), DM Sans (Body)
- **Styling:** Custom CSS design system with CSS custom properties (variables) for seamless Day/Night mode

---

## 🚀 Getting Started

### 1. Installation
Clone this repository and install the dependencies:
```bash
npm install
```

### 2. Run Local Development Server
Start the Vite development server:
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser to experience Pip's Dreamverse.

### 3. Production Build
Compile an optimized production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```
HAX/
├── public/
│   └── assets/               # Canonical character illustrations & assets
│       ├── pip_avatar_cloud.png
│       ├── pip_dream_lantern.png
│       ├── pip_lullaby_box.png
│       └── pip_portrait.png
├── src/
│   ├── components/           # Modular UI & interactive features
│   │   ├── projects/         # Hackathon creative projects
│   │   │   ├── DreamDelivery.jsx
│   │   │   ├── LullabyLab.jsx
│   │   │   └── NightlightCollection.jsx
│   │   ├── BedsideCompanion.jsx
│   │   ├── CelestialTelescope.jsx
│   │   ├── CharacterDossier.jsx
│   │   ├── DreamBlender.jsx
│   │   ├── DreamJournal.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── OriginStory.jsx
│   │   ├── PillowTestingLab.jsx
│   │   ├── Pip3DCanvas.jsx
│   │   ├── PipCharacter.jsx
│   │   ├── ProjectShowcase.jsx
│   │   ├── SecretDreamRoom.jsx
│   │   └── SparkleTrail.jsx
│   ├── context/              # Global state providers
│   │   ├── AudioContext.jsx  # Native Web Audio oscillator synthesis & soundscapes
│   │   └── ThemeContext.jsx  # Day/Night theme & Chaos mode
│   ├── App.jsx               # Main application container
│   ├── index.css             # Unified design system & responsive styling
│   └── main.jsx              # React application entry point
├── .gitignore                # Git ignore rules for node_modules, dist, & cache
├── index.html                # Single-page HTML shell
├── package.json              # Project dependencies and build scripts
├── vercel.json               # Vercel deployment configuration & SPA rewrites
└── vite.config.js            # Vite bundler configuration
```

---

## 🌐 Deployment to Vercel

This repository is pre-configured with a dedicated [`vercel.json`](./vercel.json) for 1-click deployment on **Vercel**:

### Option A: Via GitHub (Recommended)
1. Push your code to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), click **"Add New Project"** and select this repository.
3. Vercel automatically detects the Vite framework and applies the settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Your site will be live in seconds!

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🎨 Official Asset Credits

All character artwork and lore belong to the **haX.baby Track 1 Creator Pack**:
- `pip_avatar_cloud.png` — Pip floating on a cozy dream cloud waving a tiny hand.
- `pip_lullaby_box.png` — The Lullaby Lab music box with star crank.
- `pip_dream_lantern.png` — Pip's glowing crescent moon nightlight lantern.
- `pip_portrait.png` — Official studio character portrait.

---

*Sleep gently tonight. The universe is brighter because you're here. ♡*