/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * The growth data layer as a model: pure functions over the JSON PRAW
 * publishes at hax.cloud/data/growth/ (haxtheweb/issues#3409). The drawing,
 * the panel and the WebMCP tools all read the same model, so what a person
 * sees and what an agent is told always agree.
 */

export const DAY = 864e5;
/** The growth files, in the order they are fetched. */
export const FILES = ["repos", "themes", "elements", "payload", "series"];
const AX = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

/** Hex distance between two axial cells. */
export function hexDistance(a, b) {
  return (
    (Math.abs(a[0] - b[0]) +
      Math.abs(a[1] - b[1]) +
      Math.abs(a[0] + a[1] - b[0] - b[1])) /
    2
  );
}

/**
 * Place items on a hexagonal lattice, ring by ring from startRing outward,
 * in list order. An item with a `home` takes the free cell nearest to it, so
 * a family grows off its base like a branch.
 */
export function layLattice(list, startRing) {
  const pool = [];
  for (
    let k = Math.max(startRing, 0);
    pool.length < list.length + 6 * k + 6;
    k++
  ) {
    if (k === 0) {
      pool.push([0, 0]);
      continue;
    }
    let q = -k;
    let r = k;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < k; j++) {
        pool.push([q, r]);
        q += AX[i][0];
        r += AX[i][1];
      }
    }
  }
  const used = new Set();
  list.forEach((it) => {
    let pick = null;
    if (it.home) {
      let best = Infinity;
      pool.forEach((c) => {
        if (used.has(c.join())) return;
        const d =
          hexDistance(c, [it.home.q, it.home.r]) * 100 + hexDistance(c, [0, 0]);
        if (d < best) {
          best = d;
          pick = c;
        }
      });
    } else {
      pick = pool.find((c) => !used.has(c.join()));
    }
    used.add(pick.join());
    it.q = pick[0];
    it.r = pick[1];
  });
  let ring = startRing;
  list.forEach((i) => {
    ring = Math.max(ring, Math.abs(i.q), Math.abs(i.r), Math.abs(i.q + i.r));
  });
  return ring;
}

/** Walk steps (each a list of module indexes) and say what each fetches new. */
export function simulate(steps, modules) {
  const have = new Map();
  steps.forEach((step, k) => {
    const fresh = step.set.filter((m) => !have.has(m));
    step.need = step.set.reduce((a, m) => a + modules[m].gz, 0);
    step.fetch = fresh.reduce((a, m) => a + modules[m].gz, 0);
    step.files = step.set.length;
    step.newFiles = fresh.length;
    fresh.forEach((m) => have.set(m, k));
    step.cached = new Set(have.keys());
  });
  return steps;
}

function uniq(lists) {
  const s = new Set();
  lists.forEach((l) => (l || []).forEach((v) => s.add(v)));
  return [...s];
}

/** Everything the views, panel and tools need, from the five growth files. */
export function buildModel(data) {
  const { repos, themes, elements, payload, series } = data;
  const parse = (d) => (d ? Date.parse(d) : NaN);
  const generated = parse(series.meta && series.meta.generated) || Date.now();
  // themes, with the family bases as their own cells
  const list = [];
  const byClass = {};
  themes.themes.forEach((t) => {
    byClass[t.class] = t;
  });
  const bases = themes.familyBases || {};
  Object.keys(bases).forEach((name) => {
    const b = bases[name];
    list.push({
      key: name,
      label: name,
      d: b.appeared,
      T: parse(b.appeared),
      gz: b.gz,
      isBase: true,
      family: (b.path || "").split("/")[1],
      classes: b.classes || [],
    });
  });
  themes.themes.forEach((t) => {
    list.push({
      key: t.tag,
      label: t.tag,
      d: t.appeared,
      T: parse(t.appeared),
      gz: t.gz,
      base: t.base,
      cls: t.class,
      family: t.family,
      cost: payload.themes[t.tag],
    });
  });
  list.forEach((t) => {
    if (t.isBase || !t.base || t.base === "core") return;
    t.home =
      list.find((b) => b.isBase && b.classes.includes(t.base)) ||
      list.find((b) => b.cls === t.base) ||
      null;
  });
  list.sort(
    (a, b) =>
      a.T - b.T ||
      (a.family < b.family ? -1 : a.family > b.family ? 1 : 0) ||
      (a.isBase ? -1 : b.isBase ? 1 : 0) ||
      (a.key < b.key ? -1 : 1),
  );
  const themeRing = layLattice(list, 2);
  // elements: the most depended-on in the middle
  const els = elements.elements.map((e) => ({
    key: e.name,
    label: e.name,
    d: e.appeared,
    T: parse(e.appeared),
    gz: e.gz,
    ddd: e.ddd,
    out: [],
    inn: [],
  }));
  const elBy = {};
  els.forEach((e) => {
    elBy[e.key] = e;
  });
  elements.elements.forEach((e) => {
    e.dependsOn.forEach((d) => {
      if (elBy[d]) {
        elBy[e.name].out.push(elBy[d]);
        elBy[d].inn.push(elBy[e.name]);
      }
    });
  });
  els.sort((a, b) => b.inn.length - a.inn.length || a.T - b.T);
  const elRing = layLattice(els, 0);
  // platforms: properties and runtimes around the shared contract
  const center = repos.repos.find((r) => r.kind === "contract") || null;
  const plats = repos.repos
    .filter((r) => r.kind !== "contract")
    .map((r) => ({
      key: r.key,
      label: r.label,
      url: r.url,
      color: r.color,
      kind: r.kind,
      purpose: r.purpose,
      repo: r.repo,
      d: r.first,
      T: parse(r.first),
      monthly: r.monthly || {},
    }))
    .sort((a, b) => a.T - b.T);
  const platRing = layLattice(plats, 1);
  // cache: every module once, the most shared in the middle
  const mods = payload.modules.map((m, i) => ({
    i,
    gz: m.gz,
    core: m.core,
    path: m.path,
  }));
  const modRing = layLattice(mods, 0);
  const visits = simulate(
    list
      .filter((t) => !t.isBase && t.cost)
      .map((t) => ({ label: t.key, theme: t.key, set: t.cost.modules })),
    mods,
  );
  const elSet = (n) => (payload.elements[n] ? payload.elements[n].modules : []);
  const journey = [];
  payload.journeys.siteBySite.forEach((s, si) => {
    s.pages.forEach((p, pi) => {
      journey.push({
        label: s.site + " · " + p.page,
        site: s.site,
        theme: s.theme,
        page: p.page,
        pi,
        pc: s.pages.length,
        si,
        elements: p.elements,
        next: pi === 0 && si > 0,
        set: uniq(
          [
            payload.themes[s.theme] ? payload.themes[s.theme].modules : [],
            elSet("grid-plate"),
          ].concat(p.elements.map(elSet)),
        ),
      });
    });
  });
  simulate(journey, mods);
  const coreTheme = list.find((t) => !t.isBase && t.base === "core");
  const coreDate = parse(themes.core && themes.core.appeared);
  const ddd = elBy["d-d-d"];
  const months = series.months;
  const T0 = parse(months[0] + "-01");
  return {
    generated,
    T0,
    T1: generated,
    themes: list,
    themeRing,
    els,
    elBy,
    elRing,
    plats,
    platRing,
    center,
    mods,
    modRing,
    visits,
    journey,
    core: payload.core,
    coreDate: isNaN(coreDate) ? (coreTheme ? coreTheme.T : T0) : coreDate,
    dddDate: ddd ? ddd.T : NaN,
    months,
    series: series.series,
    meta: { themes: themes.meta, payload: payload.meta, series: series.meta },
  };
}

/** Commits a platform had up to and including a date. */
export function commitsTo(plat, t) {
  const ym = new Date(t).toISOString().slice(0, 7);
  let s = 0;
  Object.keys(plat.monthly).forEach((k) => {
    if (k <= ym) s += plat.monthly[k];
  });
  return s;
}

/** The median of a list of numbers (0 for none). */
export function median(a) {
  if (!a.length) return 0;
  const s = [...a].sort((p, q) => p - q);
  return s[Math.floor(s.length / 2)];
}

/** What a theme costs to load, given themes already cached on the host. */
export function themeCost(M, tag, cached) {
  const t = M.themes.find((x) => x.key === tag && !x.isBase);
  if (!t) return null;
  const have = new Set();
  (cached || []).forEach((c) => {
    const o = M.themes.find((x) => x.key === c && !x.isBase);
    if (o) o.cost.modules.forEach((m) => have.add(m));
  });
  const need = t.cost.modules;
  const fresh = need.filter((m) => !have.has(m));
  const sum = (l) => l.reduce((a, m) => a + M.mods[m].gz, 0);
  return {
    theme: tag,
    appeared: t.d,
    extends: t.home ? t.home.key : "HAXCMSLitElementTheme",
    ownCodeGz: t.gz,
    coreGz: M.core.gz,
    firstVisitGz: sum(need),
    files: need.length,
    alreadyCachedGz: sum(need) - sum(fresh),
    fetchGz: sum(fresh),
    fetchFiles: fresh.length,
    cachedThemes: (cached || []).filter((c) =>
      M.themes.some((x) => x.key === c && !x.isBase),
    ),
  };
}

/** An element's place in the dependency web. */
export function elementLinks(M, name) {
  const e = M.elBy[name];
  if (!e) return null;
  return {
    element: name,
    package: "@haxtheweb/" + name,
    appeared: e.d,
    mainFileGz: e.gz,
    buildsOnDDD: e.ddd,
    dependsOn: e.out.map((o) => o.key).sort(),
    usedBy: e.inn.map((o) => o.key).sort(),
  };
}

/** One series' values between two months (YYYY-MM), inclusive. */
export function seriesValues(M, key, from, to) {
  const s = M.series.find((x) => x.key === key);
  if (!s) return null;
  const out = [];
  M.months.forEach((m, i) => {
    if ((!from || m >= from) && (!to || m <= to))
      out.push({ month: m, value: s.values[i] });
  });
  return { key, label: s.label, values: out };
}

/**
 * A visitor's journey across sites and pages on one host: each step a site,
 * its theme and the elements its page uses (grid-plate is always added).
 */
export function journeyCost(M, steps, payload) {
  const elSet = (n) => (payload.elements[n] ? payload.elements[n].modules : []);
  const out = steps
    .filter((s) => s && payload.themes[s.theme])
    .map((s) => ({
      label: (s.site || s.theme) + (s.page ? " · " + s.page : ""),
      set: uniq(
        [payload.themes[s.theme].modules, elSet("grid-plate")].concat(
          (s.elements || []).map(elSet),
        ),
      ),
    }));
  simulate(out, M.mods);
  return out.map((s) => ({
    step: s.label,
    needGz: s.need,
    fetchGz: s.fetch,
    fromCacheGz: s.need - s.fetch,
    files: s.files,
    newFiles: s.newFiles,
  }));
}
