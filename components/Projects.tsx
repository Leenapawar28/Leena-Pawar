'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { projects } from '@/lib/projects';
import { createGalleryDriver, createGalleryTimeline, GALLERY_DURATION, galleryTime } from '@/lib/gallery-motion';
import ProjectCaseStudy, { type SelectedProject } from './ProjectCaseStudy';

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const standalone = useRef<ScrollTrigger | null>(null);
  const driver = useRef<ReturnType<typeof createGalleryDriver> | null>(null);
  const navigation = useRef<gsap.core.Tween | null>(null);
  const refreshFrame = useRef<number | null>(null);
  const drag = useRef({ x: 0, progress: 0, left: 0, pointer: -1, moved: false });
  const [selection, setSelection] = useState<SelectedProject | null>(null);
  const close = useCallback(() => {
    standalone.current?.getTween()?.resume();
    root.current?.dispatchEvent(new CustomEvent('gallery-overlay', { detail: false, bubbles: true }));
    setSelection(null);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const element = root.current;
    const journey = element?.closest<HTMLElement>('.journey');
    if (!element || !journey) return;
    const media = gsap.matchMedia();
    let context: gsap.Context | undefined;
    let frame = 0;
    const stop = () => {
      navigation.current?.kill();
      context?.revert(); context = undefined;
      standalone.current = null;
      element.classList.remove('gallery-standalone');
      element.querySelectorAll<HTMLElement>('.gallery-panel').forEach(panel => { panel.inert = false; });
    };
    media.add({ always: 'all', desktop: '(min-width: 768px) and (min-height: 640px)', reduced: '(prefers-reduced-motion: reduce)' }, match => {
      const sync = () => {
        stop();
        const animated = match.conditions?.desktop && !match.conditions?.reduced;
        element.dataset.galleryMode = animated ? (journey.classList.contains('journey-enabled') ? 'journey' : 'standalone') : 'native';
        driver.current = createGalleryDriver(element);
        if (!animated) {
          element.querySelector<HTMLElement>('.gallery-track')!.style.transform = '';
          const windowEl = element.querySelector<HTMLElement>('.gallery-window')!;
          driver.current.render(windowEl.scrollLeft / (windowEl.scrollWidth - windowEl.clientWidth || 1));
          return;
        }
        if (journey.classList.contains('journey-enabled')) return;
        context = gsap.context(() => {
          element.classList.add('gallery-standalone');
          const timeline = createGalleryTimeline(element);
          element.dataset.galleryMode = 'standalone';
          standalone.current = ScrollTrigger.create({ trigger: element, start: 'top top', end: () => `+=${window.innerHeight * 10}`,
            pin: true, animation: timeline, scrub: .8, invalidateOnRefresh: true });
        }, element);
      };
      const observer = new MutationObserver(sync);
      observer.observe(journey, { attributes: true, attributeFilter: ['class'] });
      journey.addEventListener('journey-will-enable', stop);
      frame = requestAnimationFrame(sync);
      const refresh = () => {
        driver.current?.measure();
        driver.current?.render(Number(element.dataset.galleryProgress || 0));
      };
      ScrollTrigger.addEventListener('refresh', refresh);
      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        journey.removeEventListener('journey-will-enable', stop);
        ScrollTrigger.removeEventListener('refresh', refresh);
        stop();
      };
    });
    return () => {
      media.revert(); driver.current = null;
      if (refreshFrame.current !== null) cancelAnimationFrame(refreshFrame.current);
    };
  }, []);

  const move = (progress: number, immediate = false) => {
    const element = root.current;
    if (!element) return;
    progress = Math.max(0, Math.min(1, progress));
    if (element.dataset.galleryMode === 'journey') {
      element.dispatchEvent(new CustomEvent('gallery-navigate', { detail: { progress, immediate }, bubbles: true }));
    } else if (standalone.current) {
      const st = standalone.current;
      const y = st.start + (st.end - st.start) * galleryTime(progress) / GALLERY_DURATION;
      navigation.current?.kill();
      navigation.current = gsap.to(window, { scrollTo: { y, autoKill: true }, duration: immediate ? .18 : 1.4, ease: 'power2.out', overwrite: 'auto' });
    } else {
      const windowEl = element.querySelector<HTMLElement>('.gallery-window')!;
      windowEl.scrollTo({ left: progress * (windowEl.scrollWidth - windowEl.clientWidth), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  };
  const openProject = (project: typeof projects[number], source: HTMLButtonElement) => {
    navigation.current?.kill();
    standalone.current?.getTween()?.pause();
    root.current?.dispatchEvent(new CustomEvent('gallery-overlay', { detail: true, bubbles: true }));
    setSelection({ project, source, rect: source.getBoundingClientRect() });
  };
  const step = (direction: number) => move((Number(root.current?.dataset.activeProject || 0) + direction) / (projects.length - 1));
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag.current = { x: event.clientX, progress: Number(root.current?.dataset.galleryProgress || 0), left: event.currentTarget.scrollLeft, pointer: event.pointerId, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointer !== event.pointerId) return;
    const delta = event.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(delta) < 6) return;
    drag.current.moved = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    if (root.current?.dataset.galleryMode === 'native') event.currentTarget.scrollLeft = drag.current.left - delta;
    else move(drag.current.progress - delta / (driver.current?.travel() || 1), true);
  };
  const release = (event: PointerEvent<HTMLDivElement>) => {
    drag.current.pointer = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const refreshImages = () => {
    // Image boxes have explicit aspect ratios; coalesce refreshes after loading.
    if (!root.current || root.current.dataset.refreshQueued) return;
    root.current.dataset.refreshQueued = 'true';
    refreshFrame.current = requestAnimationFrame(() => {
      refreshFrame.current = null;
      if (!root.current) return;
      delete root.current.dataset.refreshQueued;
      ScrollTrigger.refresh();
    });
  };

  return <section ref={root} id="work" className="section work project-gallery" data-gallery-mode="native" aria-labelledby="work-title">
    <div className="gallery-heading"><div className="section-label"><span>04 / Selected work</span><span>Space for the stories behind the build</span></div><div className="gallery-title-row"><h2 id="work-title">Work, in focus.</h2><p>Case studies are being curated.<br />A considered selection, coming soon.</p></div></div>
    <div className="gallery-window" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={release} onPointerCancel={release}
      onDragStart={event => event.preventDefault()} onClickCapture={event => { if (drag.current.moved && event.detail > 0) { drag.current.moved = false; event.preventDefault(); event.stopPropagation(); } }}
      onScroll={event => { if (root.current?.dataset.galleryMode === 'native') driver.current?.render(event.currentTarget.scrollLeft / (event.currentTarget.scrollWidth - event.currentTarget.clientWidth || 1)); }}>
      <div className="gallery-track">{projects.map((project, i) => <article key={project.id} className="gallery-panel" aria-label={`${project.title}, ${i + 1} of ${projects.length}`}><div className="gallery-surface">
        <button className="gallery-image-button" type="button" aria-label={`View ${project.title} case study`} onClick={event => openProject(project, event.currentTarget)}>
          <Image src={project.coverImage} alt={`${project.title}: ${project.category} concept artwork`} fill sizes="(max-width: 767px) 78vw, 32vw" draggable={false} onLoad={refreshImages} />
          <span className="gallery-view">View Project ↗</span>
        </button><span className="gallery-reflection" style={{ backgroundImage: `url('${project.coverImage}')` }} aria-hidden="true" />
      </div></article>)}</div>
    </div>
    <div className="gallery-meta"><div><span className="mono gallery-selected-category">{projects[0].category}</span><h3 className="gallery-selected-title">{projects[0].title}</h3></div><div className="gallery-actions"><span className="mono"><span className="gallery-current">01</span> / {projects.length}</span><button type="button" aria-label="Previous project" onClick={() => step(-1)}>←</button><button type="button" aria-label="Next project" onClick={() => step(1)}>→</button></div><div className="gallery-progress" aria-hidden="true"><div className="gallery-progress-fill" /></div></div>
    {selection && <ProjectCaseStudy selection={selection} onClosed={close} />}
  </section>;
}
