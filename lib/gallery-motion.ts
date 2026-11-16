import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from './projects';
export const GALLERY_DURATION = Math.max(10, projects.length * 2 + 4);
export const GALLERY_LEAD = 1.5;
export const GALLERY_TRAVEL = GALLERY_DURATION - 4;
export const galleryTime = (progress: number) => GALLERY_LEAD + Math.max(0, Math.min(1, progress)) * GALLERY_TRAVEL;
export function galleryPose(distance: number) {
  const depth = Math.min(Math.abs(distance), 3);
  return { rotation: -Math.max(-2, Math.min(2, distance)) * 11,
    scale: 1 - Math.min(depth * .075, .2), opacity: 1 - Math.min(depth * .17, .52), z: -depth * 48 };
}
export function createGalleryDriver(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('.gallery-track')!;
  const panels = Array.from(root.querySelectorAll<HTMLElement>('.gallery-panel'));
  const surfaces = panels.map(panel => panel.querySelector<HTMLElement>('.gallery-surface')!);
  const counter = root.querySelector('.gallery-current');
  const title = root.querySelector('.gallery-selected-title');
  const category = root.querySelector('.gallery-selected-category');
  const fill = root.querySelector<HTMLElement>('.gallery-progress-fill');
  let active = -1;
  let step = 1;
  const measure = () => {
    step = (panels[1]?.offsetLeft ?? 0) - (panels[0]?.offsetLeft ?? 0) || panels[0]?.offsetWidth || 1;
  };
  measure();
  const render = (value: number) => {
    const progress = Math.max(0, Math.min(1, value));
    const position = progress * (panels.length - 1);
    const native = root.dataset.galleryMode === 'native';
    root.dataset.galleryProgress = String(progress);
    if (!native) track.style.transform = `translate3d(${-position * step}px,0,0)`;
    panels.forEach((panel, i) => {
      const distance = i - position;
      const pose = galleryPose(distance);
      surfaces[i].style.transform = `translateZ(${pose.z}px) rotateY(${pose.rotation}deg) scale(${pose.scale})`;
      surfaces[i].style.opacity = String(pose.opacity);
      panel.inert = !native && Math.abs(distance) > 2.5;
      const button = panel.querySelector<HTMLButtonElement>('.gallery-image-button');
      if (button) button.tabIndex = native || i === Math.round(position) ? 0 : -1;
    });
    const next = Math.round(position);
    if (next !== active) {
      active = next;
      if (counter) counter.textContent = String(next + 1).padStart(2, '0');
      if (title) title.textContent = projects[next]?.title ?? '';
      if (category) category.textContent = projects[next]?.category ?? '';
      root.dataset.activeProject = String(next);
    }
    if (fill) fill.style.transform = `scaleX(${progress})`;
  };
  return { render, measure, travel: () => step * (panels.length - 1) };
}
export function createGalleryTimeline(root: HTMLElement) {
  root.dataset.galleryMode = 'journey';
  const windowEl = root.querySelector<HTMLElement>('.gallery-window');
  if (windowEl) windowEl.scrollLeft = 0;
  const driver = createGalleryDriver(root);
  const playhead = { progress: 0 };
  driver.render(0);
  const timeline = gsap.timeline({ onUpdate: () => driver.render(playhead.progress) });
  const refresh = () => { driver.measure(); driver.render(playhead.progress); };
  gsap.context(() => {
    ScrollTrigger.addEventListener('refresh', refresh);
    return () => ScrollTrigger.removeEventListener('refresh', refresh);
  });
  timeline.to(playhead, { progress: 1, duration: GALLERY_TRAVEL, ease: 'none' }, GALLERY_LEAD);
  timeline.to({}, { duration: 1 }, GALLERY_DURATION - 1);
  return timeline;
}
