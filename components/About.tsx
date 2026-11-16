'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createAboutTimeline } from '@/lib/about-motion';
import Image from 'next/image';
import BrandMark from './BrandMark';
import PortraitParticles from './PortraitParticles';
import { profile } from '@/lib/content';

function AboutIcon({ type }: { type: 'code' | 'layers' | 'location' }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'code' ? <path d="m10 8-7 8 7 8m12-16 7 8-7 8m-4-21-4 26" /> : type === 'layers' ? <><path d="m16 3 13 7-13 7L3 10l13-7Zm-13 14 13 7 13-7M3 23l13 7 13-7" /></> : <><path d="M26 13c0 8-10 16-10 16S6 21 6 13a10 10 0 1 1 20 0Z" /><circle cx="16" cy="13" r="3.5" /></>}
  </svg>;
}
export default function About() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      // The pinned journey owns its timeline; native scrolling gets its own reveal.
      let reveal: gsap.core.Timeline | undefined;
      const sync = () => {
        reveal?.scrollTrigger?.kill();
        reveal?.revert();
        reveal = undefined;
        if (!element.closest('.journey-enabled')) {
          reveal = createAboutTimeline(element);
          ScrollTrigger.create({ animation: reveal, trigger: element,
            start: 'top 85%', end: 'bottom 70%', scrub: .65 });
        }
      };
      const journey = element.closest('.journey');
      const observer = new MutationObserver(sync);
      if (journey) observer.observe(journey, { attributes: true, attributeFilter: ['class'] });
      sync();
      return () => { observer.disconnect(); reveal?.scrollTrigger?.kill(); reveal?.revert(); };
    });
    media.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      const card = element.querySelector<HTMLElement>('.about-portrait-card');
      if (!card) return;
      const tiltX = gsap.quickTo(card, '--tilt-x', { duration: .5, ease: 'power2.out' });
      const tiltY = gsap.quickTo(card, '--tilt-y', { duration: .5, ease: 'power2.out' });
      const move = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        tiltX((.5 - (event.clientY - bounds.top) / bounds.height) * 10);
        tiltY(((event.clientX - bounds.left) / bounds.width - .5) * 12);
      };
      const reset = () => { tiltX(0); tiltY(0); };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', reset);
      card.addEventListener('blur', reset);
      return () => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', reset);
        card.removeEventListener('blur', reset);
        gsap.killTweensOf(card);
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      };
    });
    return () => media.revert();
  }, []);
  return <section ref={root} id="about" className="about section light" aria-labelledby="about-title">
    <div className="section-label"><span>01 / About me</span><span>A person behind the pixels</span></div>
    <div className="about-grid">
      <div className="about-lead">
        <div className="about-heading-wrap"><h2 id="about-title">Built with care.<br /><span className="muted about-tagline">Made for people.</span></h2>
          <svg className="about-heading-orbit" viewBox="0 0 800 350" fill="none" aria-hidden="true"><defs><linearGradient id="about-orbit-light"><stop stopColor="#c49a73" stopOpacity="0" /><stop offset=".6" stopColor="#f8ca91" stopOpacity=".65" /><stop offset="1" stopColor="#f8ca91" stopOpacity=".05" /></linearGradient></defs><path d="M20 315C190 260 720 180 760 85C792 24 675 39 615 48" stroke="url(#about-orbit-light)" strokeWidth="1.5" /><circle cx="760" cy="85" r="3" fill="#ffe1b7" /></svg>
        </div>
        <div className="about-card-scroll"><figure className="portrait-placeholder about-identity-card about-portrait-card" tabIndex={0} aria-label="Leena Pawar portrait">
          <PortraitParticles />
          <figcaption className="about-portrait-copy"><BrandMark className="portrait-monogram" /><p className="about-portrait-name">Leena Pawar</p><span className="mono">Full Stack Developer</span></figcaption>
          <div className="about-portrait-image"><Image src="/images/leena-pawar-portrait.png" alt="Leena Pawar in a navy blue blazer" fill sizes="(max-width: 767px) 55vw, 28vw" /></div>
        </figure><span className="about-card-caption mono">01 / The person behind the work <span aria-hidden="true">↗</span></span></div>
      </div>
      <div className="about-copy">
        <span className="mono overline">Hello, I’m Leena.</span>
        <p>{profile.introduction}</p>
        <ul className="about-highlights" aria-label="Experience highlights">
          <li><span className="about-highlight-icon"><AboutIcon type="code" /></span><div><strong>4+ Years</strong><span className="mono">Experience</span></div></li>
          <li><span className="about-highlight-icon"><AboutIcon type="layers" /></span><div><strong>15+ Projects</strong><span className="mono">Delivered</span></div></li>
          <li><span className="about-highlight-icon"><AboutIcon type="location" /></span><div><strong>Mumbai, India</strong><span className="mono">Based in</span></div></li>
        </ul>
        <div className="about-actions"><a className="text-link" href="/leena-pawar-cv.pdf" download>Download CV <span aria-hidden="true">↗</span></a><a className="about-journey-link" href="#experience"><span className="about-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m8 5 11 7-11 7V5Z" /></svg></span>My Journey</a></div>
      </div>
    </div>
  </section>;
}
