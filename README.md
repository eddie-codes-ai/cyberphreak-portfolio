**`cyberphreak-portfolio/README.md`**
```markdown
# 👾 Cyberphreak Portfolio

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)

A developer portfolio that skips the usual scroll-and-cards format for something closer to an actual terminal session — a real WebGL scene running in the background, a functioning in-browser shell you can type into, and animated node graphs instead of a static timeline.

## Highlights

- **Interactive 3D scene** rendered with Three.js, React Three Fiber, and Drei — not a static hero image
- **A terminal you can actually use**, powered by xterm.js, sitting in the middle of the page rather than tucked in a corner
- **Node-based flow diagrams** via `@xyflow/react`, animated to show relationships instead of listing them
- **Real backend, not a contact `mailto:`** — Supabase for data, Resend for delivering contact-form emails
- **Motion throughout**, driven by GSAP and Motion, tuned to feel deliberate rather than decorative

## Project Structure

cyberphreak-portfolio/
└── src/
    ├── app/                 # routes + API handlers
    ├── components/
    │   ├── effects/         # 3D scene, visual effects
    │   ├── layout/
    │   ├── panels/          # terminal, flow-diagram panels
    │   └── ui/
    ├── hooks/
    ├── lib/
    └── styles/

## Tech Stack

- Next.js · React · TypeScript
- Three.js / React Three Fiber / Drei
- xterm.js
- @xyflow/react
- Supabase
- Resend
- GSAP · Motion
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
