import type Lenis from 'lenis';

// One scroll owner shared by the page, scene navigation and project dialog.
let instance: Lenis | undefined;
export function getSmoothScroll() { return instance; }
export function setSmoothScroll(value: Lenis | undefined) { instance = value; }
