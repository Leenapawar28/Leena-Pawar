'use client';

import { useEffect, useRef } from 'react';

type Cloud = ReturnType<typeof import('./PortraitParticleCloud').createPortraitParticleCloud>;
export default function PortraitParticles({ sceneId = 'about' }: { sceneId?: 'about' | 'experience' }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    const root = element?.closest<HTMLElement>(`#${sceneId}`);
    const stage = root?.closest<HTMLElement>('.journey-stage');
    const journey = root?.closest<HTMLElement>('.journey');
    if (!element || !root || !stage || !journey) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cloud: Cloud | undefined;
    let visible = false, loading = false, failed = false, disposed = false, revision = 0;
    const isActive = () => visible && !document.hidden && !motion.matches &&
      (!journey.classList.contains('journey-enabled') || (stage.classList.contains('journey-visible') && stage.dataset.scene === sceneId));
    const sync = () => {
      if (motion.matches) {
        revision++;
        cloud?.dispose(); cloud = undefined;
        return;
      }
      if (cloud) { cloud.setActive(isActive()); return; }
      if (!isActive() || loading || failed) return;
      loading = true;
      const version = ++revision;
      import('./PortraitParticleCloud').then(({ createPortraitParticleCloud }) => {
        if (disposed || motion.matches || version !== revision) return;
        cloud = createPortraitParticleCloud(element);
        cloud.setActive(isActive());
      }).catch(() => { failed = true; }).finally(() => {
        loading = false;
        if (!disposed && !cloud && !failed && isActive()) sync();
      });
    };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const scenes = new MutationObserver(sync);
    intersection.observe(element);
    scenes.observe(stage, { attributes: true, attributeFilter: ['class', 'data-scene'] });
    scenes.observe(journey, { attributes: true, attributeFilter: ['class'] });
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true; revision++;
      intersection.disconnect(); scenes.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      cloud?.dispose();
    };
  }, [sceneId]);
  return <div ref={host} className="portrait-particle-host" aria-hidden="true" />;
}
