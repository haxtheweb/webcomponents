/**
 * Browser and node sides of the forced colors, reflow and target size gate
 * (scripts/a11y-modes-check.mjs).
 *
 * In the page (functions passed to Playwright, so they use only browser
 * globals). The define tracking comes from the dark mode gate's pageInit
 * (scripts/lib/dark-motion.mjs), so a tag belongs to the element folder
 * whose module called customElements.define for it.
 * - pageSetup(folder): installs helpers on globalThis.__a11yModes: the
 *   folder's own tags, the owner of a node (the node itself when it is one
 *   of those tags, or the host of the shadow root it sits in), and the key
 *   naming a part ("<tag> >> <part tag>.<first class>", class digits as N).
 * - pageControls(arg): up to perTag focusable parts of the first visible
 *   instance of each own tag that has any (the host when it takes focus, then its shadow
 *   parts), capped per demo.
 * - pageIcons(arg): inline <svg> and *icon* elements in own shadow roots
 *   (or an own tag that is an icon), first instances only.
 * - pageClip(arg): scroll a control or icon into view, then (a second
 *   call, after a settle) give a screenshot clip around it.
 * - pageFocus(i) / pageBlur(): focus control i and say whether focus
 *   landed on it (or inside it) and matches :focus-visible; blur.
 * - pageTargetList(): every interactive target on the page with its rect,
 *   its owner key when it is ours, and whether the inline or user agent
 *   exception of WCAG 2.5.8 applies.
 * - pageReflow(): whether the page scrolls sideways, the outermost own
 *   parts that stick out past the right edge of the viewport, own text that
 *   an overflow: hidden/clip ancestor cuts off, and own text runs that
 *   overlap each other. Parts inside 2D content (see TWO_D) are left out.
 *
 * On the node side (pure, unit tested in scripts/test/a11y-modes.test.mjs):
 * - decodePng(buffer): RGBA pixels of a Playwright screenshot.
 * - visibility(img, inner): the highest contrast between any pixel inside
 *   the inner box and the most common color of the ring around it, or the
 *   darkest and lightest pixels inside: 1 means nothing can be seen there.
 * - focusChange(before, after): how many pixels changed between two shots
 *   by at least 3:1 (WCAG 1.4.11 non-text contrast).
 * - targetFindings(targets): own targets under 24x24 CSS px that fail the
 *   spacing exception: a 24px circle centered on the target meets another
 *   target, or another undersized target's circle.
 * - countKeys(list): { key: 1 } per distinct key (presence, not counts:
 *   how many instances a demo shows is the demo's business).
 * - findings({ forced, dark, reflow }): the baseline groups of one demo
 *   from its three runs; a part is paired across runs by its key and
 *   occurrence number.
 */
import zlib from "node:zlib";

export const FOCUS_CONTRAST = 3;
export const FOCUS_MIN_PIXELS = 4;
export const VISIBLE_CONTRAST = 1.5;
export const ICON_CONTRAST = 3;
export const TARGET_MIN = 24;

/**
 * Content that may need two-dimensional scrolling (WCAG 1.4.10 exception):
 * a part inside one of these is never a reflow finding.
 */
export const TWO_D_SELECTOR =
  "table,pre,code,samp,textarea,video,audio,iframe,canvas,img,picture,svg,math,object,embed,[role=grid],[role=table],[role=treegrid],[role=img],[role=application],[role=math]";
export const TWO_D_TAG =
  "(^|-)(code|editor|map|maps|table|chart|graph|video|media|player|canvas|game|diagram|presentation|slide|slides|latex|math|image|img|pdf|iframe|terminal|xterm)($|-)";

export function pageSetup(folder) {
  const dm = globalThis.__darkMotion || { defs: {} };
  const esc = folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`/(?:elements|node_modules/@haxtheweb)/${esc}/`);
  const ours = new Set(Object.keys(dm.defs).filter((t) => re.test(dm.defs[t])));
  const walk = (root, out) => {
    for (const el of root.querySelectorAll("*")) {
      out.push(el);
      if (el.shadowRoot) {
        walk(el.shadowRoot, out);
      }
    }
    return out;
  };
  const owner = (el) => {
    if (ours.has(el.localName)) {
      return el;
    }
    const root = el.getRootNode();
    return root && root.host && ours.has(root.host.localName)
      ? root.host
      : null;
  };
  const partName = (el) => {
    let name = el.localName;
    if (name === "input") {
      name += `[type=${el.type || "text"}]`;
    }
    if (el.classList && el.classList[0]) {
      name += `.${el.classList[0].replace(/\d+/g, "N")}`;
    }
    return name;
  };
  const keyOf = (el) => {
    const o = owner(el);
    if (!o) {
      return null;
    }
    return o === el ? o.localName : `${o.localName} >> ${partName(el)}`;
  };
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) {
      return false;
    }
    if (typeof el.checkVisibility === "function") {
      return el.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
      });
    }
    const cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none";
  };
  const parentOf = (el) =>
    el.assignedSlot ||
    el.parentElement ||
    (el.parentNode && el.parentNode.host) ||
    null;
  const deepActive = () => {
    let a = document.activeElement;
    while (a && a.shadowRoot && a.shadowRoot.activeElement) {
      a = a.shadowRoot.activeElement;
    }
    return a;
  };
  const deepAt = (x, y) => {
    let el = document.elementFromPoint(x, y);
    while (el && el.shadowRoot) {
      const inner = el.shadowRoot.elementFromPoint(x, y);
      if (!inner || inner === el) {
        break;
      }
      el = inner;
    }
    return el;
  };
  // does a contain b in the flat/composed tree
  const contains = (a, b) => {
    for (let n = b; n; n = parentOf(n)) {
      if (n === a) {
        return true;
      }
    }
    return false;
  };
  const FOCUSABLE =
    'a[href],button,input:not([type="hidden"]),select,textarea,summary,[tabindex]';
  const takesFocus = (el) =>
    el.matches(FOCUSABLE) &&
    el.tabIndex >= 0 &&
    !el.disabled &&
    !el.closest("[inert]");
  globalThis.__a11yModes = {
    ours,
    walk,
    owner,
    keyOf,
    shown,
    parentOf,
    deepActive,
    deepAt,
    contains,
    takesFocus,
    FOCUSABLE,
  };
  return [...ours].sort();
}

/** focusable parts of the first visible instances of each own tag */
export function pageControls(arg) {
  const { perTag, cap } = arg;
  const am = globalThis.__a11yModes;
  const all = am.walk(document, []);
  const controls = [];
  for (const tag of [...am.ours].sort()) {
    // the first visible instances, until one of them has controls of its
    // own (an instance can hold only another element's controls)
    const hosts = all
      .filter((el) => el.localName === tag && am.shown(el))
      .slice(0, 10);
    let picked = [];
    for (const host of hosts) {
      picked = [];
      if (am.takesFocus(host)) {
        picked.push(host);
      }
      if (host.shadowRoot) {
        for (const el of am.walk(host.shadowRoot, [])) {
          if (picked.length >= perTag) {
            break;
          }
          // nested own tags are judged on their own instance
          if (am.owner(el) === host && am.takesFocus(el) && am.shown(el)) {
            picked.push(el);
          }
        }
      }
      if (picked.length) {
        break;
      }
    }
    for (const el of picked.slice(0, perTag)) {
      if (controls.length < cap && !controls.includes(el)) {
        controls.push(el);
      }
    }
  }
  am.controls = controls;
  return controls.map((el) => am.keyOf(el));
}

/**
 * Part i of am.controls or am.icons (arg.list). With arg.scroll it blurs
 * whatever has focus and scrolls the part into the middle of the viewport
 * (instantly: a smooth scroll would move it after it is measured). Without,
 * it returns a screenshot clip around the part (arg.pad px) and the part's
 * box inside that clip, or null when the part is gone or something else
 * (a sticky bar, an overlay) is on top of it.
 */
export function pageClip(arg) {
  const { list, i, pad, scroll } = arg;
  const am = globalThis.__a11yModes;
  const el = am[list][i];
  if (!el || !el.isConnected || !am.shown(el)) {
    return null;
  }
  if (scroll) {
    const a = am.deepActive();
    if (a && a.blur) {
      a.blur();
    }
    el.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "instant",
    });
    return true;
  }
  const r = el.getBoundingClientRect();
  const hit = am.deepAt(r.x + r.width / 2, r.y + r.height / 2);
  if (!hit || !(am.contains(el, hit) || am.contains(hit, el))) {
    return null;
  }
  const clip = {
    x: Math.max(0, Math.floor(r.x - pad)),
    y: Math.max(0, Math.floor(r.y - pad)),
  };
  clip.width =
    Math.min(globalThis.innerWidth, Math.ceil(r.right + pad)) - clip.x;
  clip.height =
    Math.min(globalThis.innerHeight, Math.ceil(r.bottom + pad)) - clip.y;
  if (clip.width < 2 || clip.height < 2) {
    return null;
  }
  return {
    clip,
    inner: {
      x: Math.round(r.x) - clip.x,
      y: Math.round(r.y) - clip.y,
      width: Math.round(r.width),
      height: Math.round(r.height),
    },
  };
}

/** focus control i: did focus land on it and match :focus-visible */
export function pageFocus(i) {
  const am = globalThis.__a11yModes;
  const el = am.controls[i];
  try {
    el.focus({ preventScroll: true, focusVisible: true });
  } catch {
    return { ok: false };
  }
  const a = am.deepActive();
  if (!a || !(a === el || am.contains(el, a))) {
    return { ok: false };
  }
  return { ok: a.matches(":focus-visible") };
}

export function pageBlur() {
  const am = globalThis.__a11yModes;
  const a = am.deepActive();
  if (a && a.blur) {
    a.blur();
  }
}

/** icons in own shadow roots, first visible instance of each own tag */
export function pageIcons(arg) {
  const { perTag, cap } = arg;
  const am = globalThis.__a11yModes;
  const all = am.walk(document, []);
  const ICON = /(^|-)icon($|-)/;
  const icons = [];
  for (const tag of [...am.ours].sort()) {
    const host = all.find((el) => el.localName === tag && am.shown(el));
    if (!host) {
      continue;
    }
    const found = [];
    if (ICON.test(tag)) {
      found.push(host);
    } else if (host.shadowRoot) {
      for (const el of am.walk(host.shadowRoot, [])) {
        if (found.length >= perTag) {
          break;
        }
        if (am.owner(el) !== host) {
          continue;
        }
        const isIcon =
          el.localName === "svg"
            ? !el.closest("svg svg")
            : ICON.test(el.localName);
        if (!isIcon || !am.shown(el)) {
          continue;
        }
        const r = el.getBoundingClientRect();
        // tiny marks and big illustrations are not icons
        if (r.width >= 8 && r.height >= 8 && r.width <= 96 && r.height <= 96) {
          found.push(el);
        }
      }
    }
    for (const el of found) {
      if (icons.length < cap) {
        icons.push(el);
      }
    }
  }
  am.icons = icons;
  return icons.map((el) => am.keyOf(el));
}

/** every interactive target on the page, for WCAG 2.5.8 */
export function pageTargetList() {
  const am = globalThis.__a11yModes;
  globalThis.scrollTo(0, 0);
  const TARGET =
    'a[href],button,input:not([type="hidden"]),select,summary,textarea,[role="button"],[role="link"],[role="checkbox"],[role="radio"],[role="switch"],[role="tab"],[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"],[role="option"],[role="slider"],[role="spinbutton"],[role="combobox"],[tabindex]:not([tabindex="-1"])';
  const UA_SIZED = /^(checkbox|radio)$/;
  const found = [];
  for (const el of am.walk(document, [])) {
    if (!el.matches(TARGET) || el.disabled || el.closest("[inert]")) {
      continue;
    }
    if (el.isContentEditable || !am.shown(el)) {
      continue;
    }
    const cs = getComputedStyle(el);
    if (cs.pointerEvents === "none") {
      continue;
    }
    found.push({ el, cs, r: el.getBoundingClientRect() });
  }
  // a wrapper that holds another target is not a target of its own here:
  // the inner one is what a pointer hits
  const kept = found.filter(
    (f) => !found.some((g) => g !== f && am.contains(f.el, g.el)),
  );
  return kept.map((f) => {
    const { el, cs, r } = f;
    let inline = false;
    if (cs.display === "inline") {
      // a link or button in a sentence: the block around it has text of
      // its own
      let block = am.parentOf(el);
      while (block && getComputedStyle(block).display === "inline") {
        block = am.parentOf(block);
      }
      const own = (el.textContent || "").trim().length;
      const around = block ? (block.textContent || "").trim().length : 0;
      inline = around > own + 1;
    }
    const ua =
      el.localName === "input" &&
      UA_SIZED.test(el.type) &&
      cs.appearance !== "none";
    return {
      key: am.keyOf(el),
      x: r.x + globalThis.scrollX,
      y: r.y + globalThis.scrollY,
      width: r.width,
      height: r.height,
      inline,
      ua,
    };
  });
}

/** WCAG 1.4.10 at the current viewport */
export function pageReflow(arg) {
  const { twoDSelector, twoDTag } = arg;
  const am = globalThis.__a11yModes;
  const vw = document.documentElement.clientWidth;
  const se = document.scrollingElement || document.documentElement;
  const scrolls = se.scrollWidth > se.clientWidth + 1;
  const twoDTagRe = new RegExp(twoDTag);
  const twoD = (el) => {
    for (let n = el; n; n = am.parentOf(n)) {
      if (n.nodeType !== 1) {
        continue;
      }
      if (n.matches(twoDSelector) || twoDTagRe.test(n.localName)) {
        return true;
      }
    }
    return false;
  };
  const own = am
    .walk(document, [])
    .filter((el) => am.owner(el) && am.shown(el));
  const overflow = new Set();
  if (scrolls) {
    const sticksOut = (el) => {
      if (getComputedStyle(el).position === "fixed") {
        return false;
      }
      return el.getBoundingClientRect().right > vw + 1;
    };
    for (const el of own) {
      if (!sticksOut(el) || twoD(el)) {
        continue;
      }
      const p = am.parentOf(el);
      // the outermost part that sticks out names where the width comes from
      if (p && am.owner(p) && sticksOut(p)) {
        continue;
      }
      overflow.add(am.keyOf(el));
    }
  }
  // text runs of own parts
  // visually hidden text (sr-only: a 1px box, clip or clip-path) is meant
  // for screen readers and is neither clipped nor overlapping for anyone
  const srOnly = (el) => {
    let n = el;
    for (let depth = 0; n && n.nodeType === 1 && depth < 4; depth++) {
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      if (
        r.width <= 2 ||
        r.height <= 2 ||
        (cs.clip && cs.clip !== "auto") ||
        (cs.clipPath && cs.clipPath !== "none")
      ) {
        return true;
      }
      n = am.parentOf(n);
    }
    return false;
  };
  const texts = [];
  for (const el of own) {
    if (texts.length >= 400 || twoD(el) || srOnly(el)) {
      continue;
    }
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const range = document.createRange();
        range.selectNodeContents(n);
        const rects = [...range.getClientRects()].filter(
          (r) => r.width > 1 && r.height > 1,
        );
        if (rects.length) {
          texts.push({ el, rects });
        }
      }
    }
  }
  const clipped = new Set();
  for (const t of texts) {
    // the nearest ancestor that hides overflow, inside the owner's tree
    let box = null;
    for (let n = am.parentOf(t.el); n && n.nodeType === 1; n = am.parentOf(n)) {
      const cs = getComputedStyle(n);
      const hides = (v) => v === "hidden" || v === "clip";
      if (hides(cs.overflowX) || hides(cs.overflowY)) {
        box = { n, cs, hx: hides(cs.overflowX), hy: hides(cs.overflowY) };
        break;
      }
      if (n === am.owner(t.el)) {
        break;
      }
    }
    // own overflow: hidden on the text's element itself counts too
    const selfCs = getComputedStyle(t.el);
    if (
      selfCs.overflowX === "hidden" ||
      selfCs.overflowX === "clip" ||
      selfCs.overflowY === "hidden" ||
      selfCs.overflowY === "clip"
    ) {
      box = {
        n: t.el,
        cs: selfCs,
        hx: selfCs.overflowX === "hidden" || selfCs.overflowX === "clip",
        hy: selfCs.overflowY === "hidden" || selfCs.overflowY === "clip",
      };
    }
    if (!box) {
      continue;
    }
    const b = box.n.getBoundingClientRect();
    // visually hidden text and collapsed panels are hidden on purpose
    if (b.width <= 2 || b.height <= 2) {
      continue;
    }
    const cut = t.rects.some(
      (r) =>
        (box.hx && (r.right > b.right + 2 || r.left < b.left - 2)) ||
        (box.hy && (r.bottom > b.bottom + 2 || r.top < b.top - 2)),
    );
    // a carousel or marquee keeps slides out of its window at any width;
    // the wide run drops those
    if (cut) {
      clipped.add(am.keyOf(t.el));
    }
  }
  const overlap = new Set();
  const hit = (a, b) =>
    Math.min(a.right, b.right) - Math.max(a.left, b.left) > 3 &&
    Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 3;
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i];
      const b = texts[j];
      if (a.el === b.el || am.owner(a.el) !== am.owner(b.el)) {
        continue;
      }
      if (a.rects.some((ra) => b.rects.some((rb) => hit(ra, rb)))) {
        const pair = [am.keyOf(a.el), am.keyOf(b.el)].sort();
        overlap.add(`${pair[0]} / ${pair[1].replace(/^[^ ]+ >> /, "")}`);
      }
    }
  }
  return {
    scrolls,
    overflow: [...overflow].sort(),
    clipped: [...clipped].sort(),
    overlap: [...overlap].sort(),
  };
}

// ---------------------------------------------------------------- node side

/** decode an 8-bit, non-interlaced PNG (what Chromium screenshots are) */
export function decodePng(buffer) {
  const buf = Buffer.from(buffer);
  if (buf.readUInt32BE(0) !== 0x89504e47) {
    throw new Error("not a PNG");
  }
  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  let bitDepth = 0;
  let interlace = 0;
  let palette = null;
  let trns = null;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("latin1", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "PLTE") {
      palette = data;
    } else if (type === "tRNS") {
      trns = data;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    pos += 12 + len;
  }
  if (bitDepth !== 8 || interlace !== 0) {
    throw new Error(
      `unsupported PNG (bit depth ${bitDepth}, interlace ${interlace})`,
    );
  }
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) {
    throw new Error(`unsupported PNG color type ${colorType}`);
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const px = Buffer.alloc(stride * height);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const out = px.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      let v = line[x];
      if (filter === 1) {
        v += a;
      } else if (filter === 2) {
        v += b;
      } else if (filter === 3) {
        v += (a + b) >> 1;
      } else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[x] = v & 0xff;
    }
    prev = out;
  }
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * channels;
    let r;
    let g;
    let b;
    let a = 255;
    if (colorType === 0) {
      r = g = b = px[s];
    } else if (colorType === 2) {
      r = px[s];
      g = px[s + 1];
      b = px[s + 2];
    } else if (colorType === 3) {
      const k = px[s];
      r = palette[k * 3];
      g = palette[k * 3 + 1];
      b = palette[k * 3 + 2];
      a = trns && k < trns.length ? trns[k] : 255;
    } else if (colorType === 4) {
      r = g = b = px[s];
      a = px[s + 1];
    } else {
      r = px[s];
      g = px[s + 1];
      b = px[s + 2];
      a = px[s + 3];
    }
    data.set([r, g, b, a], i * 4);
  }
  return { width, height, data };
}

const LIN = new Float64Array(256).map((_, i) => {
  const c = i / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
});

function lum(data, i) {
  return (
    0.2126 * LIN[data[i]] +
    0.7152 * LIN[data[i + 1]] +
    0.0722 * LIN[data[i + 2]]
  );
}

export function contrastOf(l1, l2) {
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * How visible anything is inside the inner box of a shot: the highest
 * contrast between a pixel inside and the most common color of the ring
 * around it, or between the darkest and lightest pixels inside.
 */
export function visibility(img, inner) {
  const { width, height, data } = img;
  const x0 = Math.max(0, inner.x);
  const y0 = Math.max(0, inner.y);
  const x1 = Math.min(width, inner.x + inner.width);
  const y1 = Math.min(height, inner.y + inner.height);
  const ring = new Map();
  let lo = Infinity;
  let hi = -Infinity;
  const inside = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (x >= x0 && x < x1 && y >= y0 && y < y1) {
        const l = lum(data, i);
        inside.push(l);
        lo = Math.min(lo, l);
        hi = Math.max(hi, l);
      } else {
        const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
        ring.set(k, (ring.get(k) || 0) + 1);
      }
    }
  }
  if (!inside.length) {
    return 1;
  }
  let best = contrastOf(lo, hi);
  if (ring.size) {
    let top = 0;
    let count = -1;
    for (const [k, n] of ring) {
      if (n > count) {
        top = k;
        count = n;
      }
    }
    const bg = new Uint8Array([(top >> 16) & 255, (top >> 8) & 255, top & 255]);
    const bl = lum(bg, 0);
    best = Math.max(best, contrastOf(bl, lo), contrastOf(bl, hi));
  }
  return best;
}

/** pixels that changed by at least FOCUS_CONTRAST between two shots */
export function focusChange(before, after) {
  if (before.width !== after.width || before.height !== after.height) {
    // the control changed size on focus: that is visible
    return Infinity;
  }
  let n = 0;
  for (let i = 0; i < before.data.length; i += 4) {
    if (contrastOf(lum(before.data, i), lum(after.data, i)) >= FOCUS_CONTRAST) {
      n += 1;
    }
  }
  return n;
}

function distToRect(cx, cy, r) {
  const dx = Math.max(r.x - cx, 0, cx - (r.x + r.width));
  const dy = Math.max(r.y - cy, 0, cy - (r.y + r.height));
  return Math.hypot(dx, dy);
}

/**
 * WCAG 2.5.8: own targets smaller than 24x24 whose 24px circle meets
 * another target, or the circle of another undersized target. Inline
 * targets and user agent sized checkboxes and radios are exempt.
 */
export function targetFindings(targets) {
  const small = (t) =>
    t.width < TARGET_MIN - 0.5 || t.height < TARGET_MIN - 0.5;
  const center = (t) => [t.x + t.width / 2, t.y + t.height / 2];
  const keys = [];
  targets.forEach((t, i) => {
    if (!t.key || !small(t) || t.inline || t.ua) {
      return;
    }
    // visually hidden (sr-only) targets are not pointer targets
    if (t.width <= 2 || t.height <= 2) {
      return;
    }
    const [cx, cy] = center(t);
    const r = TARGET_MIN / 2;
    const crowded = targets.some((u, j) => {
      if (j === i || u.width <= 2 || u.height <= 2) {
        return false;
      }
      if (distToRect(cx, cy, u) < r - 0.01) {
        return true;
      }
      if (small(u) && !u.inline && !u.ua) {
        const [ux, uy] = center(u);
        return Math.hypot(ux - cx, uy - cy) < TARGET_MIN - 0.01;
      }
      return false;
    });
    if (crowded) {
      keys.push(t.key);
    }
  });
  return countKeys(keys);
}

export function countKeys(list) {
  const out = {};
  for (const k of list || []) {
    if (k) {
      out[String(k)] = 1;
    }
  }
  return out;
}

/** keys in the narrow run that the wide run does not show */
export function onlyNarrow(narrow, wide) {
  const w = new Set(wide || []);
  return countKeys((narrow || []).filter((k) => !w.has(k)));
}

/** "<key>" plus its occurrence number, to pair the same part across runs */
function byOccurrence(list) {
  const seen = {};
  const out = new Map();
  for (const item of list || []) {
    const n = (seen[item.key] = (seen[item.key] || 0) + 1);
    out.set(`${item.key}#${n}`, item);
  }
  return out;
}

/** the findings of one demo from its three runs */
export function findings(runs) {
  const { forced, dark, reflow } = runs;
  const focusLost = (list) =>
    countKeys(
      (list || [])
        .filter(
          (c) =>
            c.key &&
            typeof c.change === "number" &&
            c.change < FOCUS_MIN_PIXELS,
        )
        .map((c) => c.key),
    );
  const darkControls = byOccurrence(dark.controls);
  const invisible = [];
  for (const [id, c] of byOccurrence(forced.controls)) {
    const ref = darkControls.get(id);
    if (
      c.key &&
      typeof c.visible === "number" &&
      c.visible < VISIBLE_CONTRAST &&
      ref &&
      typeof ref.visible === "number" &&
      ref.visible >= VISIBLE_CONTRAST
    ) {
      invisible.push(c.key);
    }
  }
  const darkIcons = byOccurrence(dark.icons);
  const iconLost = [];
  for (const [id, c] of byOccurrence(forced.icons)) {
    const ref = darkIcons.get(id);
    if (
      c.key &&
      typeof c.visible === "number" &&
      c.visible < ICON_CONTRAST &&
      ref &&
      typeof ref.visible === "number" &&
      ref.visible >= ICON_CONTRAST
    ) {
      iconLost.push(c.key);
    }
  }
  const wide = dark.reflow || {};
  const narrow = reflow.reflow || {};
  return {
    "forced-focus": focusLost(forced.controls),
    "dark-focus": focusLost(dark.controls),
    "forced-invisible": countKeys(invisible),
    "forced-icon": countKeys(iconLost),
    "reflow-overflow": countKeys(narrow.overflow),
    "reflow-clipped": onlyNarrow(narrow.clipped, wide.clipped),
    "reflow-overlap": onlyNarrow(narrow.overlap, wide.overlap),
    "target-size": targetFindings(dark.targets || []),
  };
}
