'use client';

import { useEffect, useRef } from 'react';

export default function HeroParticleGlobe() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false, disposed = false, loading = false, failed = false;
    let cloud: ReturnType<typeof import('./HeroParticleScene').createHeroParticleScene> | undefined;
    const sync = () => {
      if (reduced.matches) { cloud?.dispose(); cloud = undefined; return; }
      if (cloud) { cloud.setActive(visible && !document.hidden); return; }
      if (!visible || document.hidden || loading || failed || disposed) return;
      loading = true;
      import('./HeroParticleScene').then(({ createHeroParticleScene }) => {
        if (disposed || reduced.matches) return;
        cloud = createHeroParticleScene(element);
        cloud.setActive(visible && !document.hidden);
      }).catch(() => { failed = true; }).finally(() => { loading = false; });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true; observer.disconnect(); cloud?.dispose();
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  return <div ref={host} className="hero-particle-globe" aria-hidden="true" />;
}
