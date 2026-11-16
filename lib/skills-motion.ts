import gsap from 'gsap';

export const SKILL_STEP = 7;
export const SKILL_DURATION = SKILL_STEP * 3;
// One restrained bronze accent across every category and section.
export const skillAccents = ['#C49A73', '#C49A73', '#C49A73'];
type Point = [number, number];
// All three symbols use the same sampled line commands, allowing true path
// interpolation without an extra morphing plugin or a canvas render loop.
function path(points: Point[]) {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);
  return Array.from({ length: 48 }, (_, i) => {
    let distance = total * i / 47;
    let segment = 0;
    while (segment < lengths.length - 1 && distance > lengths[segment]) distance -= lengths[segment++];
    const t = lengths[segment] ? distance / lengths[segment] : 0;
    const a = points[segment], b = points[segment + 1];
    return `${i ? 'L' : 'M'}${(a[0] + (b[0] - a[0]) * t).toFixed(2)},${(a[1] + (b[1] - a[1]) * t).toFixed(2)}`;
  }).join(' ');
}
const ellipse = (cx: number, cy: number, rx: number, ry: number, from = 0, to = Math.PI * 2): Point[] =>
  Array.from({ length: 33 }, (_, i) => [cx + Math.cos(from + (to - from) * i / 32) * rx, cy + Math.sin(from + (to - from) * i / 32) * ry]);
export const skillMotifs = [
  [path([[31,31],[14,48],[31,65]]), path([[57,22],[42,74]]), path([[65,31],[82,48],[65,65]])],
  [path(ellipse(48,29,26,10)), path([[22,29],[22,66],...ellipse(48,66,26,10,Math.PI,0),[74,29]]), path(ellipse(48,48,26,10,0,Math.PI))],
  [path([[44,20],[51,40],[70,48],[51,56],[44,77],[37,56],[18,48],[37,40],[44,20]]), path([[74,14],[77,23],[86,26],[77,29],[74,38],[71,29],[62,26],[71,23],[74,14]]), path([[74,62],[78,67],[83,71],[78,75],[74,80],[70,75],[65,71],[70,67],[74,62]])],
];

export function resetSkillsState(root: HTMLElement, index = 0) {
  root.dataset.category = String(index);
  root.querySelectorAll<HTMLElement>('.skills-panel').forEach((panel, i) => {
    panel.inert = i !== index;
    panel.setAttribute('aria-hidden', String(i !== index));
  });
  root.querySelectorAll<HTMLElement>('.skills-category-progress button').forEach((button, i) => {
    if (i === index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
}

export function createSkillsTimeline(root: HTMLElement) {
  const panels = Array.from(root.querySelectorAll<HTMLElement>('.skills-panel'));
  const paths = root.querySelectorAll('.skill-core-path');
  const orbit = root.querySelector('.skill-orbit');
  let active = -1;
  const timeline = gsap.timeline({ onUpdate() {
    const index = Math.min(2, Math.floor(timeline.time() / SKILL_STEP));
    if (active === index) return;
    active = index;
    resetSkillsState(root, index);
  } });
  resetSkillsState(root);
  gsap.set(root, { '--active-glow': skillAccents[0], '--particle-morph': 0 });
  paths.forEach((node, i) => gsap.set(node, { attr: { d: skillMotifs[0][i] } }));
  gsap.set(panels, { autoAlpha: 0 });
  panels.forEach((panel, i) => {
    const at = i * SKILL_STEP;
    timeline.fromTo(panel, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0,
      duration: 1, ease: 'sine.inOut', immediateRender: false }, at + .1);
    timeline.fromTo(panel.querySelectorAll('.skill-pill'), { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 1, stagger: { amount: .45 }, ease: 'power2.out', immediateRender: false }, at + .35);
    if (i) {
      timeline.to(root, { '--particle-morph': i, duration: 1.45, ease: 'sine.inOut' }, at - .5);
      paths.forEach((node, j) => timeline.to(node, { attr: { d: skillMotifs[i][j] },
        duration: 1.45, ease: 'sine.inOut' }, at - .5));
      timeline.to(orbit, { rotateZ: -24 + i * 22, scaleX: 1 - i * .04, scaleY: 1 + i * .08,
        duration: 1.45, ease: 'sine.inOut' }, at - .5);
    }
    if (i < 2) timeline.to(panel, { autoAlpha: 0, y: -10, duration: .8, ease: 'sine.inOut' }, at + SKILL_STEP - .9);
  });
  // Keep the complete last category readable before Projects begins.
  timeline.to({}, { duration: 1 }, SKILL_DURATION - 1);
  return timeline;
}
