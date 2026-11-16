/** Boolean scrub mode can return a falsy non-tween value at runtime. */
export function setScrubPaused(trigger: { getTween: () => unknown } | null | undefined, paused: boolean) {
  const tween = trigger?.getTween();
  if (tween && typeof tween === 'object' && 'paused' in tween && typeof tween.paused === 'function') {
    tween.paused(paused);
  }
}
