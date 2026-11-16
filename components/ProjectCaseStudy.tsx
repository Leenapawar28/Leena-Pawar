'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { getSmoothScroll } from '@/lib/smooth-scroll';
import type { PortfolioProject } from '@/lib/projects';

export interface SelectedProject { project: PortfolioProject; source: HTMLButtonElement; rect: DOMRect }
export default function ProjectCaseStudy({ selection, onClosed }: { selection: SelectedProject; onClosed: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeAction = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    const savedY = window.scrollY;
    const lenis = getSmoothScroll();
    lenis?.stop();
    const bodyStyle = { overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
    const htmlOverflow = document.documentElement.style.overflow;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (gap) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gap}px`;
    modal.showModal();
    modal.scrollTop = 0;
    const hero = modal.querySelector<HTMLElement>('.case-hero')!;
    const flight = modal.querySelector<HTMLElement>('.case-shared-image')!;
    const content = modal.querySelector<HTMLElement>('.case-content')!;
    const backdrop = modal.querySelector('.case-backdrop');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sourceRect = selection.rect;
    const heroRect = hero.getBoundingClientRect();
    let closing = false;
    let closeTimeline: gsap.core.Timeline | undefined;
    const context = gsap.context(() => {
      gsap.set(flight, { left: sourceRect.left, top: sourceRect.top, width: sourceRect.width, height: sourceRect.height, opacity: 1 });
      gsap.set(hero, { opacity: 0 });
      const open = gsap.timeline();
      open.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : .7 }, 0)
        .fromTo(content, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : .6 }, reduce ? 0 : .35)
        .to(flight, { left: heroRect.left, top: heroRect.top, width: heroRect.width, height: heroRect.height,
          duration: reduce ? 0 : .85, ease: 'power3.inOut' }, 0)
        .set(hero, { opacity: 1 }).set(flight, { opacity: 0 });
      if (!reduce) open.from(modal.querySelectorAll('[data-case-reveal]'), { opacity: 0, y: 18, stagger: .07, duration: .6, ease: 'power2.out' }, .6);
      closeAction.current = () => {
        if (closing) return;
        closing = true;
        const flying = Number(gsap.getProperty(flight, 'opacity')) > .5;
        const currentFlight = flight.getBoundingClientRect();
        open.kill();
        closeTimeline = gsap.timeline({ onComplete: () => { modal.close(); onClosed(); } });
        closeTimeline.to(content, { opacity: 0, duration: reduce ? 0 : .18 })
          .call(() => {
            modal.scrollTop = 0;
            const from = flying ? currentFlight : hero.getBoundingClientRect();
            gsap.set(flight, { left: from.left, top: from.top, width: from.width, height: from.height, opacity: 1 });
            gsap.set(hero, { opacity: 0 });
          })
          .to(flight, { left: () => selection.source.getBoundingClientRect().left,
            top: () => selection.source.getBoundingClientRect().top,
            width: () => selection.source.getBoundingClientRect().width,
            height: () => selection.source.getBoundingClientRect().height,
            duration: reduce ? 0 : .7, ease: 'power3.inOut' })
          .to(backdrop, { opacity: 0, duration: reduce ? 0 : .55 }, reduce ? 0 : .25);
      };
    }, modal);
    modal.querySelector<HTMLButtonElement>('.case-close')?.focus({ preventScroll: true });
    return () => {
      closeTimeline?.kill();
      context.revert();
      if (modal.open) modal.close();
      document.body.style.overflow = bodyStyle.overflow;
      document.body.style.paddingRight = bodyStyle.paddingRight;
      document.documentElement.style.overflow = htmlOverflow;
      if (lenis) {
        lenis.scrollTo(savedY, { immediate: true, force: true });
        lenis.start();
      } else window.scrollTo({ top: savedY, behavior: 'instant' });
      selection.source.focus({ preventScroll: true });
    };
  }, [selection, onClosed]);

  const { project } = selection;
  return createPortal(<dialog ref={dialog} className="case-study-dialog" data-lenis-prevent aria-labelledby="case-title"
    onCancel={event => { event.preventDefault(); closeAction.current(); }}>
    <div className="case-backdrop" onClick={() => closeAction.current()} aria-hidden="true" />
    <div className="case-shared-image" aria-hidden="true"><Image src={project.coverImage} alt="" fill sizes="90vw" /></div>
    <article className="case-content">
      <header className="case-header"><span className="mono">Selected work / {project.id.slice(-2)}</span><button type="button" className="case-close" onClick={() => closeAction.current()} aria-label="Close project case study">Close <span aria-hidden="true">×</span></button></header>
      <div className="case-title-block" data-case-reveal><span className="mono">{project.category}{project.year && ` / ${project.year}`}</span><h2 id="case-title">{project.title}<span>.</span></h2><p>{project.shortDescription}</p></div>
      {(project.industry || project.specialisation || project.projectType || project.status) && <dl className={`case-facts${project.specialisation ? " case-facts-expanded" : ""}`} aria-label="Project information">
        {project.industry && <div><dt>Industry</dt><dd>{project.industry}</dd></div>}
        {project.specialisation && <div><dt>Specialisation</dt><dd>{project.specialisation}</dd></div>}
        {project.projectType && <div><dt>Project type</dt><dd>{project.projectType}</dd></div>}
        {project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}
      </dl>}
      <div className="case-hero" style={project.imageAspectRatio ? { aspectRatio: project.imageAspectRatio } : undefined}><Image src={project.coverImage} alt={`${project.title} corporate website design and development showcase`}  fill sizes="(max-width: 767px) 90vw, 85vw" /></div>
      <div className="case-overview" data-case-reveal><span className="mono">01 / Overview</span><p>{project.fullDescription}</p></div>
      {project.objective && <section className="case-overview" data-case-reveal aria-labelledby="case-objective"><h3 id="case-objective" className="mono">02 / Project objective</h3><p>{project.objective}</p></section>}
      {project.designApproach && <section className="case-overview" data-case-reveal aria-labelledby="case-approach"><h3 id="case-approach" className="mono">03 / Design approach</h3><p>{project.designApproach}</p></section>}
      <div className="case-details" data-case-reveal>
        <div><span className="mono">{project.objective ? '04' : '02'} / My role</span><h3>{project.role}</h3><ul>{project.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>
        <div>
          {project.keyFeatures ? <><h3 className="mono">05 / Key features</h3><ul className="case-feature-list">{project.keyFeatures.map(feature => <li key={feature}>{feature}</li>)}</ul></> : <><span className="mono">03 / Technology</span><ul className="case-technologies">{project.technologies.map(item => <li key={item}>{item}</li>)}</ul></>}
          {project.projectUrl && <a className="case-live" href={project.projectUrl} target="_blank" rel="noreferrer">View Live Website ↗</a>}
        </div>
      </div>
      <div className="case-screenshots">{project.galleryImages.map((src, i) => <figure key={`${src}-${i}`}><Image src={src} alt={project.galleryCaptions?.[i] || `${project.title} concept screen ${i + 1}`} width={1440} height={900} sizes="(max-width: 767px) 90vw, 85vw" /><figcaption className="mono">{project.galleryCaptions?.[i] || `Concept screen / 0${i + 1}`}</figcaption></figure>)}</div>
      <footer className="case-footer"><span className="mono">{project.title} / End of case study</span><button type="button" onClick={() => closeAction.current()}>Back to gallery ↗</button></footer>
    </article>
  </dialog>, document.body);
}
