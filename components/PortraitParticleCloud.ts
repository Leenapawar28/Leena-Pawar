import * as THREE from 'three';

/** A light point-cloud frame; its transparent centre leaves the portrait readable. */
export function createPortraitParticleCloud(host: HTMLElement) {
  const compact = window.matchMedia('(max-width: 767px)').matches;
  const count = compact ? 600 : 1100;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const offsets = new Float32Array(count * 3);
  let seed = 849;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    seeds[i] = random();
    offsets[i * 3] = (random() - .5) * 95;
    offsets[i * 3 + 1] = (random() - .5) * 75;
    offsets[i * 3 + 2] = (random() - .5) * 35;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const ratio = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5);
  const uniforms = { uTime: { value: 0 }, uGather: { value: 0 }, uHover: { value: 0 }, uRatio: { value: ratio } };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aOffset;
      attribute float aSeed;
      uniform float uTime, uGather, uHover, uRatio;
      varying float vLight;
      void main() {
        float gather = smoothstep(aSeed * .25, 1.0, uGather);
        vec3 p = position + aOffset * (1.0 - gather);
        p.xy += vec2(sin(uTime * .7 + aSeed * 62.8), cos(uTime * .55 + aSeed * 62.8)) * (.5 + uHover * .65);
        p.z += sin(uTime * .4 + aSeed * 32.0) * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.0 + aSeed * 1.25 + uHover * .35) * uRatio;
        vLight = .3 + .45 * pow(.5 + .5 * sin(uTime * .8 + aSeed * 62.8), 3.0);
      }`,
    fragmentShader: `
      varying float vLight;
      void main() {
        float edge = max(abs(gl_PointCoord.x - .5), abs(gl_PointCoord.y - .5));
        float alpha = (1.0 - smoothstep(.2, .5, edge)) * vLight;
        if(alpha < .02) discard;
        gl_FragColor = vec4(vec3(.84, .60, .34), alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch (error) { geometry.dispose(); material.dispose(); throw error; }
  renderer.setPixelRatio(ratio);
  renderer.setClearColor(0, 0);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 500);
  camera.position.z = 200;
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  let active = false, desired = false, disposed = false, lost = false, hover = false;
  let frame = 0, previous = 0;
  const tick = (time: number) => {
    frame = 0;
    if (!active || disposed || lost) return;
    const dt = previous ? Math.min((time - previous) / 1000, .05) : 0;
    previous = time;
    uniforms.uTime.value += dt;
    uniforms.uGather.value = Math.min(1, uniforms.uGather.value + dt / 2.4);
    uniforms.uHover.value += ((hover ? 1 : 0) - uniforms.uHover.value) * Math.min(1, dt * 4);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  const setActive = (value: boolean) => {
    desired = value;
    if (disposed || value === active) return;
    active = value; previous = 0;
    if (active && !lost) frame = requestAnimationFrame(tick);
    else { cancelAnimationFrame(frame); frame = 0; }
  };
  const resize = () => {
    const width = host.clientWidth || 400, height = host.clientHeight || 300;
    const w = width / 2 - 3, h = height / 2 - 3, radius = Math.min(20, w, h);
    const straightX = 2 * (w - radius), straightY = 2 * (h - radius), arc = Math.PI * radius / 2;
    const lengths = [straightX, arc, straightY, arc, straightX, arc, straightY, arc];
    const perimeter = lengths.reduce((a, b) => a + b, 0);
    for (let i = 0; i < count; i++) {
      let d = i / count * perimeter, segment = 0;
      while (segment < 7 && d > lengths[segment]) d -= lengths[segment++];
      let x = 0, y = 0;
      if (segment === 0) { x = -w + radius + d; y = h; }
      else if (segment === 2) { x = w; y = h - radius - d; }
      else if (segment === 4) { x = w - radius - d; y = -h; }
      else if (segment === 6) { x = -w; y = -h + radius + d; }
      else {
        const corner = (segment - 1) / 2;
        const angle = Math.PI / 2 - corner * Math.PI / 2 - d / radius;
        x = (corner < 2 ? w - radius : -w + radius) + Math.cos(angle) * radius;
        y = (corner === 0 || corner === 3 ? h - radius : -h + radius) + Math.sin(angle) * radius;
      }
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = 0;
    }
    geometry.attributes.position.needsUpdate = true;
    camera.left = -width / 2; camera.right = width / 2;
    camera.top = height / 2; camera.bottom = -height / 2;
    camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
  };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const card = host.parentElement!;
  const enter = () => { hover = true; }, leave = () => { hover = false; };
  const onLost = (event: Event) => { event.preventDefault(); lost = true; active = false; cancelAnimationFrame(frame); frame = 0; };
  const onRestored = () => { lost = false; setActive(desired); };
  card.addEventListener('pointerenter', enter); card.addEventListener('pointerleave', leave);
  card.addEventListener('focusin', enter); card.addEventListener('focusout', leave);
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  renderer.domElement.addEventListener('webglcontextrestored', onRestored);
  return { setActive, dispose() {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave);
    card.removeEventListener('focusin', enter); card.removeEventListener('focusout', leave);
    renderer.domElement.removeEventListener('webglcontextlost', onLost);
    renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
    geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  } };
}
