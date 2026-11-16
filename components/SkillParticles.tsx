'use client';

import { useEffect, useRef } from 'react';

type Cloud = ReturnType<typeof import('./SkillParticleCloud').createSkillParticleCloud>;
export default function SkillParticles() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    const root = element?.closest<HTMLElement>('.skills-cinematic');
    const stage = root?.closest<HTMLElement>('.journey-stage');
    const journey = root?.closest<HTMLElement>('.journey');
    if (!element || !root || !stage || !journey) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cloud: Cloud | undefined;
    let visible = false, loading = false, failed = false, disposed = false, revision = 0;
    const isActive = () => visible && !document.hidden && !motion.matches &&
      (!journey.classList.contains('journey-enabled') || (stage.classList.contains('journey-visible') && stage.dataset.scene === 'skills'));
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
      import('./SkillParticleCloud').then(({ createSkillParticleCloud }) => {
        if (disposed || motion.matches || version !== revision) return;
        cloud = createSkillParticleCloud(element, root);
        cloud.setActive(isActive());
      }).catch(() => { failed = true; }).finally(() => {
        loading = false;
        if (!disposed && !cloud && !failed && isActive()) sync();
      });
    };
    const onCategory = () => { cloud?.setCategory(Number(root.dataset.category || 0)); sync(); };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const scenes = new MutationObserver(sync);
    const category = new MutationObserver(onCategory);
    intersection.observe(element);
    scenes.observe(stage, { attributes: true, attributeFilter: ['class', 'data-scene'] });
    scenes.observe(journey, { attributes: true, attributeFilter: ['class'] });
    category.observe(root, { attributes: true, attributeFilter: ['data-category', 'class'] });
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true; revision++;
      intersection.disconnect(); scenes.disconnect(); category.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      cloud?.dispose();
    };
  }, []);
  return <div ref={host} className="skill-particle-host" aria-hidden="true" />;
}
