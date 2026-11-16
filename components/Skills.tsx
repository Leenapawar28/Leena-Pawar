'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import SkillParticles from './SkillParticles';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { skills } from '@/lib/content';
import { createSkillsTimeline, resetSkillsState, skillAccents, skillMotifs, SKILL_DURATION, SKILL_STEP } from '@/lib/skills-motion';

const icons = [
  ['javascript', 'react', 'angular', 'html5', 'tailwindcss', 'devices'],
  ['nodejs', 'mongodb', 'wordpress', 'api', 'graphql', 'n8n'],
  ['git', 'figma', 'gsap', 'lighthouse', 'search', 'cloud', 'browser'],
];
const generic = new Set(['devices','api','search','cloud','browser']);
function TechIcon({ name }: { name: string }) {
  if (!generic.has(name)) {
    // SVGs are served locally, retaining the original brand artwork and colours.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/icons/${name}.svg`} alt="" width="28" height="28" loading="lazy" />;
  }
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    {name === 'devices' ? <><rect x="3" y="6" width="20" height="15" rx="2" /><path d="M8 27h10m-5-6v6" /><rect x="22" y="14" width="7" height="14" rx="1" /></> :
    name === 'api' ? <><path d="m11 8-7 8 7 8m10-16 7 8-7 8m-3-21-4 26" /></> :
    name === 'search' ? <><circle cx="14" cy="14" r="9" /><path d="m21 21 8 8m-19-13 3-4 3 2 3-5" /></> :
    name === 'cloud' ? <><path d="M9 24H7a5 5 0 0 1-1-10 10 10 0 0 1 19-2 6 6 0 0 1 0 12h-2M16 29V15m-5 5 5-5 5 5" /></> :
    name === 'lighthouse' ? <><path d="m11 29 2-17h6l2 17M10 29h12M12 8h8v4h-8zm0 0 4-5 4 5M3 9l5 1m16 0 5-1M12 22h8" /></> :
    <><rect x="3" y="5" width="26" height="23" rx="3" /><path d="M3 12h26M7 9h1m3 0h1m3 0h1m-6 11 4 4 8-9" /></>}
  </svg>;
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const standalone = useRef<gsap.core.Timeline | null>(null);
  const navigation = useRef<gsap.core.Tween | null>(null);
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const element = root.current;
    const journey = element?.closest<HTMLElement>('.journey');
    if (!element || !journey) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 640px) and (min-width: 768px)', () => {
      let context: gsap.Context | undefined;
      const stop = () => {
        navigation.current?.kill();
        context?.revert();
        context = undefined;
        standalone.current = null;
        element.classList.remove('skills-standalone');
        delete element.dataset.skillsActive;
        resetSkillsState(element, selectedRef.current);
      };
      const sync = () => {
        stop();
        if (journey.classList.contains('journey-enabled')) return;
        context = gsap.context(() => {
          element.classList.add('skills-standalone');
          if (element.scrollHeight > element.clientHeight + 1) {
            element.classList.remove('skills-standalone');
            return;
          }
          const timeline = createSkillsTimeline(element);
          standalone.current = timeline;
          ScrollTrigger.create({ trigger: element, start: 'top top',
            end: () => `+=${window.innerHeight * 7}`, pin: true,
            animation: timeline, scrub: .8, invalidateOnRefresh: true,
            onToggle(self) { element.dataset.skillsActive = String(self.isActive); },
            onRefresh(self) { element.dataset.skillsActive = String(self.isActive); },
          });
        }, element);
      };
      journey.addEventListener('journey-will-enable', stop);
      const frame = requestAnimationFrame(sync);
      const observer = new MutationObserver(sync);
      observer.observe(journey, { attributes: true, attributeFilter: ['class'] });
      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        journey.removeEventListener('journey-will-enable', stop);
        navigation.current?.kill();
        context?.revert();
        standalone.current = null;
        element.classList.remove('skills-standalone');
        delete element.dataset.skillsActive;
        resetSkillsState(element, selectedRef.current);
      };
    });
    media.add('(prefers-reduced-motion: reduce), (max-height: 639px), (max-width: 767px)', () => {
      const frame = requestAnimationFrame(() => resetSkillsState(element, selectedRef.current));
      return () => cancelAnimationFrame(frame);
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (standalone.current || root.current?.closest('.journey-enabled')) return;
    root.current?.querySelectorAll<HTMLElement>('.skills-panel').forEach((panel, i) => {
      panel.inert = i !== selected;
      panel.setAttribute('aria-hidden', String(i !== selected));
    });
  }, [selected]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.mobileVisible = String(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const choose = (index: number) => {
    const element = root.current;
    if (!element) return;
    if (element.closest('.journey-enabled')) {
      element.dispatchEvent(new CustomEvent('skills-navigate', { detail: index, bubbles: true }));
    } else if (standalone.current) {
      const st = standalone.current.scrollTrigger ?? ScrollTrigger.getAll().find(item => item.animation === standalone.current);
      if (!st) return;
      navigation.current?.kill();
      navigation.current = gsap.to(window, { scrollTo: { y: st.start + (st.end - st.start) * ((index * SKILL_STEP + 2.8) / SKILL_DURATION), autoKill: true }, duration: 2.4, ease: 'power2.inOut' });
    } else {
      selectedRef.current = index;
      setSelected(index);
      if (window.innerWidth < 768) element.querySelectorAll<HTMLButtonElement>('.skills-category-progress button')[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  };

  return <section ref={root} id="skills" className="section skills skills-cinematic" data-category={selected}
    style={{ '--active-glow': skillAccents[selected] } as CSSProperties} aria-labelledby="skills-title">
    <div className="section-label"><span>03 / Toolkit</span><span>The right tools. The right details.</span></div>
    <div className="skills-heading-row">
      <h2 id="skills-title">Ideas into<br /><span>working things.</span></h2>
      <nav className="skills-category-progress" aria-label="Skill categories">
        {skills.map((group, i) => <button key={group.name} type="button" aria-current={selected === i ? 'step' : undefined} onClick={() => choose(i)}><span className="mono">0{i + 1}</span><span>{group.name}</span><i /></button>)}
      </nav>
    </div>
    <div className="skills-scene-layout">
      <div className="skills-art" aria-hidden="true">
        <div className="skill-orbit"><div className="orbit-revolve"><i /><i /></div></div>
        <div className="skill-orbit skill-orbit-secondary" />
        <div className="skill-symbol-float"><div className="skill-symbol-tile"><svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{skillMotifs[selected].map((d, i) => <path className="skill-core-path" key={i} d={d} />)}</svg></div></div>
        <SkillParticles />
        <span className="skill-dust dust-one" /><span className="skill-dust dust-two" />
      </div>
      <div className="skills-panels">
        {skills.map((group, i) => <div className="skills-panel" key={group.name} data-panel={i} aria-hidden={selected !== i} inert={selected !== i}>
          <span className="mono skill-category-number">0{i + 1} /</span><h3>{group.name}</h3>
          <ul className="skill-pill-grid">{group.items.map((item, j) => <li className="skill-pill" key={item}><span className="skill-tech-icon"><TechIcon name={icons[i][j]} /></span><span>{item}</span></li>)}</ul>
        </div>)}
      </div>
    </div>
  </section>;
}
