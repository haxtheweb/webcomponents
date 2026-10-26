/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, unsafeCSS } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { createScene, MOTION_CSS } from "./lib/motion-core.js";

const REPO_TREE = "https://github.com/haxtheweb/webcomponents/tree/HEAD/";

/**
 * `element-doc-player`
 * Living documentation for one web component: an animated walkthrough, the
 * demo markup, generated documentation and the haxProperties schema, with
 * copy buttons for HTML, JS import, npm install and CDN script.
 *
 * Data comes from two files that ship with the element:
 * - `<name>.docs.json`, generated from the element source (never hand edited)
 * - `<tag>.motion.json`, an optional storyboard that the player draws
 *
 * Without a storyboard the player still works; the Motion tab is left out.
 *
 * @demo demo/index.html
 * @element element-doc-player
 */
export class ElementDocPlayer extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "element-doc-player";
  }

  constructor() {
    super();
    this.docsSrc = "";
    this.motionSrc = "";
    this.tab = "";
    this.autoplay = false;
    this.demoHref = "";
    this.docsHref = "";
    this.docs = null;
    this.scene = null;
    this.copied = "";
    this.loadError = "";
    this.liveState = "";
    this._time = 0;
    this.playing = false;
    this.finished = false;
    this._raf = 0;
    this._last = 0;
    this._ctl = null;
    this._sceneRef = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      motion: "Walkthrough",
      demo: "Demo",
      docs: "Documentation",
      schema: "Schema",
      play: "Play",
      pause: "Pause",
      replay: "Replay",
      scrub: "Scrub animation",
      readAsText: "Read this walkthrough as text",
      copy: "Copy",
      copyHtml: "HTML",
      copyImport: "JS import",
      copyNpm: "npm install",
      copyCdn: "CDN script",
      copySchema: "Copy schema JSON",
      copied: "Copied",
      copyFailed: "Copy failed",
      attribute: "Attribute",
      type: "Type",
      defaultValue: "Default",
      description: "Description",
      haxControl: "HAX control",
      attributes: "Attributes and properties",
      slots: "Slots",
      events: "Events",
      none: "None",
      demoMarkup: "Demo markup",
      runLive: "Run live demo here",
      openDemoSource: "Open demo source",
      openDocs: "Open full documentation",
      source: "Source",
      liveNote:
        "Loads the element and renders the markup above. Pages that block outside scripts show a message instead.",
      liveOk: "Live element rendered.",
      liveFail:
        "The live demo could not load here. Open the demo source or paste the HTML into a page.",
      loading: "Loading documentation",
      loadFailed: "Could not load",
      reviewed: "Walkthrough reviewed",
      awaitingReview: "Walkthrough awaiting review",
      stale: "Walkthrough may be out of date",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      docsSrc: { type: String, attribute: "docs-src" },
      motionSrc: { type: String, attribute: "motion-src" },
      tab: { type: String, reflect: true },
      autoplay: { type: Boolean },
      demoHref: { type: String, attribute: "demo-href" },
      docsHref: { type: String, attribute: "docs-href" },
      docs: { type: Object },
      scene: { type: Object },
      copied: { type: String },
      loadError: { type: String },
      liveState: { type: String },
      playing: { type: Boolean, state: true },
      finished: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --edp-main: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --edp-ground: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --edp-second: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
          --edp-accent: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          --edp-line: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --edp-panel: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          --main: var(--edp-main);
          --ground: var(--edp-ground);
          --second: var(--edp-second);
          --accent: var(--edp-accent);
          --motion-sans: var(--ddd-font-primary, sans-serif);
          color: var(--edp-main);
          background: var(--edp-ground);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-3xs);
          line-height: var(--ddd-lh-150);
          border: 1px solid var(--edp-line);
          border-radius: var(--ddd-radius-xs);
          overflow: hidden;
          text-align: left;
          container-type: inline-size;
        }
        header {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          align-items: baseline;
          justify-content: space-between;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-4) 0;
        }
        h2 {
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          overflow-wrap: anywhere;
        }
        .meta {
          margin: var(--ddd-spacing-1) 0 0;
          color: var(--edp-second);
        }
        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
        }
        .badge {
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--edp-second);
          border: 1px solid var(--edp-line);
          border-radius: var(--ddd-radius-xs);
          padding: 0 var(--ddd-spacing-2);
          overflow-wrap: anywhere;
        }
        .badge.ok {
          color: var(--edp-main);
          border-color: var(--edp-main);
        }
        .badge.warn {
          color: var(--edp-accent);
          border-color: var(--edp-accent);
        }
        nav {
          display: flex;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-3) 0;
          border-bottom: 1px solid var(--edp-line);
          overflow-x: auto;
        }
        nav button {
          font: inherit;
          color: var(--edp-second);
          background: none;
          border: 0;
          border-bottom: 2px solid transparent;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          cursor: pointer;
          white-space: nowrap;
        }
        nav button[aria-selected="true"] {
          color: var(--edp-main);
          border-bottom-color: var(--edp-main);
          font-weight: var(--ddd-font-weight-bold);
        }
        button:focus-visible,
        a:focus-visible,
        summary:focus-visible {
          outline: 2px solid var(--edp-accent);
          outline-offset: 2px;
        }
        section[role="tabpanel"] {
          padding: var(--ddd-spacing-4);
        }
        section[hidden] {
          display: none;
        }
        .stage {
          border: 1px solid var(--edp-line);
          border-radius: var(--ddd-radius-xs);
          overflow: hidden;
          background: var(--edp-ground);
        }
        .now {
          display: none;
          margin: var(--ddd-spacing-3) 0 0;
          min-height: 3lh;
        }
        .now:empty {
          min-height: 0;
        }
        .now b {
          display: block;
          color: var(--edp-main);
        }
        /* small screens: the film's own captions are too small to read, so
           the current beat is repeated as text under it */
        @container (max-width: 560px) {
          .now {
            display: block;
            color: var(--edp-second);
          }
          header,
          section[role="tabpanel"] {
            padding-left: var(--ddd-spacing-3);
            padding-right: var(--ddd-spacing-3);
          }
          .time {
            min-width: 0;
          }
        }
        svg {
          display: block;
          width: 100%;
          height: auto;
        }
        .controls,
        .beats,
        .row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-3);
        }
        .btn {
          font: inherit;
          color: var(--edp-main);
          background: var(--edp-ground);
          border: 1px solid var(--edp-line);
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          cursor: pointer;
          text-decoration: none;
        }
        .btn:hover {
          border-color: var(--edp-main);
        }
        .btn.primary {
          background: var(--edp-main);
          color: var(--edp-ground);
          border-color: var(--edp-main);
        }
        input[type="range"] {
          flex: 1;
          min-width: 8rem;
          accent-color: var(--edp-main);
        }
        .time {
          font-family: ui-monospace, Menlo, Consolas, monospace;
          font-size: var(--ddd-font-size-4xs);
          color: var(--edp-second);
          min-width: 6rem;
          text-align: right;
        }
        summary {
          font-family: inherit;
          font-size: inherit;
          font-weight: var(--ddd-font-weight-regular);
          color: var(--edp-main);
          cursor: pointer;
        }
        details {
          margin-top: var(--ddd-spacing-3);
          color: var(--edp-second);
        }
        details ol {
          margin: var(--ddd-spacing-2) 0 0;
          padding-left: var(--ddd-spacing-5);
        }
        h3 {
          margin: var(--ddd-spacing-5) 0 var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--edp-second);
          font-weight: var(--ddd-font-weight-bold);
        }
        h3:first-child {
          margin-top: 0;
        }
        pre {
          margin: 0;
          padding: var(--ddd-spacing-3);
          background: var(--edp-panel);
          border: 1px solid var(--edp-line);
          border-radius: var(--ddd-radius-xs);
          overflow: auto;
          max-height: 26rem;
          font-family: ui-monospace, Menlo, Consolas, monospace;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          color: var(--edp-main);
        }
        code {
          font-family: ui-monospace, Menlo, Consolas, monospace;
          font-size: var(--ddd-font-size-4xs);
          background: var(--edp-panel);
          padding: 0 var(--ddd-spacing-1);
        }
        .table-wrap {
          overflow-x: auto;
          border: 1px solid var(--edp-line);
          border-radius: var(--ddd-radius-xs);
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 36rem;
        }
        th,
        td {
          text-align: left;
          vertical-align: top;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: 1px solid var(--edp-line);
        }
        th {
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--edp-second);
          background: var(--edp-panel);
        }
        tr:last-child td {
          border-bottom: 0;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
        }
        .note {
          margin: var(--ddd-spacing-2) 0 0;
          color: var(--edp-second);
        }
        .demo-mount {
          margin-top: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
          border: 1px dashed var(--edp-line);
        }
        footer {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          align-items: center;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-top: 1px solid var(--edp-line);
          background: var(--edp-panel);
        }
        footer .label {
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--edp-second);
          margin-right: var(--ddd-spacing-1);
        }
        footer .grow {
          flex: 1;
        }
        a {
          color: var(--edp-main);
          font-weight: var(--ddd-font-weight-regular);
        }
        .status {
          padding: var(--ddd-spacing-4);
        }
        .live {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }
        ${unsafeCSS(MOTION_CSS)}
      `,
    ];
  }

  /** tabs that have something to show */
  get tabList() {
    const tabs = [];
    if (this.scene) {
      tabs.push(["motion", this.t.motion]);
    }
    tabs.push(
      ["demo", this.t.demo],
      ["docs", this.t.docs],
      ["schema", this.t.schema],
    );
    return tabs;
  }

  get activeTab() {
    const keys = this.tabList.map((x) => x[0]);
    return keys.includes(this.tab) ? this.tab : keys[0];
  }

  /** review state shown as a badge: reviewed, awaiting, or stale */
  get reviewState() {
    if (!this.scene || !this.docs) {
      return "";
    }
    const hash = this.docs.surfaceHash;
    if (this.scene.surfaceHash && this.scene.surfaceHash !== hash) {
      return "stale";
    }
    const r = this.scene.review;
    if (r && r.status === "approved" && r.hash === hash) {
      return "reviewed";
    }
    return "awaiting";
  }

  /** snippets handed out by the copy buttons */
  get snippets() {
    const d = this.docs;
    if (!d) {
      return {};
    }
    return {
      html: d.demoHtml || `<${d.tag}></${d.tag}>`,
      import: `import "${d.import}";`,
      npm: d.install,
      cdn: `<script type="module" src="${d.cdn}"></script>`,
      schema: JSON.stringify(d.hax, null, 2),
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadAll();
  }

  disconnectedCallback() {
    this._pause();
    super.disconnectedCallback();
  }

  async _loadAll() {
    await Promise.all([
      this._load("docs", this.docsSrc),
      this._load("scene", this.motionSrc),
    ]);
  }

  async _load(prop, src) {
    if (!src || this[prop]) {
      return;
    }
    try {
      const res = await fetch(new URL(src, this._baseForLoads()));
      if (!res.ok) {
        throw new Error(String(res.status));
      }
      this[prop] = await res.json();
    } catch {
      // the motion file is optional; a missing docs file is worth saying
      if (prop === "docs") {
        this.loadError = `${this.t.loadFailed} ${src}`;
      }
    }
  }

  _baseForLoads() {
    return globalThis.document ? globalThis.document.baseURI : import.meta.url;
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has("docsSrc") || changed.has("motionSrc")) {
      this._loadAll();
    }
    if (changed.has("scene") || changed.has("docs")) {
      this._buildScene();
    }
    if (changed.has("tab") && this.activeTab !== "motion") {
      this._pause();
    }
  }

  _buildScene() {
    const svg = this.shadowRoot && this.shadowRoot.querySelector("svg");
    this._pause();
    this._ctl = null;
    if (!svg || !this.scene || !this.docs) {
      return;
    }
    this._ctl = createScene(svg, this.scene, this.docs);
    this._time = 0;
    const reduce =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this._reduce = reduce;
    const beats = this.scene.beats || [];
    const poster =
      this.scene.poster !== undefined && this.scene.poster !== null
        ? this.scene.poster
        : (beats[1] && typeof beats[1].t === "number" ? beats[1].t : 4) + 1.5;
    this._seek(reduce ? poster : 0);
    if (this.autoplay && !reduce && this.activeTab === "motion") {
      this._play();
    }
  }

  _seek(time) {
    if (!this._ctl) {
      return;
    }
    const dur = this._ctl.duration;
    this._time = Math.max(0, Math.min(dur, time));
    this._ctl.render(this._time);
    const scrub = this.shadowRoot.querySelector("#scrub");
    const label = this.shadowRoot.querySelector("#time");
    if (scrub) {
      scrub.value = String(Math.round((this._time / dur) * 1000));
    }
    if (label) {
      label.textContent = `${this._time.toFixed(1)} / ${dur.toFixed(1)}s`;
    }
    this._showBeat();
  }

  /** the beat on screen, as text, for small screens */
  _showBeat() {
    const now = this.shadowRoot.querySelector("#now");
    const beats = (this.scene && this.scene.beats) || [];
    if (!now) {
      return;
    }
    let cur = null;
    for (const b of beats) {
      if (b.t <= this._time + 0.05) {
        cur = b;
      }
    }
    const key = cur ? cur.title : "";
    if (now.dataset.key === key) {
      return;
    }
    now.dataset.key = key;
    now.textContent = "";
    if (cur) {
      const b = globalThis.document.createElement("b");
      b.textContent = cur.title;
      now.append(b, cur.text || "");
    }
  }

  _play() {
    if (!this._ctl || this.playing) {
      return;
    }
    if (this._time >= this._ctl.duration - 0.05) {
      this._time = 0;
    }
    this.playing = true;
    this._last = globalThis.performance.now();
    this._setPlayLabel();
    const tick = (now) => {
      if (!this.playing) {
        return;
      }
      this._time += (now - this._last) / 1000;
      this._last = now;
      if (this._time >= this._ctl.duration) {
        this._seek(this._ctl.duration);
        this._pause();
        return;
      }
      this._seek(this._time);
      this._raf = globalThis.requestAnimationFrame(tick);
    };
    this._raf = globalThis.requestAnimationFrame(tick);
  }

  _pause() {
    this.playing = false;
    globalThis.cancelAnimationFrame(this._raf);
    this._setPlayLabel();
  }

  _setPlayLabel() {
    this.finished = Boolean(
      this._ctl && this._time >= this._ctl.duration - 0.05,
    );
  }

  _togglePlay() {
    if (this.playing) {
      this._pause();
    } else {
      this._play();
    }
  }

  _scrub(e) {
    this._pause();
    if (this._ctl) {
      this._seek((Number(e.target.value) / 1000) * this._ctl.duration);
    }
  }

  _jump(beat) {
    this._pause();
    this._seek(beat.t + 0.9);
  }

  _pick(key) {
    this.tab = key;
    this.dispatchEvent(
      new CustomEvent("element-doc-player-tab", {
        detail: key,
        bubbles: true,
        composed: true,
      }),
    );
  }

  _tabKeys(e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") {
      return;
    }
    e.preventDefault();
    const keys = this.tabList.map((x) => x[0]);
    const i = keys.indexOf(this.activeTab);
    const next =
      keys[(i + (e.key === "ArrowRight" ? 1 : keys.length - 1)) % keys.length];
    this._pick(next);
    this.updateComplete.then(() => {
      const el = this.shadowRoot.querySelector(`#t-${next}`);
      if (el) {
        el.focus();
      }
    });
  }

  async _copy(key) {
    const text = this.snippets[key] || "";
    let ok = false;
    try {
      // eslint-disable-next-line baseline-js/use-baseline -- try/catch falls back to execCommand copy
      await globalThis.navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = this._copyFallback(text);
    }
    this.copied = `${key}:${ok ? "ok" : "fail"}`;
    globalThis.clearTimeout(this._copyTimer);
    this._copyTimer = globalThis.setTimeout(() => (this.copied = ""), 1400);
    this.dispatchEvent(
      new CustomEvent("element-doc-player-copy", {
        detail: { kind: key, ok },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _copyFallback(text) {
    try {
      const ta = globalThis.document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      globalThis.document.body.appendChild(ta);
      ta.select();
      const ok = globalThis.document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }

  async _runLive() {
    const d = this.docs;
    this.liveState = "loading";
    try {
      try {
        await import(/* @vite-ignore */ d.import);
      } catch {
        await import(/* @vite-ignore */ d.cdn);
      }
      const mount = this.shadowRoot.querySelector("#mount");
      mount.innerHTML = d.demoHtml;
      this.liveState = "ok";
    } catch {
      this.liveState = "fail";
    }
  }

  copyLabel(key, label) {
    if (this.copied === `${key}:ok`) {
      return this.t.copied;
    }
    return this.copied === `${key}:fail` ? this.t.copyFailed : label;
  }

  renderBadges(d) {
    const state = this.reviewState;
    return html`<div class="badges">
      <span class="badge">${d.package}@${d.version}</span>
      <span class="badge">${d.license || ""}</span>
      ${state === "reviewed"
        ? html`<span class="badge ok">${this.t.reviewed}</span>`
        : state === "awaiting"
          ? html`<span class="badge">${this.t.awaitingReview}</span>`
          : state === "stale"
            ? html`<span class="badge warn">${this.t.stale}</span>`
            : ""}
    </div>`;
  }

  renderMotion() {
    const beats = (this.scene && this.scene.beats) || [];
    return html`<section
      role="tabpanel"
      id="p-motion"
      aria-labelledby="t-motion"
      ?hidden="${this.activeTab !== "motion"}"
    >
      <div class="stage">
        <svg role="img" aria-label="${this.docs ? this.docs.tag : ""}"></svg>
      </div>
      <p class="now" id="now" aria-hidden="true"></p>
      <div class="controls">
        <button
          class="btn primary"
          id="play"
          aria-pressed="${this.playing}"
          @click="${this._togglePlay}"
        >
          ${this.playing
            ? this.t.pause
            : this.finished
              ? this.t.replay
              : this.t.play}
        </button>
        <input
          type="range"
          id="scrub"
          min="0"
          max="1000"
          value="0"
          aria-label="${this.t.scrub}"
          @input="${this._scrub}"
        />
        <span class="time" id="time">0.0 / 0.0s</span>
      </div>
      <div class="beats">
        ${beats.map(
          (b, i) =>
            html`<button class="btn" @click="${() => this._jump(b)}">
              ${i + 1} ${b.title}
            </button>`,
        )}
      </div>
      <details>
        <summary>${this.t.readAsText}</summary>
        <ol>
          ${beats.map((b) => html`<li>${b.title}. ${b.text}</li>`)}
        </ol>
      </details>
    </section>`;
  }

  renderDemo(d, demoHref) {
    return html`<section
      role="tabpanel"
      id="p-demo"
      aria-labelledby="t-demo"
      ?hidden="${this.activeTab !== "demo"}"
    >
      <h3>${this.t.demoMarkup}</h3>
      <pre>${d.demoHtml}</pre>
      <div class="row">
        <button class="btn primary" @click="${this._runLive}">
          ${this.t.runLive}
        </button>
        ${demoHref
          ? html`<a
              class="btn"
              href="${demoHref}"
              target="_blank"
              rel="noopener"
              >${this.t.openDemoSource}</a
            >`
          : ""}
      </div>
      <p class="note">
        ${this.liveState === "ok"
          ? this.t.liveOk
          : this.liveState === "fail"
            ? this.t.liveFail
            : this.t.liveNote}
      </p>
      <div class="demo-mount" id="mount" ?hidden="${!this.liveState}"></div>
    </section>`;
  }

  renderDocs(d, docsHref) {
    return html`<section
      role="tabpanel"
      id="p-docs"
      aria-labelledby="t-docs"
      ?hidden="${this.activeTab !== "docs"}"
    >
      <h3>${this.t.attributes}</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${this.t.attribute}</th>
              <th>${this.t.type}</th>
              <th>${this.t.defaultValue}</th>
              <th>${this.t.description}</th>
              <th>${this.t.haxControl}</th>
            </tr>
          </thead>
          <tbody>
            ${d.attributes.length
              ? d.attributes.map(
                  (a) =>
                    html`<tr>
                      <td><code>${a.name}</code></td>
                      <td>${a.type}</td>
                      <td>
                        ${a.default === ""
                          ? "-"
                          : html`<code>${a.default}</code>`}
                      </td>
                      <td>${a.description || "-"}</td>
                      <td>
                        ${a.hax
                          ? `${a.hax.input}${a.hax.options ? `: ${Object.keys(a.hax.options).join(", ")}` : ""}`
                          : "-"}
                      </td>
                    </tr>`,
                )
              : html`<tr>
                  <td colspan="5">${this.t.none}</td>
                </tr>`}
          </tbody>
        </table>
      </div>
      <h3>${this.t.slots}</h3>
      <div class="chips">
        ${d.slots.length
          ? d.slots.map((s) => html`<code>${s}</code>`)
          : this.t.none}
      </div>
      <h3>${this.t.events}</h3>
      <div class="chips">
        ${d.events.length
          ? d.events.map((s) => html`<code>${s}</code>`)
          : this.t.none}
      </div>
      ${docsHref
        ? html`<div class="row">
            <a class="btn" href="${docsHref}" target="_blank" rel="noopener"
              >${this.t.openDocs}</a
            >
          </div>`
        : ""}
    </section>`;
  }

  renderSchema(d) {
    return html`<section
      role="tabpanel"
      id="p-schema"
      aria-labelledby="t-schema"
      ?hidden="${this.activeTab !== "schema"}"
    >
      <div class="row">
        <h3>haxProperties</h3>
        <span class="grow"></span>
        <button class="btn" @click="${() => this._copy("schema")}">
          ${this.copyLabel("schema", this.t.copySchema)}
        </button>
      </div>
      <pre>${JSON.stringify(d.hax, null, 2)}</pre>
    </section>`;
  }

  render() {
    const d = this.docs;
    if (!d) {
      return html`<div class="status" role="status">
        ${this.loadError || this.t.loading}
      </div>`;
    }
    const tree = d.source ? REPO_TREE + d.source.path : "";
    const demoHref = this.demoHref || (tree ? `${tree}/demo/index.html` : "");
    const docsHref = this.docsHref || (tree ? `${tree}#readme` : "");
    return html`
      <header>
        <div>
          <h2>&lt;${d.tag}&gt;</h2>
          <p class="meta">
            ${d.title}${d.description ? ` - ${d.description}` : ""}
          </p>
        </div>
        ${this.renderBadges(d)}
      </header>
      <nav role="tablist" aria-label="${d.tag}" @keydown="${this._tabKeys}">
        ${this.tabList.map(
          ([key, label]) =>
            html`<button
              role="tab"
              id="t-${key}"
              aria-controls="p-${key}"
              aria-selected="${this.activeTab === key}"
              tabindex="${this.activeTab === key ? 0 : -1}"
              @click="${() => this._pick(key)}"
            >
              ${label}
            </button>`,
        )}
      </nav>
      ${this.scene ? this.renderMotion() : ""} ${this.renderDemo(d, demoHref)}
      ${this.renderDocs(d, docsHref)} ${this.renderSchema(d)}
      <footer>
        <span class="label">${this.t.copy}</span>
        <button class="btn" @click="${() => this._copy("html")}">
          ${this.copyLabel("html", this.t.copyHtml)}
        </button>
        <button class="btn" @click="${() => this._copy("import")}">
          ${this.copyLabel("import", this.t.copyImport)}
        </button>
        <button class="btn" @click="${() => this._copy("npm")}">
          ${this.copyLabel("npm", this.t.copyNpm)}
        </button>
        <button class="btn" @click="${() => this._copy("cdn")}">
          ${this.copyLabel("cdn", this.t.copyCdn)}
        </button>
        <span class="grow"></span>
        ${tree
          ? html`<a href="${tree}" target="_blank" rel="noopener"
              >${this.t.source}</a
            >`
          : ""}
      </footer>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ElementDocPlayer.tag, ElementDocPlayer);
