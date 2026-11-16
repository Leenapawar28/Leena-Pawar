import gsap from 'gsap';

/** Shared by the pinned journey and the normal document scroll. */
export function createAboutTimeline(root: HTMLElement) {
  const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
  const card = root.querySelector('.about-card-scroll');
  const highlights = root.querySelectorAll('.about-highlights li');
  if (card) timeline.fromTo(card,
    { y: 65, rotationY: -18, rotationX: 8, rotationZ: -4, scale: .92, opacity: 0 },
    { y: 0, rotationY: 0, rotationX: 0, rotationZ: 0, scale: 1, opacity: 1, duration: 2.2, immediateRender: false }, 0);
  if (highlights.length) timeline.fromTo(highlights,
    { y: 38, rotationX: -22, opacity: 0 },
    { y: 0, rotationX: 0, opacity: 1, duration: 1.4, stagger: .3, immediateRender: false }, .6);
  return timeline;
}
