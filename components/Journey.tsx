'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { getSmoothScroll } from '@/lib/smooth-scroll';
import { setScrubPaused } from '@/lib/scrub-motion';
import { createAboutTimeline } from '@/lib/about-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { createGalleryTimeline, GALLERY_DURATION, galleryTime } from '@/lib/gallery-motion';
import { createSkillsTimeline, resetSkillsState, SKILL_DURATION, SKILL_STEP } from '@/lib/skills-motion';

const labels = ['About', 'Experience', 'Skills', 'Projects', 'Contact'];
const ids = ['about', 'experience', 'skills', 'work', 'contact'];
const STEP = 7;
const HOLD = 2.8;

export default function Journey({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [reading, setReading] = useState(false);
  const [active, setActive] = useState(0);
  const [cinematic, setCinematic] = useState(false);
  const activeRef = useRef(-1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', tall: '(min-height: 640px)', wide: '(min-width: 768px)' }, match => {
      if (!match.conditions?.motion || !match.conditions?.tall || !match.conditions?.wide || reading || !root.current || !stage.current) return;
      const wide = Boolean(match.conditions.wide);
      const container = root.current;
      const viewport = stage.current;
      const scenes = Array.from(viewport.querySelectorAll<HTMLElement>(':scope > .section'));
      const durations = scenes.map(scene => scene.id === 'skills' ? SKILL_DURATION + 3 : scene.id === 'work' && wide ? GALLERY_DURATION + 3 : STEP);
      const starts = durations.map((_, i) => durations.slice(0, i).reduce((sum, value) => sum + value, 0));
      const totalDuration = durations.reduce((sum, value) => sum + value, 0);
      container.dispatchEvent(new CustomEvent('journey-will-enable'));
      container.classList.add('journey-enabled');
      setCinematic(true);
      let disposed = false;
      let frame = 0;
      let navigation: { kill: () => void } | undefined;
      const scrollToPosition = (target: number, duration: number, onComplete?: () => void, ease = 'power2.inOut') => {
        const lenis = getSmoothScroll();
        if (!lenis) return gsap.to(window, {
          scrollTo: { y: target, autoKill: true }, duration, ease, overwrite: 'auto', onComplete,
        });
        lenis.scrollTo(target, { duration, lerp: 0, easing: gsap.parseEase(ease), onComplete });
        return { kill: () => lenis.scrollTo(lenis.scroll, { immediate: true }) };
      };
      const setActiveScene = (index: number) => {
        if (index === activeRef.current) return;
        activeRef.current = index;
        setActive(index);
        scenes.forEach((scene, i) => {
          scene.inert = i !== index;
          scene.setAttribute('aria-hidden', String(i !== index));
          scene.style.pointerEvents = i === index ? 'auto' : 'none';
        });
      };
      setActiveScene(0);
      gsap.set(scenes, { autoAlpha: 0, scale: .99, y: 12, transformOrigin: '50% 50%' });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container, start: 'top top', end: () => `+=${window.innerHeight * (totalDuration / STEP) * 3}`,
          pin: viewport, pinSpacing: true, scrub: true, invalidateOnRefresh: true,
          onUpdate(self) { viewport.classList.toggle('journey-visible', self.scroll() >= self.start); },
          onLeaveBack() { viewport.classList.remove('journey-visible'); },
          onEnter() { viewport.classList.add('journey-visible'); },
          onEnterBack() { viewport.classList.add('journey-visible'); },
        },
        onUpdate() {
          const time = timeline.time();
          const index = starts.reduce((current, start, i) => time >= start ? i : current, 0);
          setActiveScene(index);
          const progress = viewport.querySelector<HTMLElement>('.journey-progress-fill');
          if (progress) progress.style.transform = `scaleX(${timeline.progress()})`;
        },
      });
      trigger.current = timeline.scrollTrigger ?? null;
      // Only content changes between scenes; the shared gradient stays constant.
      scenes.forEach((scene, i) => {
        const at = starts[i];
        const enter = i === 0 ? 0 : at + .12;
        // Finish the outgoing scene before revealing the next. This also
        // reverses cleanly: there is never more than one visible text panel.
        timeline.fromTo(scene, { autoAlpha: 0, scale: .99, y: 12 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1.8,
            ease: 'sine.inOut', immediateRender: false }, enter);
        const heading = scene.querySelector('h2');
        const label = scene.querySelector('.section-label');
        if (label) timeline.fromTo(label, { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 1.1, ease: 'sine.out', immediateRender: false }, enter + .1);
        if (heading) timeline.fromTo(heading, { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 1.3, ease: 'sine.out', immediateRender: false }, enter + .2);
        const details = scene.querySelectorAll('.about-copy, .portrait-placeholder, .job, .skill-group, .project, .contact-kicker, .email, footer');
        if (details.length) timeline.fromTo(details, { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: { amount: .35 }, duration: 1.3,
            ease: 'sine.out', immediateRender: false }, enter + .4);
        if (scene.id === 'about') timeline.add(createAboutTimeline(scene), at + .5);
        if (scene.id === 'skills') timeline.add(createSkillsTimeline(scene), at + 1.2);
        if (scene.id === 'work' && wide) timeline.add(createGalleryTimeline(scene), at + 1.2);
        if (i < scenes.length - 1) {
          const boundary = at + durations[i];
          timeline.to(scene, { autoAlpha: 0, scale: 1.008, y: -10,
            duration: 1.3, ease: 'sine.inOut' }, boundary - 1.45);
        }
      });
      timeline.to({}, { duration: 1 }, totalDuration - 1);
      const navigate = (index: number, focus = false, immediate = false) => {
        const st = trigger.current;
        if (!st) return;
        if (index < 0 || index >= scenes.length) return;
        const settle = starts[index] + HOLD + (scenes[index].id === 'skills' ? 1.2 : 0);
        const target = st.start + (st.end - st.start) * (settle / timeline.duration());
        navigation?.kill();
        const focusScene = () => {
          if (!focus) return;
          scenes[index].tabIndex = -1;
          scenes[index].focus({ preventScroll: true });
        };
        if (immediate) {
          const lenis = getSmoothScroll();
          if (lenis) lenis.scrollTo(target, { immediate: true });
          else window.scrollTo({ top: target, behavior: 'instant' });
          timeline.time(settle);
          viewport.classList.add('journey-visible');
          focusScene();
        } else {
          navigation = scrollToPosition(target, Math.min(4.2, 2.8 + Math.abs(index - activeRef.current) * .2), focusScene);
        }
      };
      const onAnchor = (event: MouseEvent) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!link) return;
        const index = ids.indexOf(link.hash.slice(1));
        if (index < 0) return;
        event.preventDefault();
        history.replaceState(null, '', link.hash);
        navigate(index, true);
      };
      const onNavigate = (event: Event) => navigate((event as CustomEvent<number>).detail, true);
      const onSkillsNavigate = (event: Event) => {
        const category = (event as CustomEvent<number>).detail;
        const index = scenes.findIndex(scene => scene.id === 'skills');
        const st = trigger.current;
        if (!st || index < 0 || category < 0 || category > 2) return;
        navigation?.kill();
        const time = starts[index] + 1.2 + category * SKILL_STEP + HOLD;
        navigation = scrollToPosition(st.start + (st.end - st.start) * time / timeline.duration(), 2.8);
      };
      const onGalleryNavigate = (event: Event) => {
        const { progress, immediate } = (event as CustomEvent<{ progress: number; immediate: boolean }>).detail;
        const index = scenes.findIndex(scene => scene.id === 'work');
        const st = trigger.current;
        if (!st || index < 0) return;
        navigation?.kill();
        const time = starts[index] + 1.2 + galleryTime(progress);
        navigation = scrollToPosition(st.start + (st.end - st.start) * time / timeline.duration(), immediate ? .18 : 1.4, undefined, 'power2.out');
      };
      const onGalleryOverlay = (event: Event) => {
        const open = (event as CustomEvent<boolean>).detail;
        if (open) navigation?.kill();
        setScrubPaused(timeline.scrollTrigger, open);
      };
      document.addEventListener('click', onAnchor);
      container.addEventListener('journey-navigate', onNavigate);
      container.addEventListener('skills-navigate', onSkillsNavigate);
      container.addEventListener('gallery-navigate', onGalleryNavigate);
      container.addEventListener('gallery-overlay', onGalleryOverlay);
      const checkFit = () => {
        if (disposed) return;
        const overflow = scenes.some(scene => scene.id !== 'work' && scene.scrollHeight > viewport.clientHeight - 235);
        if (overflow) setReading(true);
      };
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        checkFit();
        const hashIndex = ids.indexOf(location.hash.slice(1));
        if (hashIndex >= 0) navigate(hashIndex, false, true);
      });
      window.addEventListener('resize', checkFit);
      return () => {
        disposed = true;
        navigation?.kill();
        cancelAnimationFrame(frame);
        document.removeEventListener('click', onAnchor);
        container.removeEventListener('journey-navigate', onNavigate);
        container.removeEventListener('skills-navigate', onSkillsNavigate);
        container.removeEventListener('gallery-navigate', onGalleryNavigate);
        container.removeEventListener('gallery-overlay', onGalleryOverlay);
        const skillsRoot = viewport.querySelector<HTMLElement>('.skills-cinematic');
        if (skillsRoot) resetSkillsState(skillsRoot);
        window.removeEventListener('resize', checkFit);
        trigger.current = null;
        activeRef.current = -1;
        container.classList.remove('journey-enabled');
        viewport.classList.remove('journey-visible');
        scenes.forEach(scene => { scene.inert = false; scene.removeAttribute('aria-hidden'); scene.style.pointerEvents = ''; });
        setCinematic(false);
      };
    });
    return () => media.revert();
  }, [reading]);

  const go = (index: number) => root.current?.dispatchEvent(new CustomEvent('journey-navigate', { detail: index }));
  return <div ref={root} className="journey" aria-label="Portfolio journey">
    <div ref={stage} className="journey-stage" data-scene={ids[active]}>
      {children}
      <div className="journey-controls" hidden={!cinematic}>

        <div className="journey-topline mono"><span>Inside / <span aria-live="polite">{labels[active]}</span></span><button type="button" onClick={() => setReading(true)}>Reading mode ↗</button></div>
        <nav aria-label="Journey scenes" className="journey-navigation">{labels.map((label, i) => <button type="button" key={label} aria-current={i === active ? 'step' : undefined} onClick={() => go(i)}><span className="mono">0{i + 1}</span><span>{label}</span></button>)}</nav>

        <div className="journey-progress"><div className="journey-progress-fill" /></div>
      </div>
    </div>
    {!cinematic && <div className="reading-controls mono"><span>Reading view</span>{reading && <button type="button" onClick={() => { setReading(false); const lenis = getSmoothScroll(); if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo({ top: 0, behavior: 'instant' }); }}>Restart journey ↑</button>}</div>}
  </div>;
}
