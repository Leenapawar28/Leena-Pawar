'use client';

import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setSmoothScroll } from '@/lib/smooth-scroll';

export default function SmoothScroll() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({
        lerp: .065,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        prevent: node => node.classList.contains('case-study-dialog') || node.classList.contains('mobile-nav'),
      });
      setSmoothScroll(lenis);
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const resize = () => lenis.resize();
      ScrollTrigger.addEventListener('refresh', resize);
      // Journey handles pinned scene links. Handle the remaining anchors after it.
      const onAnchor = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
        if (!link || link.hasAttribute('download') || link.target === '_blank') return;
        const target = document.getElementById(link.hash.slice(1));
        if (!target) return;
        event.preventDefault();
        history.replaceState(null, '', link.hash);
        lenis.scrollTo(target, { offset: target.id === 'home' ? 0 : -110 });
      };
      window.addEventListener('click', onAnchor);
      return () => {
        window.removeEventListener('click', onAnchor);
        ScrollTrigger.removeEventListener('refresh', resize);
        gsap.ticker.remove(tick);
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
        setSmoothScroll(undefined);
      };
    });
    return () => media.revert();
  }, []);
  return null;
}
