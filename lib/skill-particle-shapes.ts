import { skillMotifs } from './skills-motion';

/** Deterministic particles along the exact existing SVG contours, with a little depth. */
export function createSkillParticleData(count: number) {
  let seed = 417;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const contours = skillMotifs.map(motif => motif.map(d => {
    const values = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    return Array.from({ length: values.length / 2 }, (_, i) => [values[i * 2], values[i * 2 + 1]]);
  }));
  const scatter = new Float32Array(count * 3);
  const shapes = Array.from({ length: 3 }, () => new Float32Array(count * 3));
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const stroke = i % 3;
    const along = random() * 46.999;
    const segment = Math.floor(along);
    const t = along - segment;
    const jitterX = (random() - .5) * 2.1;
    const jitterY = (random() - .5) * 2.1;
    const depth = (random() - .5) * .11;
    seeds[i] = random();
    scatter[i * 3] = (random() - .5) * 3.1;
    scatter[i * 3 + 1] = (random() - .5) * 2.85;
    scatter[i * 3 + 2] = (random() - .5) * 2.3;
    for (let shape = 0; shape < 3; shape++) {
      const a = contours[shape][stroke][segment];
      const b = contours[shape][stroke][segment + 1];
      shapes[shape][i * 3] = (a[0] + (b[0] - a[0]) * t + jitterX - 48) / 48 * 1.25;
      shapes[shape][i * 3 + 1] = -(a[1] + (b[1] - a[1]) * t + jitterY - 48) / 48 * 1.25;
      shapes[shape][i * 3 + 2] = depth;
    }
  }
  return { scatter, shapes, seeds };
}
