import * as THREE from 'three';
import { createSkillParticleData } from '@/lib/skill-particle-shapes';

/** One draw call, no textures, bloom, lights, or per-frame particle buffer uploads. */
export function createSkillParticleCloud(host: HTMLElement, root: HTMLElement) {
  const compact = window.matchMedia('(max-width: 767px)').matches;
  const data = createSkillParticleData(compact ? 1000 : 2200);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(data.scatter, 3));
  geometry.setAttribute('aShape0', new THREE.BufferAttribute(data.shapes[0], 3));
  geometry.setAttribute('aShape1', new THREE.BufferAttribute(data.shapes[1], 3));
  geometry.setAttribute('aShape2', new THREE.BufferAttribute(data.shapes[2], 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5);
  const uniforms = { uMorph: { value: Number(root.dataset.category || 0) }, uGather: { value: 0 },
    uTime: { value: 0 }, uPixelRatio: { value: pixelRatio }, uColor: { value: new THREE.Color('#d6ad7b') } };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aShape0;
      attribute vec3 aShape1;
      attribute vec3 aShape2;
      attribute float aSeed;
      uniform float uMorph;
      uniform float uGather;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vLight;
      void main() {
        vec3 icon = mix(aShape0, aShape1, clamp(uMorph, 0.0, 1.0));
        icon = mix(icon, aShape2, clamp(uMorph - 1.0, 0.0, 1.0));
        float gathering = smoothstep(aSeed * 0.24, 1.0, uGather);
        float burst = sin(fract(clamp(uMorph, 0.0, 2.0)) * 3.14159265) * 0.82;
        float spread = max(1.0 - gathering, burst);
        vec3 p = mix(icon, position, spread);
        float phase = aSeed * 62.83;
        p.x += sin(uTime * 0.45 + phase) * 0.008;
        p.y += cos(uTime * 0.36 + phase) * 0.009;
        p.z += sin(uTime * 0.3 + phase) * 0.015;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.1 + aSeed * 1.2) * uPixelRatio;
        vLight = 0.58 + aSeed * 0.42;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vLight;
      void main() {
        float edge = max(abs(gl_PointCoord.x - 0.5), abs(gl_PointCoord.y - 0.5));
        float alpha = (1.0 - smoothstep(0.28, 0.5, edge)) * vLight * 0.86;
        if (alpha < 0.03) discard;
        gl_FragColor = vec4(mix(uColor, vec3(1.0, 0.86, 0.65), vLight * 0.22), alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2, 2, 1.65, -1.65, .1, 30);
  camera.position.z = 6;
  const cloud = new THREE.Points(geometry, material);
  cloud.frustumCulled = false;
  scene.add(cloud);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
  } catch (error) {
    geometry.dispose(); material.dispose();
    throw error;
  }
  const art = host.closest<HTMLElement>('.skills-art')!;
  const pointer = { x: 0, y: 0 };
  let active = false, desiredActive = false, lost = false, disposed = false;
  let frame = 0, previousTime = 0;
  let morphFrom = uniforms.uMorph.value, morphTarget = morphFrom, morphTime = 2;
  const driven = () => Boolean(root.closest('.journey-enabled') || root.classList.contains('skills-standalone'));
  const render = () => {
    renderer.render(scene, camera);
    art.dataset.particles = 'ready';
  };
  const tick = (time: number) => {
    frame = 0;
    if (!active || lost || disposed) return;
    const dt = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    uniforms.uTime.value += dt;
    uniforms.uGather.value = Math.min(1, uniforms.uGather.value + dt / 2.2);
    if (driven()) uniforms.uMorph.value = Number(root.style.getPropertyValue('--particle-morph') || root.dataset.category || 0);
    else {
      morphTime = Math.min(2, morphTime + dt);
      const t = morphTime / 2;
      const eased = t * t * (3 - 2 * t);
      uniforms.uMorph.value = morphFrom + (morphTarget - morphFrom) * eased;
    }
    cloud.rotation.y += ((Math.sin(uniforms.uTime.value * .16) * .08 + pointer.x * .12) - cloud.rotation.y) * .06;
    cloud.rotation.x += ((Math.sin(uniforms.uTime.value * .13) * .035 - pointer.y * .08) - cloud.rotation.x) * .06;
    render();
    frame = requestAnimationFrame(tick);
  };
  const setActive = (value: boolean) => {
    desiredActive = value;
    if (value === active || disposed) return;
    active = value;
    previousTime = 0;
    if (value && !lost) { if (!frame) frame = requestAnimationFrame(tick); }
    else { cancelAnimationFrame(frame); frame = 0; }
  };
  const resize = () => {
    const width = host.clientWidth || 300, height = host.clientHeight || 250;
    camera.left = -1.65 * width / height; camera.right = 1.65 * width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (active && !lost) render();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const rect = art.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - .5;
    pointer.y = (event.clientY - rect.top) / rect.height - .5;
  };
  const onLeave = () => { pointer.x = 0; pointer.y = 0; };
  const onLost = (event: Event) => {
    event.preventDefault(); lost = true; active = false;
    cancelAnimationFrame(frame); frame = 0;
    delete art.dataset.particles;
  };
  const onRestored = () => { lost = false; setActive(desiredActive); };
  art.addEventListener('pointermove', onMove, { passive: true });
  art.addEventListener('pointerleave', onLeave);
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  renderer.domElement.addEventListener('webglcontextrestored', onRestored);
  resize();
  return {
    setActive,
    setCategory(index: number) {
      if (driven()) return;
      morphFrom = uniforms.uMorph.value;
      morphTarget = Math.max(0, Math.min(2, index));
      morphTime = 0;
    },
    dispose() {
      disposed = true; active = false;
      cancelAnimationFrame(frame); resizeObserver.disconnect();
      art.removeEventListener('pointermove', onMove);
      art.removeEventListener('pointerleave', onLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss();
      renderer.domElement.remove(); delete art.dataset.particles;
    },
  };
}
