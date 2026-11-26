/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { untracked } from "mobx";

/**
 * Apply a value read from the site store inside an autorun.
 *
 * Elements copy store values onto their own properties in an autorun and
 * apply them a microtask later, so a store change made during a render never
 * updates another element mid-render. The first run is different: nothing
 * else is rendering yet, and waiting meant a render with none of the site's
 * data. A server render (Lit SSR) never runs that microtask at all, so the
 * theme it produced had no title, menu or page (haxtheweb/issues#3431).
 *
 * The first run of `reaction` applies at once; every later run is deferred
 * to a microtask as before. `apply` runs untracked either way, so what it
 * reads never becomes a dependency of the autorun, as when it ran later.
 *
 * Only for applies that set properties from store data: anything that needs
 * the element's DOM must keep waiting, since a constructor has none yet.
 *
 * @param {object} reaction the reaction mobx passes to the autorun's view
 * @param {Function} apply sets the element's properties
 */
const applied = new WeakSet();
export function applyFromStore(reaction, apply) {
  if (reaction && !applied.has(reaction)) {
    applied.add(reaction);
    untracked(apply);
    return;
  }
  Promise.resolve().then(apply);
}
