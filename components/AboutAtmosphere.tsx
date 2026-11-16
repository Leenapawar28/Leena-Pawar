'use client';

import Image from 'next/image';
import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';

/** Original artwork, gently displaced as one liquid surface. */
export default function AboutAtmosphere() {
  const root = useRef<HTMLDivElement>(null);
  const filterId = `bronze-liquid-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const stage = element.closest<HTMLElement>('.journey-stage');
    const journey = element.closest<HTMLElement>('.journey');
    let inView = false;
    let liquid: gsap.core.Timeline | undefined;
    const update = () => {
      const active = !journey?.classList.contains('journey-enabled') ||
        (stage?.dataset.scene === 'about' && stage.classList.contains('journey-visible'));
      const moving = inView && active && !document.hidden;
      element.dataset.moving = String(moving);
      if (moving) liquid?.resume();
      else liquid?.pause();
    };
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      liquid = gsap.timeline({ repeat: -1, yoyo: true, paused: true,
        defaults: { duration: 10, ease: 'sine.inOut' } })
        .to(element.querySelector('feTurbulence'), { attr: { baseFrequency: '.0028 .0042' } }, 0)
        .to(element.querySelector('feDisplacementMap'), {
          attr: { scale: window.innerWidth < 768 ? 30 : 52 },
        }, 0);
      update();
      return () => { liquid = undefined; };
    });
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    const sceneObserver = new MutationObserver(update);
    observer.observe(element);
    if (stage) sceneObserver.observe(stage, { attributes: true, attributeFilter: ['class', 'data-scene'] });
    if (journey) sceneObserver.observe(journey, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      sceneObserver.disconnect();
      document.removeEventListener('visibilitychange', update);
      media.revert();
    };
  }, []);

  return <div ref={root} className="about-atmosphere" aria-hidden="true">
    <svg className="liquid-filter-defs" width="0" height="0" focusable="false">
      <defs>
        <filter id={filterId} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".0017 .003" numOctaves="1" seed="8" result="flow" />
          <feDisplacementMap in="SourceGraphic" in2="flow" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <div className="about-orbits" />
    <div className="bronze-perspective">
      <div className="bronze-float">
        <div className="bronze-liquid" style={{ filter: `url(#${filterId})` }}>
          <Image className="bronze-artwork" src="/images/bronze-blob.png" alt=""
            width={1672} height={941} sizes="(max-width: 767px) 150vw, 110vw" />
          <div className="bronze-currents"><i /><i /><i /></div>
        </div>
      </div>
    </div>
    <div className="bronze-readability" />
  </div>;
}
