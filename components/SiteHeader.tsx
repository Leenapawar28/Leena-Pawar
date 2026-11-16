'use client';

import { useEffect, useRef, useState } from 'react';
import BrandMark from './BrandMark';

export default function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const pinned = document.querySelector<HTMLElement>('.journey-enabled .journey-visible');
      if (pinned) { setActive(pinned.dataset.scene || ''); return; }
      let current = '';
      for (const id of ['about', 'experience', 'skills', 'work', 'contact']) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= window.innerHeight * .4) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Scene changes can finish after the last scroll event.
    const observer = new MutationObserver(schedule);
    const journeyStage = document.querySelector('.journey-stage');
    if (journeyStage) observer.observe(journeyStage, { attributes: true, attributeFilter: ['class', 'data-scene'] });
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    const onOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const onHash = () => setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside, { passive: true });
    window.addEventListener('hashchange', onHash);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      window.removeEventListener('hashchange', onHash);
    };
  }, [open]);
  return <header ref={header} className="site-header">
    <a className="wordmark" href="#home" aria-label="Leena Pawar home" onClick={() => setOpen(false)}><BrandMark /></a>
    <nav className="desktop-nav" aria-label="Main navigation"><a href="#about" aria-current={active === 'about' ? 'location' : undefined}>About</a><a href="#experience" aria-current={active === 'experience' ? 'location' : undefined}>Experience</a><a href="#work" aria-current={active === 'work' ? 'location' : undefined}>Work</a></nav>
    <a className="header-contact" href="/contact" onClick={() => setOpen(false)}>Let’s talk <span aria-hidden="true">↗</span></a>
    <button ref={menuButton} type="button" className="mobile-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '−' : '+'}</span></button>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
      {[['About', 'about'], ['Experience', 'experience'], ['Skills', 'skills'], ['Work', 'work'], ['Contact', 'contact']].map(([label, id]) => <a key={id} href={id === 'contact' ? '/contact' : `#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}
    </nav>
  </header>;
}
