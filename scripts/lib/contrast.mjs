/**
 * Node side of the color-contrast gate (scripts/contrast-check.mjs): the
 * parts that do not need a browser, so they can be unit tested.
 *
 * - targetKey(target): a stable key for an axe node target. axe gives a
 *   selector path (one string per shadow root crossed); positions
 *   (:nth-child / :nth-of-type) and digits are dropped so a demo that gains a
 *   paragraph, or an element with a generated id, keeps the same key.
 * - countViolations(axeViolations): { key: number of nodes } for one demo in
 *   one mode. Nodes that share a key are counted, so a key can not hide a
 *   second failing node.
 * - compareToBaseline(results, baseline): new findings (a key missing from
 *   the baseline, or more nodes than it lists), known ones and fixed ones.
 * - baselineGrowth(before, after): what a change to the baseline file adds.
 *   The baseline may only shrink.
 * - shrinkBaseline(baseline, results): the baseline with fixed findings
 *   removed and counts lowered, never raised.
 * - mergeResults(a, b, pick): combine two runs of the same demos key by key
 *   (Math.min keeps what both runs saw, Math.max what either saw), so a
 *   finding that depends on load timing neither fails a build nor leaves
 *   the baseline by chance.
 *
 * Baseline shape: { elements: { <element>: { light|dark: { <key>: count } } } }
 */

export const MODES = ["light", "dark"];

/** stable key for one axe node target */
export function targetKey(target) {
  const parts = [];
  const walk = (t) => {
    if (Array.isArray(t)) {
      t.forEach(walk);
    } else if (typeof t === "string") {
      parts.push(t);
    }
  };
  walk(target);
  return parts
    .map((sel) =>
      sel
        .replace(/:nth-(child|of-type|last-child|last-of-type)\([^)]*\)/g, "")
        .replace(/\d+/g, "N")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .join(" >> ");
}

/** axe violations (color-contrast only) to { key: count } */
export function countViolations(violations) {
  const counts = {};
  for (const v of violations || []) {
    if (!v || v.id !== "color-contrast") {
      continue;
    }
    for (const node of v.nodes || []) {
      const key = targetKey(node.target);
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return counts;
}

function entriesOf(map) {
  const out = [];
  for (const element of Object.keys(map || {}).sort()) {
    for (const mode of MODES) {
      const keys = (map[element] || {})[mode] || {};
      for (const key of Object.keys(keys).sort()) {
        out.push({ element, mode, key, count: keys[key] });
      }
    }
  }
  return out;
}

function countIn(map, element, mode, key) {
  const el = (map || {})[element] || {};
  const m = el[mode] || {};
  return typeof m[key] === "number" ? m[key] : 0;
}

/**
 * results and baseline: { element: { mode: { key: count } } }.
 * Only elements present in results are compared.
 */
export function compareToBaseline(results, baseline) {
  const fresh = [];
  const known = [];
  const fixed = [];
  for (const { element, mode, key, count } of entriesOf(results)) {
    const before = countIn(baseline, element, mode, key);
    if (count > before) {
      fresh.push({ element, mode, key, count, baseline: before });
    } else {
      known.push({ element, mode, key, count, baseline: before });
    }
  }
  for (const element of Object.keys(results || {}).sort()) {
    for (const { mode, key, count } of entriesOf({
      [element]: (baseline || {})[element],
    })) {
      const now = countIn(results, element, mode, key);
      if (now < count) {
        fixed.push({ element, mode, key, count: now, baseline: count });
      }
    }
  }
  return { fresh, known, fixed };
}

/** entries a new baseline adds or raises compared with the old one */
export function baselineGrowth(before, after) {
  const grown = [];
  for (const { element, mode, key, count } of entriesOf(after)) {
    const was = countIn(before, element, mode, key);
    if (count > was) {
      grown.push({ element, mode, key, count, baseline: was });
    }
  }
  return grown;
}

/**
 * Lower the baseline to what results show for the elements in results:
 * counts only go down and fixed keys are removed. With allowAdditions it
 * only adds: new findings are recorded and nothing is lowered or removed.
 */
export function shrinkBaseline(baseline, results, { allowAdditions } = {}) {
  const out = JSON.parse(JSON.stringify(baseline || {}));
  for (const element of Object.keys(results || {})) {
    const next = {};
    for (const mode of MODES) {
      const now = (results[element] || {})[mode] || {};
      const keys = {};
      const was = (out[element] || {})[mode] || {};
      if (allowAdditions) {
        Object.assign(keys, was);
        for (const key of Object.keys(now)) {
          keys[key] = Math.max(was[key] || 0, now[key]);
        }
      } else {
        for (const key of Object.keys(was)) {
          const n = Math.min(was[key], now[key] || 0);
          if (n > 0) {
            keys[key] = n;
          }
        }
      }
      if (Object.keys(keys).length) {
        next[mode] = keys;
      }
    }
    if (Object.keys(next).length) {
      out[element] = next;
    } else {
      delete out[element];
    }
  }
  return sortBaseline(out);
}

export function sortBaseline(map) {
  const sorted = {};
  for (const element of Object.keys(map || {}).sort()) {
    const modes = {};
    for (const mode of MODES) {
      const keys = (map[element] || {})[mode];
      if (keys && Object.keys(keys).length) {
        modes[mode] = {};
        for (const key of Object.keys(keys).sort()) {
          modes[mode][key] = keys[key];
        }
      }
    }
    if (Object.keys(modes).length) {
      sorted[element] = modes;
    }
  }
  return sorted;
}

/** combine two runs: { element: { mode: { key: count } } } */
export function mergeResults(a, b, pick) {
  const out = {};
  for (const element of Object.keys(a || {})) {
    if (!(b || {})[element]) {
      continue;
    }
    out[element] = {};
    for (const mode of MODES) {
      const x = a[element][mode] || {};
      const y = b[element][mode] || {};
      const keys = {};
      for (const key of new Set([...Object.keys(x), ...Object.keys(y)])) {
        const n = pick(x[key] || 0, y[key] || 0);
        if (n > 0) {
          keys[key] = n;
        }
      }
      out[element][mode] = keys;
    }
  }
  return out;
}

/** total nodes listed in a baseline */
export function baselineSize(map) {
  return entriesOf(map).reduce((n, e) => n + e.count, 0);
}
