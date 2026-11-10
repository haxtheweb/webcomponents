/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Shared helpers for the render benchmarks in this folder. Each benchmark
 * page records two performance measures that tachometer reads:
 *   - "first-render": element(s) created until every Lit element in the
 *     tree has finished updating
 *   - "update": one representative change until the tree settles again
 */

/**
 * every element under `root`, through open shadow roots
 */
function walk(root, out) {
  const nodes = root.querySelectorAll("*");
  for (let i = 0; i < nodes.length; i++) {
    out.push(nodes[i]);
    if (nodes[i].shadowRoot) {
      walk(nodes[i].shadowRoot, out);
    }
  }
  return out;
}

/**
 * Resolve once no Lit element under `root` (including `root` itself) has an
 * update pending. Rendering one element often schedules updates on its
 * children, so this loops until a pass finds nothing pending.
 */
export async function settle(root, maxPasses = 50) {
  for (let pass = 0; pass < maxPasses; pass++) {
    const all = walk(root, [root]);
    const pending = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].isUpdatePending) {
        pending.push(all[i].updateComplete);
      }
    }
    if (pending.length === 0) {
      return;
    }
    await Promise.all(pending);
  }
}

/** next animation frame */
export function frame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * run `fn` and record how long it took (including async work it awaits) as
 * the performance measure `name`
 */
export async function measure(name, fn) {
  const start = name + "-start";
  performance.mark(start);
  await fn();
  performance.measure(name, start);
}

/**
 * The standard benchmark shape: `setup` (not measured), then `firstRender`
 * and `update` measured in that order. Errors are shown on the page and
 * logged, and no measure is recorded, so tachometer times out on a broken
 * benchmark instead of reporting a misleading number.
 */
export async function run({ setup, firstRender, update }) {
  try {
    const ctx = setup ? await setup() : {};
    // let module evaluation and setup finish before timing anything
    await frame();
    await measure("first-render", () => firstRender(ctx));
    await frame();
    await measure("update", () => update(ctx));
  } catch (e) {
    console.error(e);
    const pre = document.createElement("pre");
    pre.textContent = "benchmark failed: " + (e && e.stack ? e.stack : e);
    document.body.appendChild(pre);
  }
}
