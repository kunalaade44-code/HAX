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

## 🌐 Deployment to Vercel

This repository is ready for 1-click deployment on **Vercel**:
1. Push your code to GitHub.
2. In Vercel, click **"Add New Project"** and select this repository.
3. Vercel automatically detects **Vite**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

---

## 🎨 Official Asset Credits

All character artwork and lore belong to the **haX.baby Track 1 Creator Pack**:
- `pip_avatar_cloud.png` — Pip floating on a cozy dream cloud waving a tiny hand.
- `pip_lullaby_box.png` — The Lullaby Lab music box with star crank.
- `pip_dream_lantern.png` — Pip's glowing crescent moon nightlight lantern.
- `pip_portrait.png` — Official studio character portrait.

---

*Sleep gently tonight. The universe is brighter because you're here. ♡*