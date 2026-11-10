/**
 * Browser and node sides of the dark mode and reduced motion gate
 * (scripts/dark-motion-check.mjs).
 *
 * In the page (functions passed to Playwright, so they use only browser
 * globals):
 * - pageInit(): runs before the demo's own scripts. Records the stack of
 *   every customElements.define (so a tag can be traced to the element
 *   folder whose module defined it), every shadow root attached, and every
 *   animation seen running, polling document and shadow roots every 40ms so
 *   a short transition or a load animation is caught before it ends.
 * - pageTargets(folder): the folder's own tags and up to a few hover/focus
 *   targets inside their first visible instances.
 * - pageCollect(folder): per tag, the colors the element sets itself (not
 *   inherited) and whether its styles mention light-dark(),
 *   prefers-color-scheme or color-scheme; and every animation or transition
 *   longer than 10ms seen on the element or inside its shadow root.
 *
 * On the node side:
 * - darkFindings(light, dark): tags that set colors of their own, render
 *   exactly the same colors in dark mode, and never mention dark mode in
 *   their styles. Tags that only inherit colors follow the page and are
 *   not reported.
 * - motionCounts(list): { key: 1 } per animation seen. Keys name the tag
 *   and the animated part by tag, a plain id (generated ids with digits
 *   are dropped) and its first class.
 */

export const MOTION_THRESHOLD_MS = 10;

export function pageInit() {
  const defs = {};
  const roots = [];
  const anims = new Set();
  const define = CustomElementRegistry.prototype.define;
  CustomElementRegistry.prototype.define = function (name, ctor, opts) {
    const limit = Error.stackTraceLimit;
    try {
      Error.stackTraceLimit = 60;
      defs[name] = String(new Error().stack || "");
    } catch {
      // the record is best effort; the define itself must still run
    } finally {
      Error.stackTraceLimit = limit;
    }
    return define.call(this, name, ctor, opts);
  };
  const attach = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const root = attach.call(this, init);
    roots.push(root);
    return root;
  };
  const poll = () => {
    try {
      const add = (list) => {
        for (const a of list) {
          if (a.playState === "running") {
            anims.add(a);
          }
        }
      };
      add(document.getAnimations());
      for (const r of roots) {
        add(r.getAnimations());
      }
    } catch {
      // polling must never break the page under test
    }
  };
  setInterval(poll, 40);
  globalThis.__darkMotion = { defs, roots, anims, poll };
}

/** the folder's own tags and hover/focus targets in their instances */
export function pageTargets(folder) {
  const dm = globalThis.__darkMotion;
  const esc = folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`/(?:elements|node_modules/@haxtheweb)/${esc}/`);
  const ours = Object.keys(dm.defs).filter((t) => re.test(dm.defs[t]));
  const all = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      all.push(el);
      if (el.shadowRoot) {
        walk(el.shadowRoot);
      }
    }
  };
  walk(document);
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const targets = [];
  const FOCUSABLE =
    'a[href],button,input,select,textarea,summary,[tabindex],[role="button"],[role="tab"],[role="link"]';
  for (const tag of ours) {
    const host = all.find((el) => el.localName === tag && visible(el));
    if (!host) {
      continue;
    }
    const inner = [];
    if (host.shadowRoot) {
      inner.push(...host.shadowRoot.querySelectorAll(FOCUSABLE));
    }
    inner.push(...host.querySelectorAll(FOCUSABLE));
    const picked = [host, ...inner.filter(visible).slice(0, 3)];
    for (const el of picked) {
      if (targets.length < 12 && !targets.includes(el)) {
        targets.push(el);
      }
    }
  }
  globalThis.__darkMotionTargets = targets;
  return { tags: ours, targets: targets.length };
}

/** hover and focus target i; returns its center, or null when not visible */
export function pageTarget(i) {
  const el = globalThis.__darkMotionTargets[i];
  if (!el) {
    return null;
  }
  el.scrollIntoView({ block: "center", inline: "center" });
  try {
    el.focus({ preventScroll: true });
  } catch {
    // not focusable: hover only
  }
  const r = el.getBoundingClientRect();
  globalThis.__darkMotion.poll();
  return r.width > 0 && r.height > 0
    ? { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    : null;
}

export function pageCollect(arg) {
  const { folder, threshold } = arg;
  const dm = globalThis.__darkMotion;
  dm.poll();
  const esc = folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`/(?:elements|node_modules/@haxtheweb)/${esc}/`);
  const ours = new Set(Object.keys(dm.defs).filter((t) => re.test(dm.defs[t])));
  const all = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      all.push(el);
      if (el.shadowRoot) {
        walk(el.shadowRoot);
      }
    }
  };
  walk(document);
  const clear = (v) => v === "rgba(0, 0, 0, 0)" || v === "transparent";
  const AWARE = /light-dark\(|prefers-color-scheme|color-scheme/;
  const colors = {};
  for (const tag of ours) {
    const host = all.find((el) => {
      if (el.localName !== tag) {
        return false;
      }
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!host) {
      continue;
    }
    const nodes = [host];
    if (host.shadowRoot) {
      nodes.push(...host.shadowRoot.querySelectorAll("*"));
    }
    const own = [];
    nodes.slice(0, 400).forEach((n, i) => {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden") {
        return;
      }
      const parent =
        n.parentElement || (n.getRootNode() && n.getRootNode().host) || null;
      const pcolor = parent ? getComputedStyle(parent).color : null;
      if (!clear(cs.backgroundColor)) {
        own.push(`${i}:background:${cs.backgroundColor}`);
      }
      if (pcolor !== null && cs.color !== pcolor) {
        own.push(`${i}:color:${cs.color}`);
      }
      if (
        parseFloat(cs.borderTopWidth) > 0 &&
        cs.borderTopStyle !== "none" &&
        cs.borderTopColor !== cs.color
      ) {
        own.push(`${i}:border:${cs.borderTopColor}`);
      }
    });
    let css = "";
    if (host.shadowRoot) {
      for (const sheet of host.shadowRoot.adoptedStyleSheets || []) {
        try {
          for (const rule of sheet.cssRules) {
            css += rule.cssText;
          }
        } catch {
          // unreadable sheet
        }
      }
      for (const s of host.shadowRoot.querySelectorAll("style")) {
        css += s.textContent;
      }
    }
    colors[tag] = { own, aware: AWARE.test(css) };
  }
  const motion = [];
  for (const a of dm.anims) {
    const effect = a.effect;
    const target = effect && effect.target;
    if (!target) {
      continue;
    }
    const timing = effect.getComputedTiming();
    if (!(timing.activeDuration > threshold)) {
      continue;
    }
    let owner = null;
    if (ours.has(target.localName)) {
      owner = target;
    } else {
      const root = target.getRootNode();
      if (root && root.host && ours.has(root.host.localName)) {
        owner = root.host;
      }
    }
    if (!owner) {
      continue;
    }
    let kind = "script";
    let name = a.id || "element.animate()";
    if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) {
      kind = "transition";
      name = a.transitionProperty;
    } else if (
      typeof CSSAnimation !== "undefined" &&
      a instanceof CSSAnimation
    ) {
      kind = "animation";
      name = a.animationName;
    }
    const part =
      target === owner
        ? ""
        : ` >> ${target.localName}${
            target.id && !/\d/.test(target.id) ? `#${target.id}` : ""
          }${
            target.classList && target.classList[0]
              ? `.${target.classList[0].replace(/\d+/g, "N")}`
              : ""
          }`;
    const ms = Number.isFinite(timing.activeDuration)
      ? `${Math.round(timing.activeDuration)}ms`
      : "infinite";
    motion.push({ key: `${kind} ${name} on ${owner.localName}${part}`, ms });
  }
  return { tags: [...ours].sort(), colors, motion };
}

/** tags that set their own colors and render them unchanged in dark mode */
export function darkFindings(light, dark) {
  const out = {};
  for (const tag of Object.keys((light && light.colors) || {}).sort()) {
    const l = light.colors[tag];
    const d = ((dark && dark.colors) || {})[tag];
    if (!d || !l.own.length || l.aware || d.aware) {
      continue;
    }
    if (JSON.stringify(l.own) === JSON.stringify(d.own)) {
      out[tag] = 1;
    }
  }
  return out;
}

/**
 * { key: 1 } for each animation seen in one run. Presence, not a count:
 * hovering in and out starts a new transition each time, so how many show
 * up depends on timing. (Generated ids are dropped and class digits become
 * N in the page; tag names keep theirs.)
 */
export function motionCounts(list) {
  const out = {};
  for (const m of list || []) {
    out[String(m.key)] = 1;
  }
  return out;
}
