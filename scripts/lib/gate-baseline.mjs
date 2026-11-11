/**
 * Shrink-only baseline mechanics shared by the per-element gates, the same
 * rules the color-contrast gate (scripts/lib/contrast.mjs) applies, with the
 * middle level free instead of fixed to light/dark:
 *
 *   { <element or tag>: { <group>: { <key>: count } } }
 *
 * A group is a check name (a HAXSchema check, "dark-ignored", "motion"...)
 * and a key one finding inside it. A finding is new when its key is missing
 * from the baseline or has more occurrences than the baseline lists.
 *
 * - compareToBaseline(results, baseline): new, known and fixed findings for
 *   the elements in results.
 * - baselineGrowth(before, after): what a change to the baseline file adds.
 * - shrinkBaseline(baseline, results, { allowAdditions }): counts only go
 *   down and fixed keys go away; with allowAdditions it only adds.
 * - mergeResults(a, b, pick): combine two runs (Math.min: what both saw).
 * - baselineSize(map): total occurrences listed.
 */

function groupsOf(...maps) {
  const out = new Set();
  for (const m of maps) {
    for (const g of Object.keys(m || {})) {
      out.add(g);
    }
  }
  return [...out].sort();
}

function entriesOf(map) {
  const out = [];
  for (const element of Object.keys(map || {}).sort()) {
    const el = map[element] || {};
    for (const group of groupsOf(el)) {
      const keys = el[group] || {};
      for (const key of Object.keys(keys).sort()) {
        out.push({ element, group, key, count: keys[key] });
      }
    }
  }
  return out;
}

function countIn(map, element, group, key) {
  const g = ((map || {})[element] || {})[group] || {};
  return typeof g[key] === "number" ? g[key] : 0;
}

/** Only elements present in results are compared. */
export function compareToBaseline(results, baseline) {
  const fresh = [];
  const known = [];
  const fixed = [];
  for (const { element, group, key, count } of entriesOf(results)) {
    const before = countIn(baseline, element, group, key);
    (count > before ? fresh : known).push({
      element,
      group,
      key,
      count,
      baseline: before,
    });
  }
  for (const element of Object.keys(results || {}).sort()) {
    for (const { group, key, count } of entriesOf({
      [element]: (baseline || {})[element],
    })) {
      const now = countIn(results, element, group, key);
      if (now < count) {
        fixed.push({ element, group, key, count: now, baseline: count });
      }
    }
  }
  return { fresh, known, fixed };
}

/** entries a new baseline adds or raises compared with the old one */
export function baselineGrowth(before, after) {
  const grown = [];
  for (const { element, group, key, count } of entriesOf(after)) {
    const was = countIn(before, element, group, key);
    if (count > was) {
      grown.push({ element, group, key, count, baseline: was });
    }
  }
  return grown;
}

export function sortBaseline(map) {
  const sorted = {};
  for (const element of Object.keys(map || {}).sort()) {
    const groups = {};
    for (const group of groupsOf(map[element])) {
      const keys = map[element][group];
      const kept = Object.keys(keys || {})
        .filter((k) => keys[k] > 0)
        .sort();
      if (kept.length) {
        groups[group] = {};
        kept.forEach((k) => (groups[group][k] = keys[k]));
      }
    }
    if (Object.keys(groups).length) {
      sorted[element] = groups;
    }
  }
  return sorted;
}

/**
 * Lower the baseline to what results show for the elements in results.
 * With allowAdditions it only adds: new findings are recorded and nothing
 * is lowered or removed.
 */
export function shrinkBaseline(baseline, results, { allowAdditions } = {}) {
  const out = JSON.parse(JSON.stringify(baseline || {}));
  for (const element of Object.keys(results || {})) {
    const was = out[element] || {};
    const now = results[element] || {};
    const next = {};
    for (const group of groupsOf(was, now)) {
      const w = was[group] || {};
      const n = now[group] || {};
      const keys = {};
      if (allowAdditions) {
        Object.assign(keys, w);
        for (const key of Object.keys(n)) {
          keys[key] = Math.max(w[key] || 0, n[key]);
        }
      } else {
        for (const key of Object.keys(w)) {
          const c = Math.min(w[key], n[key] || 0);
          if (c > 0) {
            keys[key] = c;
          }
        }
      }
      next[group] = keys;
    }
    out[element] = next;
  }
  return sortBaseline(out);
}

/** combine two runs of the same elements key by key */
export function mergeResults(a, b, pick) {
  const out = {};
  for (const element of Object.keys(a || {})) {
    if (!(b || {})[element]) {
      continue;
    }
    out[element] = {};
    for (const group of groupsOf(a[element], b[element])) {
      const x = a[element][group] || {};
      const y = b[element][group] || {};
      const keys = {};
      for (const key of new Set([...Object.keys(x), ...Object.keys(y)])) {
        const n = pick(x[key] || 0, y[key] || 0);
        if (n > 0) {
          keys[key] = n;
        }
      }
      out[element][group] = keys;
    }
  }
  return out;
}

/** total occurrences listed in a baseline */
export function baselineSize(map) {
  return entriesOf(map).reduce((n, e) => n + e.count, 0);
}
