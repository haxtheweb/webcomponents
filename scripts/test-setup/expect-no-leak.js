/**
 * expectNoLeak(tag): connect and disconnect an element several times and
 * fail if anything it created outlives it (haxtheweb/issues#3246).
 *
 * Counts, over the measured cycles (after one warmup cycle, so lazy one-time
 * setup is not blamed on the element):
 *   reactions  MobX reactions (autorun / reaction) created and never disposed
 *   observed   ResizeObserver / IntersectionObserver targets that left the
 *              document but are still observed (the observer keeps them alive)
 *   i18n       growth of the i18n-manager registry
 *
 * Usage in a web-test-runner test:
 *   import { expectNoLeak } from "../../../scripts/test-setup/expect-no-leak.js";
 *   it("leaves nothing behind when removed", async () => {
 *     await expectNoLeak("my-element");
 *   });
 * Options: { cycles: 5, create: () => element, allow: { reactions, observed, i18n } }
 *
 * measureLeaks() returns the counts without asserting.
 */
import { Reaction } from "mobx";

const state = {
  installed: false,
  reactions: [],
  observers: [],
};

function install() {
  if (state.installed) {
    return;
  }
  state.installed = true;
  // every reaction schedules once when it is created
  const schedule = Reaction.prototype.schedule_;
  Reaction.prototype.schedule_ = function () {
    if (!this.__leakTracked) {
      this.__leakTracked = true;
      state.reactions.push(new WeakRef(this));
    }
    return schedule.call(this);
  };
  ["ResizeObserver", "IntersectionObserver"].forEach((name) => {
    const ctor = globalThis[name];
    if (!ctor || !ctor.prototype) {
      return;
    }
    const proto = ctor.prototype;
    const observe = proto.observe;
    const unobserve = proto.unobserve;
    const disconnect = proto.disconnect;
    proto.observe = function (target) {
      if (!this.__leakTargets) {
        this.__leakTargets = new Set();
        state.observers.push(new WeakRef(this));
      }
      this.__leakTargets.add(new WeakRef(target));
      return observe.apply(this, arguments);
    };
    proto.unobserve = function (target) {
      const targets = this.__leakTargets;
      if (targets) {
        targets.forEach((ref) => {
          if (ref.deref() === target) {
            targets.delete(ref);
          }
        });
      }
      return unobserve.apply(this, arguments);
    };
    proto.disconnect = function () {
      if (this.__leakTargets) {
        this.__leakTargets.clear();
      }
      return disconnect.apply(this, arguments);
    };
  });
}

function liveReactionsSince(mark) {
  let count = 0;
  for (let i = mark; i < state.reactions.length; i++) {
    const reaction = state.reactions[i].deref();
    if (reaction && !reaction.isDisposed_ && !reaction.isDisposed) {
      count++;
    }
  }
  return count;
}

function detachedObservedTargets() {
  let count = 0;
  state.observers.forEach((ref) => {
    const observer = ref.deref();
    if (!observer || !observer.__leakTargets) {
      return;
    }
    observer.__leakTargets.forEach((targetRef) => {
      const target = targetRef.deref();
      if (target && !target.isConnected) {
        count++;
      }
    });
  });
  return count;
}

function i18nRegistrySize() {
  const store =
    globalThis.I18NManagerStore && globalThis.I18NManagerStore.instance;
  return store && Array.isArray(store.elements) ? store.elements.length : 0;
}

// createElement() refuses elements whose constructor sets attributes (a
// spec rule the parser's upgrade path doesn't apply), so fall back to
// creating it from markup the way a page would
function createByTag(tag) {
  try {
    return globalThis.document.createElement(tag);
  } catch (e) {
    const holder = globalThis.document.createElement("div");
    holder.innerHTML = `<${tag}></${tag}>`;
    return holder.firstElementChild;
  }
}

function frame() {
  return new Promise((resolve) => {
    globalThis.requestAnimationFrame(() => resolve());
  });
}

async function cycle(create, host) {
  const el = create();
  host.appendChild(el);
  if (el.updateComplete) {
    await el.updateComplete;
  }
  await frame();
  await frame();
  el.remove();
  await frame();
}

/**
 * Connect/disconnect cycles; returns { reactions, observed, i18n } created
 * by the measured cycles and still alive afterwards.
 * @param {string} tag custom element tag (ignored when options.create is set)
 * @param {object} [options] { cycles, create }
 */
export async function measureLeaks(tag, options = {}) {
  install();
  const cycles = options.cycles || 5;
  const create = options.create || (() => createByTag(tag));
  if (!options.create) {
    await globalThis.customElements.whenDefined(tag);
  }
  const host = globalThis.document.createElement("div");
  globalThis.document.body.appendChild(host);
  try {
    // warmup: one-time lazy setup (shared stores, registries) is not a leak
    await cycle(create, host);
    const reactionMark = state.reactions.length;
    const observedBefore = detachedObservedTargets();
    const i18nBefore = i18nRegistrySize();
    for (let i = 0; i < cycles; i++) {
      await cycle(create, host);
    }
    return {
      reactions: liveReactionsSince(reactionMark),
      observed: Math.max(0, detachedObservedTargets() - observedBefore),
      i18n: Math.max(0, i18nRegistrySize() - i18nBefore),
      cycles: cycles,
    };
  } finally {
    host.remove();
  }
}

/**
 * Throws when an element leaves reactions, observed detached nodes or i18n
 * registrations behind after it is removed.
 * @param {string} tag custom element tag
 * @param {object} [options] { cycles, create, allow: { reactions, observed, i18n } }
 */
export async function expectNoLeak(tag, options = {}) {
  const found = await measureLeaks(tag, options);
  const allow = Object.assign(
    { reactions: 0, observed: 0, i18n: 0 },
    options.allow || {},
  );
  const problems = [];
  if (found.reactions > allow.reactions) {
    problems.push(
      `${found.reactions} MobX reaction(s) created and never disposed (dispose them in disconnectedCallback)`,
    );
  }
  if (found.observed > allow.observed) {
    problems.push(
      `${found.observed} removed node(s) still observed by a Resize/IntersectionObserver (unobserve or disconnect on disconnect)`,
    );
  }
  if (found.i18n > allow.i18n) {
    problems.push(
      `${found.i18n} i18n-manager registration(s) kept for removed elements`,
    );
  }
  if (problems.length) {
    throw new Error(
      `<${tag}> leaks across ${found.cycles} connect/disconnect cycles: ${problems.join("; ")}`,
    );
  }
  return found;
}
