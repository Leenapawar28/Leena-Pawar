import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../lib/scrub-motion.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { setScrubPaused } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('opening and closing a project works without a scrub tween', () => {
  for (const value of [undefined, null, false, 0, {}]) {
    assert.doesNotThrow(() => setScrubPaused({ getTween: () => value }, true));
    assert.doesNotThrow(() => setScrubPaused({ getTween: () => value }, false));
  }
  assert.doesNotThrow(() => setScrubPaused(null, true));
});

test('numeric scrub mode pauses and resumes the existing tween', () => {
  const tween = { state: false, paused(value) { this.state = value; } };
  const trigger = { getTween: () => tween };
  setScrubPaused(trigger, true);
  assert.equal(tween.state, true);
  setScrubPaused(trigger, false);
  assert.equal(tween.state, false);
});
