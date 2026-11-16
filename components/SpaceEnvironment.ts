import * as THREE from 'three';

/** Camera travel belongs to the environment; GSAP keeps the HTML scenes readable. */
export function createSpace(host: HTMLElement) {
  const camera = new THREE.PerspectiveCamera(48, 1, .1, 550);
  const world = new THREE.Scene();
  world.background = new THREE.Color('#080909');
  world.fog = new THREE.FogExp2('#080909', .018);
  let renderer: THREE.WebGLRenderer | null = null;
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);
    host.dataset.webgl = 'ready';
  } catch {
    // The HTML scene transitions remain functional without WebGL.
    host.dataset.webgl = 'fallback';
  }
  const lineMaterial = new THREE.LineBasicMaterial({ color: '#7d8b80', transparent: true, opacity: .18 });
  const ringMaterial = new THREE.LineBasicMaterial({ color: '#a4a69a', transparent: true, opacity: .12 });
  materials.push(lineMaterial, ringMaterial);
  const rails: number[] = [];
  for (let i = 0; i < 28; i++) {
    const angle = i / 28 * Math.PI * 2;
    const radius = 21 + Math.sin(i * 2.7) * 2;
    rails.push(Math.cos(angle) * radius * 1.6, Math.sin(angle) * radius, 25,
      Math.cos(angle) * radius * 1.6, Math.sin(angle) * radius, -520);
  }
  const railGeometry = new THREE.BufferGeometry();
  railGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rails, 3));
  geometries.push(railGeometry);
  world.add(new THREE.LineSegments(railGeometry, lineMaterial));
  for (let depth = 0; depth < 520; depth += 16) {
    const points = Array.from({ length: 97 }, (_, i) => {
      const angle = i / 96 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 34, Math.sin(angle) * 21, -depth);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometries.push(geometry);
    world.add(new THREE.Line(geometry, ringMaterial));
  }
  let travel = -75;
  const draw = () => {
    camera.position.set(Math.sin(travel * .004) * .15, 0, -travel);
    camera.updateMatrixWorld();
    renderer?.render(world, camera);
  };
  const resize = () => {
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer?.setSize(width, height, false);
    draw();
  };
  const onLost = (event: Event) => { event.preventDefault(); host.dataset.webgl = 'fallback'; };
  const onRestored = () => { host.dataset.webgl = 'ready'; draw(); };
  renderer?.domElement.addEventListener('webglcontextlost', onLost);
  renderer?.domElement.addEventListener('webglcontextrestored', onRestored);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  return {
    update(value: number) { travel = value; draw(); },
    dispose() {
      observer.disconnect();
      renderer?.domElement.removeEventListener('webglcontextlost', onLost);
      renderer?.domElement.removeEventListener('webglcontextrestored', onRestored);
      geometries.forEach(item => item.dispose());
      materials.forEach(item => item.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
      delete host.dataset.webgl;
    },
  };
}
