/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * UX study recorder for HAXcms (developer tool, started from Merlin).
 *
 * Records how a participant moves through the real interface so the session
 * can be analyzed for discoverability and visibility problems:
 * - clicks (with the shadow-piercing target path and its accessible label)
 * - pointer path samples (a mouse-attention proxy, not real eye tracking)
 * - hover dwell on interactive controls
 * - focus moves and key categories (never the characters typed)
 * - scroll depth, route changes, tab visibility
 * - snapshots of the interactive controls visible in the viewport
 * - researcher task marks ("Task: add a page")
 *
 * Privacy: nothing leaves the browser. The session lives in sessionStorage
 * until the researcher exports it as a JSON file. Input values and typed
 * characters are never recorded, and a visible indicator stays on screen
 * the whole time recording is active.
 */
import { LitElement, html, css } from "lit";

export const UX_STUDY_SCHEMA = "haxcms-ux-study/1";
const STORAGE_KEY = "haxcms-ux-study-session";
const MOVE_SAMPLE_MS = 120;
const MOVE_MIN_PX = 4;
const HOVER_MIN_MS = 250;
const SNAPSHOT_INTERVAL_MS = 15000;
const MAX_EVENTS = 40000;
const MAX_CONTROLS = 400;
const MAX_LABEL = 60;
const INDICATOR_TAG = "haxcms-ux-study-indicator";

const INTERACTIVE_TAGS = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "details",
  "option",
];
const INTERACTIVE_ROLES = [
  "button",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "tab",
  "checkbox",
  "radio",
  "switch",
  "option",
  "combobox",
  "slider",
  "textbox",
  "searchbox",
  "treeitem",
];

// English defaults; the editor passes its translated this.t in at start()
const UX_STUDY_T = {
  uxStudyRecording: "Recording UX study",
  uxStudyMark: "Mark task",
  uxStudyStopAndExport: "Stop and export",
  uxStudyMarkPrompt: "Task or note",
};

const safeStorage = {
  get() {
    try {
      const raw = globalThis.sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  set(value) {
    try {
      globalThis.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  clear() {
    try {
      globalThis.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // intentionally empty
    }
  },
};

const clip = (value, max = MAX_LABEL) => {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.substring(0, max - 1)}…` : text;
};

const roundRect = (rect) => ({
  x: Math.round(rect.left),
  y: Math.round(rect.top),
  w: Math.round(rect.width),
  h: Math.round(rect.height),
});

/**
 * Is this element something a user can operate?
 */
export const isInteractive = (el) => {
  if (!el || el.nodeType !== 1 || !el.tagName) {
    return false;
  }
  const tag = el.tagName.toLowerCase();
  if (INTERACTIVE_TAGS.indexOf(tag) !== -1) {
    if (tag === "a") {
      return el.hasAttribute("href");
    }
    return true;
  }
  const role = el.getAttribute("role");
  if (role && INTERACTIVE_ROLES.indexOf(role) !== -1) {
    return true;
  }
  if (el.hasAttribute("contenteditable")) {
    return el.getAttribute("contenteditable") !== "false";
  }
  const tabindex = el.getAttribute("tabindex");
  if (tabindex !== null && parseInt(tabindex, 10) >= 0) {
    return true;
  }
  // HAX button-style custom elements (simple-icon-button, hax-tray-button...)
  return tag.indexOf("-") !== -1 && /button|toggle|tab$|menu-item/.test(tag);
};

/**
 * Best human-facing name for an element, without reading form values
 */
export const labelFor = (el) => {
  if (!el || el.nodeType !== 1) {
    return "";
  }
  const attrs = ["aria-label", "label", "title", "alt", "voice-label"];
  for (let i = 0; i < attrs.length; i++) {
    const value = el.getAttribute(attrs[i]);
    if (value && value.trim()) {
      return clip(value);
    }
  }
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") {
    return clip(el.getAttribute("placeholder") || el.getAttribute("name"));
  }
  if (el.hasAttribute("contenteditable")) {
    return "";
  }
  // visible text is only a fair name for controls and small text elements;
  // page-level containers would otherwise sweep up whole pages (or style text)
  if (
    !isInteractive(el) &&
    [
      "html",
      "body",
      "head",
      "main",
      "section",
      "article",
      "style",
      "script",
    ].indexOf(tag) !== -1
  ) {
    return "";
  }
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (!isInteractive(el) && text.length > MAX_LABEL * 2) {
    return "";
  }
  return clip(text);
};

/**
 * Shadow-piercing path built from a composedPath() style list (innermost first)
 */
const pathFromComposed = (composed) => {
  const parts = [];
  for (let i = 0; i < composed.length && parts.length < 14; i++) {
    const node = composed[i];
    if (!node || node.nodeType !== 1) {
      if (node && node.nodeType === 11) {
        parts.push("#shadow");
      }
      continue;
    }
    const tag = node.tagName.toLowerCase();
    if (tag === "html" || tag === "body") {
      break;
    }
    let part = tag;
    if (node.id) {
      part += `#${node.id}`;
    } else if (node.getAttribute("data-hax-ray")) {
      part += `[data-hax-ray="${clip(node.getAttribute("data-hax-ray"), 30)}"]`;
    } else if (node.getAttribute("icon")) {
      part += `[icon="${clip(node.getAttribute("icon"), 30)}"]`;
    }
    parts.push(part);
  }
  return parts.reverse().join(" > ");
};

/**
 * Ancestor chain for an element that pierces shadow roots (innermost first)
 */
const composedAncestors = (el) => {
  const chain = [];
  let node = el;
  while (node && chain.length < 40) {
    chain.push(node);
    if (node.parentNode) {
      node = node.parentNode;
    } else if (node.host) {
      node = node.host;
    } else {
      node = null;
    }
  }
  return chain;
};

const describe = (el, composed) => {
  if (!el || el.nodeType !== 1) {
    return null;
  }
  let style = null;
  try {
    style = globalThis.getComputedStyle(el);
  } catch (e) {
    style = null;
  }
  return {
    path: pathFromComposed(composed || composedAncestors(el)),
    tag: el.tagName.toLowerCase(),
    role: el.getAttribute("role") || "",
    label: labelFor(el),
    interactive: isInteractive(el),
    disabled:
      el.hasAttribute("disabled") ||
      el.getAttribute("aria-disabled") === "true",
    cursor: style ? style.cursor : "",
    rect: roundRect(el.getBoundingClientRect()),
  };
};

/**
 * From an event, find the operable control the user aimed at: the innermost
 * interactive element in the composed path (within a few hops), else the raw target.
 */
const resolveTarget = (event) => {
  const composed = event.composedPath ? event.composedPath() : [event.target];
  const raw = composed[0];
  for (let i = 0; i < Math.min(composed.length, 8); i++) {
    if (isInteractive(composed[i])) {
      const info = describe(composed[i], composed.slice(i));
      if (info) {
        info.hops = i;
      }
      return info;
    }
  }
  const info = describe(raw && raw.nodeType === 1 ? raw : null, composed);
  if (info) {
    info.hops = -1;
  }
  return info;
};

const isOwnUI = (event) => {
  const composed = event.composedPath ? event.composedPath() : [];
  for (let i = 0; i < composed.length; i++) {
    if (
      composed[i] &&
      composed[i].tagName &&
      composed[i].tagName.toLowerCase() === INDICATOR_TAG
    ) {
      return true;
    }
  }
  return false;
};

const keyCategory = (key) => {
  if (!key) {
    return "other";
  }
  const named = [
    "Tab",
    "Enter",
    "Escape",
    "Backspace",
    "Delete",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "PageUp",
    "PageDown",
    " ",
  ];
  if (named.indexOf(key) !== -1) {
    return key === " " ? "Space" : key;
  }
  return key.length === 1 ? "char" : "other";
};

/**
 * Walk every element (piercing shadow roots) and collect visible controls
 */
export const collectVisibleControls = (root = globalThis.document) => {
  const controls = [];
  const vw = globalThis.innerWidth;
  const vh = globalThis.innerHeight;
  const visit = (scope, chain) => {
    if (!scope || controls.length >= MAX_CONTROLS) {
      return;
    }
    const nodes = scope.querySelectorAll("*");
    for (let i = 0; i < nodes.length && controls.length < MAX_CONTROLS; i++) {
      const el = nodes[i];
      const tag = el.tagName.toLowerCase();
      if (tag === INDICATOR_TAG) {
        continue;
      }
      if (isInteractive(el)) {
        const rect = el.getBoundingClientRect();
        if (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < vh &&
          rect.left < vw
        ) {
          const style = globalThis.getComputedStyle(el);
          if (style.visibility !== "hidden" && style.display !== "none") {
            controls.push({
              path: pathFromComposed(composedAncestors(el)),
              tag: tag,
              role: el.getAttribute("role") || "",
              label: labelFor(el),
              disabled:
                el.hasAttribute("disabled") ||
                el.getAttribute("aria-disabled") === "true",
              rect: roundRect(rect),
              opacity: parseFloat(style.opacity),
              color: style.color,
              background: style.backgroundColor,
              fontSize: parseFloat(style.fontSize) || 0,
            });
          }
        }
      }
      if (el.shadowRoot) {
        visit(el.shadowRoot, chain);
      }
    }
  };
  visit(root, []);
  return controls;
};

export class UXStudyRecorder {
  constructor() {
    this.session = null;
    this.active = false;
    this._t = Object.assign({}, UX_STUDY_T);
    this._lastMove = 0;
    this._lastMoveX = -100;
    this._lastMoveY = -100;
    this._hover = null;
    this._lastHref = "";
    this._lastScroll = 0;
    this._timers = [];
    this._handlers = {
      click: this._onClick.bind(this),
      move: this._onMove.bind(this),
      over: this._onOver.bind(this),
      out: this._onOut.bind(this),
      focus: this._onFocus.bind(this),
      key: this._onKey.bind(this),
      scroll: this._onScroll.bind(this),
      resize: this._onResize.bind(this),
      visibility: this._onVisibility.bind(this),
      pagehide: this._persist.bind(this),
    };
  }

  static requestAvailability() {
    if (!globalThis.HAXCMSUXStudyRecorder) {
      globalThis.HAXCMSUXStudyRecorder = new UXStudyRecorder();
    }
    return globalThis.HAXCMSUXStudyRecorder;
  }

  get now() {
    return Math.round(globalThis.performance.now() - this._epoch);
  }

  /**
   * Begin a new session, or resume the one in sessionStorage after a reload
   */
  start(options = {}) {
    if (options.t) {
      Object.keys(UX_STUDY_T).forEach((key) => {
        if (options.t[key]) {
          this._t[key] = options.t[key];
        }
      });
    }
    if (this.active) {
      return this.session;
    }
    const existing = options.resume ? safeStorage.get() : null;
    if (existing && existing.schema === UX_STUDY_SCHEMA && !existing.endedAt) {
      this.session = existing;
      this._epoch =
        globalThis.performance.now() -
        (Date.now() - Date.parse(existing.startedAt));
      this._push({ type: "resume" });
    } else if (options.resume) {
      return null;
    } else {
      const mq = (query) => {
        try {
          return globalThis.matchMedia(query).matches;
        } catch (e) {
          return false;
        }
      };
      this._epoch = globalThis.performance.now();
      this.session = {
        schema: UX_STUDY_SCHEMA,
        id: `uxs-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
        startedAt: new Date().toISOString(),
        endedAt: null,
        participant: clip(options.participant || "", 40),
        site: {
          name: clip(options.siteName || "", 80),
          theme: clip(options.theme || "", 60),
          path: globalThis.location.pathname,
        },
        env: {
          userAgent: globalThis.navigator.userAgent,
          language: globalThis.navigator.language,
          viewport: { w: globalThis.innerWidth, h: globalThis.innerHeight },
          dpr: globalThis.devicePixelRatio || 1,
          pointer: mq("(pointer: coarse)") ? "coarse" : "fine",
          reducedMotion: mq("(prefers-reduced-motion: reduce)"),
          colorScheme: mq("(prefers-color-scheme: dark)") ? "dark" : "light",
        },
        truncated: false,
        events: [],
        snapshots: [],
      };
      this._push({ type: "start", href: globalThis.location.pathname });
    }
    this.active = true;
    this._lastHref = globalThis.location.href;
    this._attach();
    this._snapshot("start");
    this._showIndicator();
    this._persist();
    return this.session;
  }

  /**
   * End the session; returns the finished session object
   */
  stop() {
    if (!this.session) {
      return null;
    }
    if (this.active) {
      this._closeHover();
      this._push({ type: "stop" });
      this.session.endedAt = new Date().toISOString();
      this.session.durationMs = this.now;
      this._detach();
      this.active = false;
      this._hideIndicator();
    }
    const finished = this.session;
    safeStorage.clear();
    return finished;
  }

  /**
   * Researcher marker that splits the session into tasks
   */
  mark(label) {
    if (!this.active) {
      return false;
    }
    this._push({ type: "mark", label: clip(label, 120) });
    this._snapshot("mark");
    this._persist();
    return true;
  }

  status() {
    return {
      active: this.active,
      events: this.session ? this.session.events.length : 0,
      durationMs: this.active ? this.now : 0,
    };
  }

  /**
   * Stop and hand the participant / researcher a JSON file
   */
  stopAndExport() {
    const finished = this.stop();
    if (!finished) {
      return null;
    }
    const name = `ux-study-${
      (finished.site.name || "site").replace(/[^a-z0-9-]+/gi, "-") || "site"
    }-${finished.startedAt.replace(/[:.]/g, "-")}.json`;
    try {
      const blob = new Blob([JSON.stringify(finished, null, 2)], {
        type: "application/json",
      });
      const url = globalThis.URL.createObjectURL(blob);
      const a = globalThis.document.createElement("a");
      a.href = url;
      a.download = name;
      globalThis.document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => globalThis.URL.revokeObjectURL(url), 1000);
    } catch (e) {
      // intentionally empty
    }
    return { session: finished, fileName: name };
  }

  // internals

  _push(event) {
    if (!this.session) {
      return;
    }
    if (this.session.events.length >= MAX_EVENTS) {
      // keep the meaningful events; only pointer samples are dropped
      if (event.type === "move") {
        this.session.truncated = true;
        return;
      }
    }
    event.t = this.now;
    this.session.events.push(event);
  }

  _attach() {
    const doc = globalThis.document;
    doc.addEventListener("click", this._handlers.click, true);
    doc.addEventListener("pointermove", this._handlers.move, {
      capture: true,
      passive: true,
    });
    doc.addEventListener("pointerover", this._handlers.over, true);
    doc.addEventListener("pointerout", this._handlers.out, true);
    doc.addEventListener("focusin", this._handlers.focus, true);
    doc.addEventListener("keydown", this._handlers.key, true);
    globalThis.addEventListener("scroll", this._handlers.scroll, {
      capture: true,
      passive: true,
    });
    globalThis.addEventListener("resize", this._handlers.resize);
    doc.addEventListener("visibilitychange", this._handlers.visibility);
    globalThis.addEventListener("pagehide", this._handlers.pagehide);
    // route + periodic control snapshots + persistence
    this._timers.push(setInterval(() => this._checkRoute(), 400));
    this._timers.push(
      setInterval(() => this._snapshot("interval"), SNAPSHOT_INTERVAL_MS),
    );
    this._timers.push(setInterval(() => this._persist(), 5000));
  }

  _detach() {
    const doc = globalThis.document;
    doc.removeEventListener("click", this._handlers.click, true);
    doc.removeEventListener("pointermove", this._handlers.move, true);
    doc.removeEventListener("pointerover", this._handlers.over, true);
    doc.removeEventListener("pointerout", this._handlers.out, true);
    doc.removeEventListener("focusin", this._handlers.focus, true);
    doc.removeEventListener("keydown", this._handlers.key, true);
    globalThis.removeEventListener("scroll", this._handlers.scroll, true);
    globalThis.removeEventListener("resize", this._handlers.resize);
    doc.removeEventListener("visibilitychange", this._handlers.visibility);
    globalThis.removeEventListener("pagehide", this._handlers.pagehide);
    this._timers.forEach((id) => clearInterval(id));
    this._timers = [];
  }

  _persist() {
    if (this.session && !safeStorage.set(this.session)) {
      // storage full: drop older pointer samples to stay under quota
      this.session.events = this.session.events.filter(
        (e, i) => e.type !== "move" || i % 2 === 0,
      );
      this.session.truncated = true;
      safeStorage.set(this.session);
    }
  }

  _onClick(event) {
    if (isOwnUI(event)) {
      return;
    }
    const target = resolveTarget(event);
    this._push({
      type: "click",
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      button: event.button,
      // detail 0 means keyboard-activated click
      keyboard: event.detail === 0,
      target: target,
    });
  }

  _onMove(event) {
    const t = globalThis.performance.now();
    if (t - this._lastMove < MOVE_SAMPLE_MS) {
      return;
    }
    const dx = event.clientX - this._lastMoveX;
    const dy = event.clientY - this._lastMoveY;
    if (dx * dx + dy * dy < MOVE_MIN_PX * MOVE_MIN_PX) {
      return;
    }
    this._lastMove = t;
    this._lastMoveX = event.clientX;
    this._lastMoveY = event.clientY;
    this._push({
      type: "move",
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      p: event.pointerType === "mouse" ? undefined : event.pointerType,
    });
  }

  _onOver(event) {
    if (isOwnUI(event)) {
      return;
    }
    const target = resolveTarget(event);
    if (!target || !target.interactive) {
      return;
    }
    if (this._hover && this._hover.target.path === target.path) {
      return;
    }
    this._closeHover();
    this._hover = { start: this.now, target: target };
  }

  _onOut(event) {
    if (!this._hover) {
      return;
    }
    const target = resolveTarget(event);
    if (target && target.path === this._hover.target.path) {
      const related = event.relatedTarget;
      // still inside the same control (moving between its own children)
      if (related && composedAncestors(related).length) {
        const fake = { composedPath: () => composedAncestors(related) };
        const next = resolveTarget(fake);
        if (next && next.path === this._hover.target.path) {
          return;
        }
      }
      this._closeHover();
    }
  }

  _closeHover() {
    if (!this._hover) {
      return;
    }
    const ms = this.now - this._hover.start;
    if (ms >= HOVER_MIN_MS) {
      this.session.events.push({
        type: "hover",
        t: this._hover.start,
        ms: ms,
        target: this._hover.target,
      });
    }
    this._hover = null;
  }

  _onFocus(event) {
    if (isOwnUI(event)) {
      return;
    }
    this._push({ type: "focus", target: resolveTarget(event) });
  }

  _onKey(event) {
    if (isOwnUI(event)) {
      return;
    }
    const k = keyCategory(event.key);
    // typed characters are counted as "char" only; never the character itself
    const target = resolveTarget(event);
    this._push({
      type: "key",
      k: k,
      mod: event.ctrlKey || event.metaKey || event.altKey ? 1 : 0,
      target: target ? { path: target.path, label: target.label } : null,
    });
  }

  _onScroll(event) {
    const t = globalThis.performance.now();
    if (t - this._lastScroll < 250) {
      return;
    }
    this._lastScroll = t;
    const doc = globalThis.document.scrollingElement;
    const composed = event.composedPath ? event.composedPath() : [];
    const scroller =
      composed[0] && composed[0].nodeType === 1 ? composed[0] : doc;
    const max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
    this._push({
      type: "scroll",
      y: Math.round(scroller.scrollTop),
      depth: Math.min(1, Math.round((scroller.scrollTop / max) * 100) / 100),
      root: scroller === doc,
      path: scroller === doc ? "" : pathFromComposed(composed),
    });
  }

  _onResize() {
    this._push({
      type: "viewport",
      w: globalThis.innerWidth,
      h: globalThis.innerHeight,
    });
  }

  _onVisibility() {
    this._closeHover();
    this._push({
      type: "visibility",
      hidden: globalThis.document.visibilityState === "hidden",
    });
    if (globalThis.document.visibilityState === "hidden") {
      this._persist();
    }
  }

  _checkRoute() {
    if (globalThis.location.href !== this._lastHref) {
      this._lastHref = globalThis.location.href;
      this._push({ type: "route", href: globalThis.location.pathname });
      // let the new page render before taking stock of its controls
      setTimeout(() => this._snapshot("route"), 800);
    }
  }

  _snapshot(reason) {
    if (!this.session) {
      return;
    }
    let controls = [];
    try {
      controls = collectVisibleControls();
    } catch (e) {
      controls = [];
    }
    this.session.snapshots.push({
      t: this.now,
      reason: reason,
      href: globalThis.location.pathname,
      viewport: { w: globalThis.innerWidth, h: globalThis.innerHeight },
      scrollY: Math.round(globalThis.scrollY || 0),
      controls: controls,
    });
  }

  _showIndicator() {
    let indicator = globalThis.document.querySelector(INDICATOR_TAG);
    if (!indicator) {
      indicator = globalThis.document.createElement(INDICATOR_TAG);
      globalThis.document.body.appendChild(indicator);
    }
    indicator.recorder = this;
    indicator.t = Object.assign({}, this._t);
  }

  _hideIndicator() {
    const indicator = globalThis.document.querySelector(INDICATOR_TAG);
    if (indicator) {
      indicator.remove();
    }
  }
}

/**
 * Always-visible pill so a participant knows recording is on
 */
export class HAXCMSUXStudyIndicator extends LitElement {
  static get tag() {
    return INDICATOR_TAG;
  }

  static get properties() {
    return {
      t: { type: Object },
      _elapsed: { type: String, state: true },
      _marking: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.t = Object.assign({}, UX_STUDY_T);
    this.recorder = null;
    this._elapsed = "0:00";
    this._marking = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick = setInterval(() => {
      if (this.recorder) {
        const s = Math.floor(this.recorder.status().durationMs / 1000);
        this._elapsed = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      }
    }, 1000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    super.disconnectedCallback();
  }

  static get styles() {
    return css`
      :host {
        position: fixed;
        inset-block-end: var(--ddd-spacing-4, 16px);
        inset-inline-start: var(--ddd-spacing-4, 16px);
        z-index: 100001;
        font-family: var(--ddd-font-navigation, sans-serif);
        font-size: var(--hax-ui-font-size-sm, 14px);
        color-scheme: light dark;
      }
      .pill {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-2, 8px);
        padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
        border-radius: var(--ddd-radius-rounded, 100px);
        border: var(--ddd-border-xs, 1px solid)
          var(--ddd-theme-default-limestoneGray, #a2aaad);
        background-color: var(--hax-ui-background-color, #fff);
        color: var(--hax-ui-color, #222);
        box-shadow: var(--ddd-boxShadow-sm, 0 1px 4px rgba(0, 0, 0, 0.2));
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--ddd-theme-default-original87Pink, #bc204b);
      }
      .label {
        font-weight: var(--ddd-font-weight-bold, 700);
      }
      .time {
        font-variant-numeric: tabular-nums;
      }
      button,
      input {
        font: inherit;
        color: inherit;
      }
      button {
        min-height: 32px;
        padding: 0 var(--ddd-spacing-2, 8px);
        border-radius: var(--ddd-radius-sm, 4px);
        border: var(--ddd-border-xs, 1px solid)
          var(--ddd-theme-default-limestoneGray, #a2aaad);
        background-color: var(--hax-ui-background-color-secondary, #e8e8e8);
        cursor: pointer;
      }
      button:focus-visible,
      input:focus-visible {
        outline: var(--ddd-border-sm, 2px solid)
          var(--ddd-theme-default-keystoneYellow, #ffd100);
        outline-offset: 2px;
      }
      input {
        min-height: 30px;
        width: 14em;
        padding: 0 var(--ddd-spacing-1, 4px);
        border-radius: var(--ddd-radius-sm, 4px);
        border: var(--ddd-border-xs, 1px solid)
          var(--ddd-theme-default-limestoneGray, #a2aaad);
        background-color: var(--hax-ui-background-color, #fff);
      }
      @media (prefers-color-scheme: dark) {
        .pill {
          background-color: var(--hax-ui-background-color, #1d1d1d);
          color: var(--hax-ui-color, #eee);
        }
        button {
          background-color: var(--hax-ui-background-color-secondary, #333);
        }
        input {
          background-color: var(--hax-ui-background-color, #1d1d1d);
        }
      }
    `;
  }

  render() {
    return html`
      <div class="pill" role="status" aria-live="polite">
        <span class="dot" aria-hidden="true"></span>
        <span class="label">${this.t.uxStudyRecording}</span>
        <span class="time">${this._elapsed}</span>
        ${
          this._marking
            ? html`<form @submit="${this._saveMark}">
                <input
                  aria-label="${this.t.uxStudyMarkPrompt}"
                  placeholder="${this.t.uxStudyMarkPrompt}"
                  @keydown="${this._markKey}"
                />
              </form>`
            : html`<button type="button" @click="${this._startMark}">
                ${this.t.uxStudyMark}
              </button>`
        }
        <button type="button" @click="${this._stop}">
          ${this.t.uxStudyStopAndExport}
        </button>
      </div>
    `;
  }

  async _startMark() {
    this._marking = true;
    await this.updateComplete;
    const input = this.shadowRoot.querySelector("input");
    if (input) {
      input.focus();
    }
  }

  _markKey(e) {
    if (e.key === "Escape") {
      this._marking = false;
    }
  }

  _saveMark(e) {
    e.preventDefault();
    const input = this.shadowRoot.querySelector("input");
    if (this.recorder && input && input.value.trim()) {
      this.recorder.mark(input.value);
    }
    this._marking = false;
  }

  _stop() {
    if (this.recorder) {
      this.recorder.stopAndExport();
    }
  }
}

if (!globalThis.customElements.get(INDICATOR_TAG)) {
  globalThis.customElements.define(INDICATOR_TAG, HAXCMSUXStudyIndicator);
}

/**
 * Merlin program: >developer/ux-study
 */
export const createUXStudyProgram = (context) => {
  const _t = (key, fallback) =>
    context && context.t && context.t[key] ? context.t[key] : fallback;
  return async (input, _values) => {
    const recorder = UXStudyRecorder.requestAvailability();
    const typed = input ? String(input).trim() : "";
    const results = [];
    if (!recorder.active) {
      results.push({
        title: typed
          ? _t("uxStudyStartFor", "Start UX study for {participant}").replace(
              "{participant}",
              () => typed,
            )
          : _t("uxStudyStart", "Start UX study recording"),
        icon: "av:fiber-manual-record",
        tags: ["developer", "ux", "study", "record", "usability"],
        more: _t(
          "uxStudyStartDescription",
          "Type a participant code (no names) before choosing, then use the site as normal",
        ),
        value: {
          target: context,
          method: "startUXStudy",
          args: [typed],
        },
        eventName: "super-daemon-element-method",
        path: ">developer/ux-study/start",
        context: [">"],
      });
    } else {
      results.push({
        title: typed
          ? _t("uxStudyMarkAs", "Mark task: {label}").replace(
              "{label}",
              () => typed,
            )
          : _t("uxStudyMarkHint", "Type a task name to mark it"),
        icon: "icons:bookmark",
        tags: ["developer", "ux", "study", "task", "mark"],
        value: {
          target: context,
          method: "markUXStudy",
          args: [typed],
        },
        eventName: "super-daemon-element-method",
        path: ">developer/ux-study/mark",
        context: [">"],
      });
      results.push({
        title: _t("uxStudyStopAndExport", "Stop and export"),
        icon: "icons:file-download",
        tags: ["developer", "ux", "study", "stop", "export"],
        value: {
          target: context,
          method: "stopUXStudy",
          args: [],
        },
        eventName: "super-daemon-element-method",
        path: ">developer/ux-study/stop",
        context: [">"],
      });
    }
    return results;
  };
};
