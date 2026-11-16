'use client';
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Motion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px) and (min-height: 640px)' }, match => {
      if (!match.conditions?.motion) return;
      const hero = document.querySelector<HTMLElement>('.hero-journey');
      const portal = document.querySelector<HTMLElement>('.portal');
      if (!hero || !portal) return;
      // Entrance and scroll own separate wrappers, so their transforms never compete.
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.eyebrow', { opacity: 0, y: 12, duration: .7 }, .15)
        .from('.name-line', { yPercent: 115, duration: 1.1, stagger: .17 }, .35)
        .from('.portal-entrance', { scale: .9, opacity: 0, duration: 1.5 }, .3)
        .from('.hero-intro', { opacity: 0, y: 14, duration: .8 }, 1.1)
        .from('.hero-bottom, .hero-index', { opacity: 0, duration: .8 }, 1.35);

      if (!match.conditions?.desktop) {
        gsap.utils.toArray<HTMLElement>('.journey .section').forEach(section => {
          gsap.from(section, { autoAlpha: 0, y: 16, duration: .7, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', once: true } });
        });
        return;
      }
      hero.classList.add('hero-motion');
      gsap.set(portal, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, force3D: false });
      const travel = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero, start: 'top top', end: () => `+=${window.innerHeight * 2.4}`,
          pin: '.hero-stage', pinSpacing: true, scrub: true, invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });
      travel.fromTo(portal, { scale: 1 }, { scale: 1.15, duration: 1.2, immediateRender: false }, 0)
        .to('.hero-copy, .hero-bottom, .hero-index', { autoAlpha: 0, y: -20, duration: .7 }, .9)
        .fromTo(portal, { x: 0, y: 0 }, { x: () => window.innerWidth / 2 - portal.offsetLeft,
          y: () => window.innerHeight / 2 - portal.offsetTop,
          duration: 1.2, ease: 'power1.inOut', immediateRender: false }, 1.3)
        // Blackout completes the dive without rasterizing an enormous masked image.
        .fromTo(portal, { scale: 1.15 }, {
          scale: () => Math.max(2, Math.max(window.innerWidth, window.innerHeight) / portal.clientWidth * 3),
          duration: 1.8, ease: 'power2.in', immediateRender: false }, 1.5)
        .to('.portal-blackout', { opacity: 1, duration: .55 }, 2.75)
        // A full black beat hides the handoff to the existing About scene.
        .to('.hero-stage', { autoAlpha: 0, duration: .55 }, 3.5);
      return () => {
        travel.scrollTrigger?.kill();
        hero.classList.remove('hero-motion');
      };
    });
    return () => media.revert();
  }, []);
  return null;
}
