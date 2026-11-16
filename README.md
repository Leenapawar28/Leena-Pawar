# Leena Pawar portfolio

Next.js App Router, TypeScript, Tailwind CSS 4, GSAP ScrollTrigger and Three.js.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Validate with `npm run typecheck` and `npm run build`.

## Editing

- Professional details and social URLs: `lib/content.ts`.
- All 15 project records, cover images, screenshots, responsibilities and optional live links: `lib/projects.ts`.
- Add actual case-study image paths and URLs to `projects`; entries with null URLs are clearly presented as placeholders.
- Add LinkedIn/GitHub profile URLs to `socials`; missing links are displayed as pending text rather than dead links.
- About portrait: `public/images/leena-pawar-portrait.png` (transparent PNG), rendered in the upright identity card in `components/About.tsx`.
- Downloadable resume: `public/leena-pawar-cv.pdf`.
- Layout and responsive styling: `app/globals.css`.

The About layout lives in `components/About.tsx`. Its highlight strip repeats the experience, delivery count, and location already stated in the profile. Header active states and mobile navigation live in `components/SiteHeader.tsx`; pinned section navigation remains in `components/Journey.tsx`.

## Motion and colour

The hero retains the original black-hole asset and GSAP entrance/zoom sequence. `components/Journey.tsx` pins one viewport for the portfolio scenes. Each section finishes fading out before the next enters; reverse scrolling reverses those transitions. The shared bronze ribbon background remains constant throughout, including behind the Projects gallery.

The shared `--site-gradient`, `--site-base`, `--site-accent`, `--site-line`, and `--site-surface` tokens are defined at the end of `app/globals.css`. The main sections share the supplied bronze ribbon image through `--site-gradient`, with one constant dark overlay and no category-based background changes. The previous full-screen WebGL environment and separate section backdrop components are no longer mounted; their source files and supplied assets remain available in the project.

`components/Skills.tsx` and `lib/skills-motion.ts` provide the three sequential Skills categories, interpolated SVG motifs, orbital motion, and locally hosted brand icons. Skills uses the shared journey pin in cinematic mode and its own pin in reading mode. Reduced motion and short screens provide static category controls instead. Projects follows the completed Tools stage and flows directly into Contact.

`SkillParticles.tsx` lazily loads a local Three.js point cloud for the three large category symbols. Its shader gathers scattered particles into the existing SVG contours and reforms them with the reversible Skills timeline. It uses 2,200 points on desktop and 1,000 on mobile, caps pixel density, and pauses rendering offscreen or in hidden tabs. Reduced motion or unavailable WebGL retains the SVG symbols. Geometry, materials, observers and the renderer are disposed on unmount.

`components/Projects.tsx`, `components/ProjectCaseStudy.tsx`, and `lib/gallery-motion.ts` implement the 15-image perspective gallery, cached mirrored reflections, project counters, drag navigation and native mobile swiping. Desktop gallery travel uses the existing Journey ScrollTrigger; reading mode uses a standalone gallery pin. A native modal dialog provides the case-study overlay and focus containment. Background scroll position, scrollbar spacing, gallery progress and focus are restored when it closes. Project images are original, clearly labelled concept placeholders in `public/images/projects/`.

Scene navigation, header anchors, and the skip link target each scene's reading interval. Only the current scene and Skills category are interactive and exposed to assistive technology. Professional content remains in `lib/content.ts`.

Reduced motion, viewports shorter than 640px, and content that exceeds available reading space use the document fallback. Reading mode can also be selected from the journey toolbar. GSAP contexts, scroll triggers, observers, and navigation tweens are cleaned up on unmount or mode changes.

## Verification

Run `npm run typecheck` and `npm run build`. For visual QA at localhost:3000, verify: original intro; About handoff; each reading hold; reverse scrolling; all scene-navigation buttons; email/CV links; narrow/mobile viewport; browser zoom; reduced motion; Reading mode. Browser automation requires computer-use permissions in this environment.
