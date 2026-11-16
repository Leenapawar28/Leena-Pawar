import * as THREE from 'three';

export function createHeroParticleScene(host: HTMLElement) {
  const compact = window.matchMedia('(max-width:767px)').matches;
  const count = compact ? 1400 : 3000;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i + .5) / count * 2;
    const r = Math.sqrt(1 - y * y), angle = i * goldenAngle;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    seeds[i] = (i * .61803398875) % 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const ratio = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5);
  const uniforms = { uTime: { value: 0 }, uGather: { value: 0 }, uRatio: { value: ratio } };
  const material = new THREE.ShaderMaterial({ uniforms, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aSeed;
      uniform float uTime, uGather, uRatio;
      varying float vAlpha;
      void main() {
        float angle = uTime * .065;
        mat2 turn = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec3 p = position;
        p.xz = turn * p.xz;
        float gather = smoothstep(aSeed * .2, 1.0, uGather);
        p *= 1.0 + (1.0 - gather) * (.18 + aSeed * .35);
        p += position * sin(uTime * .5 + aSeed * 50.0) * .006;
        float rim = smoothstep(.65, .91, length(p.xy));
        vAlpha = rim * (.3 + .5 * aSeed) * gather;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.0 + aSeed * 1.3) * uRatio;
      }`,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float edge = max(abs(gl_PointCoord.x-.5),abs(gl_PointCoord.y-.5));
        float alpha = (1.0-smoothstep(.2,.5,edge))*vAlpha;
        if(alpha < .025) discard;
        gl_FragColor=vec4(.92,.65,.36,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' }); }
  catch (error) { geometry.dispose(); material.dispose(); throw error; }
  renderer.setPixelRatio(ratio); renderer.setClearColor(0, 0); host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, .1, 20); camera.position.z = 5;
  scene.add(new THREE.Points(geometry, material));
  let active = false, desired = false, lost = false, disposed = false, frame = 0, previous = 0;
  const tick = (time: number) => {
    frame = 0; if (!active || disposed || lost) return;
    const dt = previous ? Math.min((time - previous) / 1000, .05) : 0; previous = time;
    uniforms.uTime.value += dt; uniforms.uGather.value = Math.min(1, uniforms.uGather.value + dt / 2.8);
    renderer.render(scene, camera); frame = requestAnimationFrame(tick);
  };
  const setActive = (value: boolean) => {
    desired = value; if (disposed || active === value) return;
    active = value; previous = 0;
    if (value && !lost) frame = requestAnimationFrame(tick);
    else { cancelAnimationFrame(frame); frame = 0; }
  };
  const resize = () => {
    const width = host.clientWidth || 400, height = host.clientHeight || 400;
    camera.left = -1.2 * width / height; camera.right = 1.2 * width / height;
    camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
  };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const onLost = (event: Event) => { event.preventDefault(); lost = true; active = false; cancelAnimationFrame(frame); frame = 0; };
  const onRestored = () => { lost = false; setActive(desired); };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  renderer.domElement.addEventListener('webglcontextrestored', onRestored);
  return { setActive, dispose() {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    renderer.domElement.removeEventListener('webglcontextlost', onLost);
    renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
    geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  } };
}
