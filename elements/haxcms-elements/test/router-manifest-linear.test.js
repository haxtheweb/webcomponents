import { expect } from "@open-wc/testing";
import { varGet } from "@haxtheweb/utils/lib/object-path.js";
import { store, iconFromPageType } from "../lib/core/haxcms-site-store.js";

// store.routerManifest was O(n^2) or worse (~97ms at 500 items). It is now
// O(n). These tests pin that the output is identical to the previous
// implementation, which is kept here verbatim as the reference.

function legacyRouterManifest() {
  const manifest = this.manifest;
  if (manifest && typeof manifest.items !== "undefined") {
    let manifestItems = manifest.items.map((i) => {
      let parentLocation = null;
      let parentSlug = null;
      let parent = manifest.items.find((d) => i.parent === d.id);
      if (parent) {
        parentLocation = parent.location;
        parentSlug = parent.slug;
      }
      let metadata = i.metadata;
      let location = i.location;
      let slug = i.slug;
      if (metadata && metadata.pageType && !metadata.icon) {
        i.metadata.icon = iconFromPageType(metadata.pageType);
      }
      return Object.assign({}, i, {
        parentLocation: parentLocation,
        parentSlug: parentSlug,
        location: location,
        slug: slug,
        metadata: metadata,
      });
    });
    const setChildren = (item, data) => {
      const children = data.filter((d) => item.id === d.parent);
      item.children = children;
      if (item.children.length > 0) {
        item.children.forEach((child) => setChildren(child, data));
      }
    };
    manifestItems.forEach((item) => setChildren(item, manifestItems));
    if (
      varGet(manifest, "metadata.site.settings.publishPagesOn", true) === true
    ) {
      const filterHiddenParentsRecursive = (item) => {
        if (item.metadata && item.metadata.published === false) {
          return false;
        }
        const parent = manifestItems.find((i) => i.id === item.parent);
        if (parent) {
          return filterHiddenParentsRecursive(parent);
        }
        return true;
      };
      if (!this.showUnpublished) {
        const keep = {};
        if (this.previewMode && this.previewKeepId) {
          let current = manifestItems.find((i) => i.id === this.previewKeepId);
          while (current && !keep[current.id]) {
            keep[current.id] = true;
            const parentId = current.parent;
            current = manifestItems.find((i) => i.id === parentId);
          }
        }
        manifestItems = manifestItems.filter(
          (i) => keep[i.id] || filterHiddenParentsRecursive(i),
        );
      }
    }
    return Object.assign({}, manifest, { items: manifestItems });
  }
  return undefined;
}

const current = Object.getOwnPropertyDescriptor(
  Object.getPrototypeOf(store),
  "routerManifest",
).get;
// the store getters routerManifest reads; showUnpublished as the store
// computes it (logged in and not previewing)
const run = (fn, manifest, isLoggedIn, preview) =>
  fn.call({
    manifest,
    isLoggedIn,
    previewMode: !!preview,
    previewKeepId: preview ? preview.keepId : null,
    showUnpublished: isLoggedIn && !preview,
  });

// a deterministic generator (no Math.random)
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function generate(seed, count, opts = {}) {
  const r = lcg(seed);
  const items = [];
  for (let n = 0; n < count; n++) {
    const parentPick =
      n === 0 || r() < 0.15 ? null : items[Math.floor(r() * items.length)].id;
    const metadata = {};
    if (opts.unpublished && r() < 0.12) metadata.published = false;
    if (opts.pageTypes && r() < 0.3)
      metadata.pageType = ["lesson", "assessment", "glossary", "unknown-type"][
        Math.floor(r() * 4)
      ];
    if (opts.pageTypes && r() < 0.1) metadata.icon = "icons:star";
    const item = {
      id:
        opts.duplicateIds && r() < 0.05 && n > 1
          ? items[n - 1].id
          : `item-${seed}-${n}`,
      title: `Item ${n}`,
      slug: `slug-${n}`,
      location: `pages/${n}/index.html`,
      order: n,
      indent: 0,
      parent: opts.missingParents && r() < 0.05 ? "does-not-exist" : parentPick,
    };
    if (!(opts.noMetadata && r() < 0.1)) item.metadata = metadata;
    // keep the data acyclic: the previous implementation overflowed on cycles
    if (item.parent === item.id) item.parent = null;
    if (item.parent && opts.duplicateIds) {
      // a duplicate id can make an item its own ancestor through the first
      // match; walk up and drop the parent if it loops back
      const seen = new Set([item.id]);
      let p = item.parent;
      while (p) {
        if (seen.has(p)) {
          item.parent = null;
          break;
        }
        seen.add(p);
        const up = items.find((x) => x.id === p);
        p = up ? up.parent : null;
      }
    }
    items.push(item);
  }
  // shuffle so parents can come after children
  if (opts.shuffle) {
    for (let n = items.length - 1; n > 0; n--) {
      const j = Math.floor(r() * (n + 1));
      [items[n], items[j]] = [items[j], items[n]];
    }
  }
  return {
    id: "site",
    title: "Site",
    metadata: {
      site: { settings: { publishPagesOn: opts.publishOff ? false : true } },
    },
    items,
  };
}

// compare structure: every field, children by identity of position
function serialize(result) {
  if (!result) return result;
  const index = new Map(result.items.map((it, n) => [it, n]));
  return JSON.stringify({
    ...result,
    items: result.items.map((it) => ({
      ...it,
      children: it.children.map((c) =>
        index.has(c) ? `#${index.get(c)}` : `?${c.id}`,
      ),
    })),
  });
}

function expectSame(manifest, isLoggedIn, preview) {
  const a = JSON.parse(JSON.stringify(manifest));
  const b = JSON.parse(JSON.stringify(manifest));
  const legacy = run(legacyRouterManifest, a, isLoggedIn, preview);
  const next = run(current, b, isLoggedIn, preview);
  expect(serialize(next)).to.equal(serialize(legacy));
  // the icon side effect on the source items happens the same way
  expect(JSON.stringify(b.items)).to.equal(JSON.stringify(a.items));
  return { legacy, next };
}

describe("store.routerManifest (linear)", () => {
  const cases = [
    ["plain outline", {}],
    ["unpublished items, logged out", { unpublished: true }],
    ["page types (icon side effect)", { pageTypes: true }],
    ["missing parents", { missingParents: true }],
    ["items without metadata", { noMetadata: true, unpublished: true }],
    ["parents after children", { shuffle: true, unpublished: true }],
    ["duplicate ids", { duplicateIds: true, unpublished: true }],
    ["publish option off", { publishOff: true, unpublished: true }],
  ];
  for (const [name, opts] of cases) {
    for (const loggedIn of [false, true]) {
      it(`matches the previous output: ${name}, ${loggedIn ? "logged in" : "logged out"}`, () => {
        for (const seed of [1, 7, 42]) {
          expectSame(generate(seed, 120, opts), loggedIn);
        }
      });
    }
  }

  it("matches while previewing: the starting page and its parents stay", () => {
    for (const seed of [1, 7, 42]) {
      const manifest = generate(seed, 120, { unpublished: true });
      // a few unpublished pages as the page preview started on, plus one
      // published page and an id that is not in the outline
      const unpublished = manifest.items.filter(
        (i) => i.metadata && i.metadata.published === false,
      );
      const keepIds = unpublished
        .slice(0, 3)
        .map((i) => i.id)
        .concat([manifest.items[5].id, "not-in-outline"]);
      keepIds.forEach((keepId) => {
        const { next } = expectSame(manifest, true, { keepId });
        if (keepId !== "not-in-outline") {
          expect(next.items.some((i) => i.id === keepId)).to.equal(true);
        }
      });
      expectSame(manifest, true, { keepId: null });
    }
  });

  it("matches for a 500-item, 3-level course", () => {
    const items = [];
    for (let m = 0; m < 20; m++) {
      items.push({
        id: `m${m}`,
        parent: null,
        title: `M${m}`,
        slug: `m${m}`,
        location: `p/m${m}`,
        metadata: m % 7 === 3 ? { published: false } : {},
      });
      for (let l = 0; l < 4; l++) {
        items.push({
          id: `m${m}l${l}`,
          parent: `m${m}`,
          title: `L${l}`,
          slug: `m${m}l${l}`,
          location: `p/m${m}l${l}`,
          metadata: { pageType: "lesson" },
        });
        for (let p = 0; p < 5; p++) {
          items.push({
            id: `m${m}l${l}p${p}`,
            parent: `m${m}l${l}`,
            title: `P${p}`,
            slug: `m${m}l${l}p${p}`,
            location: `p/m${m}l${l}p${p}`,
            metadata: {},
          });
        }
      }
    }
    const manifest = { id: "s", metadata: {}, items };
    expectSame(manifest, false);
    expectSame(manifest, true);
  });

  it("returns undefined without items, like before", () => {
    expect(run(current, undefined, false)).to.equal(undefined);
    expect(run(current, { id: "x" }, false)).to.equal(undefined);
  });

  it("gives every item a fresh children array made of the new item objects", () => {
    const manifest = generate(3, 60, {});
    const out = run(current, manifest, true);
    const set = new Set(out.items);
    out.items.forEach((it) => {
      expect(Array.isArray(it.children)).to.equal(true);
      it.children.forEach((c) => expect(set.has(c)).to.equal(true));
    });
    // new objects, not the store's
    expect(out.items[0]).to.not.equal(manifest.items[0]);
  });

  it("does not overflow on an item that is its own ancestor (previously: stack overflow)", () => {
    const manifest = {
      items: [
        { id: "a", parent: "b", metadata: {} },
        { id: "b", parent: "a", metadata: {} },
        { id: "c", parent: null, metadata: {} },
      ],
    };
    expect(() => run(current, manifest, false)).to.not.throw();
  });

  it("is much faster on large outlines", () => {
    const manifest = generate(11, 800, { unpublished: true });
    const time = (fn) => {
      const t = performance.now();
      for (let n = 0; n < 3; n++)
        run(fn, JSON.parse(JSON.stringify(manifest)), false);
      return performance.now() - t;
    };
    const legacyMs = time(legacyRouterManifest);
    const nextMs = time(current);
    expect(nextMs).to.be.below(legacyMs);
  });
});
