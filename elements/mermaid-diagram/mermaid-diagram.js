/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  canDDDBlockFullscreen,
  isDDDBlockFullscreen,
  toggleDDDBlockFullscreen,
  listenDDDBlockFullscreen,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import {
  flowchartFromDb,
  parseFlowchartSource,
  plainLabel,
} from "./lib/flowchart-text.js";

// the full screen helpers also know the webkit prefixed API
const FULLSCREEN = { webkit: true };
// wait this long after the last edit before drawing again
const EDIT_DELAY = 300;
// Mermaid diagram types that get their own word in the block label
const TYPE_LABELS = {
  flowchart: "flowchart",
  "flowchart-v2": "flowchart",
  graph: "flowchart",
  sequence: "sequence",
};
// config keys a diagram's own text (an init directive or front matter) may
// never change, added to the ones Mermaid already protects
const LOCKED_CONFIG = [
  "secure",
  "securityLevel",
  "startOnLoad",
  "maxTextSize",
  "suppressErrorRendering",
  "maxEdges",
  "htmlLabels",
];
// what never belongs in a drawing, whatever produced it
const BLOCKED_TAGS = "script,foreignObject,iframe,object,embed,link,meta,base";

let mermaidLoading = null;
let renderQueue = Promise.resolve();
let renderCount = 0;

/**
 * Load the vendored Mermaid build (lib/mermaid/mermaid.min.js, MIT) the
 * first time a diagram needs it. It is a classic script that sets
 * globalThis.mermaid, loaded through es-global-bridge like the other
 * vendored libraries in this repo, so nothing about Mermaid is in the
 * module graph and nothing loads until a diagram is on screen.
 * @returns {Promise<Object>} the mermaid API
 */
function loadMermaid() {
  const ready = () =>
    globalThis.mermaid && typeof globalThis.mermaid.render === "function";
  if (ready()) {
    return Promise.resolve(globalThis.mermaid);
  }
  if (!mermaidLoading) {
    mermaidLoading = ESGlobalBridgeStore.import(
      "mermaid",
      new URL("./lib/mermaid/mermaid.min.js", import.meta.url).href,
    )
      .then(() => {
        if (!ready()) {
          throw new Error("Mermaid did not load");
        }
        return globalThis.mermaid;
      })
      .catch((error) => {
        // let a later diagram (or a later edit) try again
        mermaidLoading = null;
        throw error;
      });
  }
  return mermaidLoading;
}

/**
 * Mermaid keeps one configuration for the page, and each diagram here has
 * its own colours, so drawings take turns.
 * @param {Function} job returns a promise
 * @returns {Promise}
 */
function inTurn(job) {
  const run = renderQueue.then(job, job);
  renderQueue = run.catch(() => {});
  return run;
}

/**
 * A computed colour as #rrggbb, the form Mermaid's theme maths reads.
 * Computed values come back as rgb() / rgba() or, for color-mix(), as
 * color(srgb r g b); anything else is returned as is.
 * @param {String} value
 * @returns {String}
 */
function toHex(value) {
  const text = String(value || "").trim();
  const open = text.indexOf("(");
  const close = text.lastIndexOf(")");
  if (open === -1 || close < open) {
    return text;
  }
  const kind = text.slice(0, open).trim();
  const parts = text
    .slice(open + 1, close)
    .split(/[\s,/]+/)
    .filter((part) => part !== "");
  let channels = null;
  if (kind === "rgb" || kind === "rgba") {
    channels = parts.slice(0, 3).map((part) => parseFloat(part));
  } else if (kind === "color" && parts[0] === "srgb") {
    channels = parts.slice(1, 4).map((part) => parseFloat(part) * 255);
  }
  if (!channels || channels.length !== 3 || channels.some(Number.isNaN)) {
    return text;
  }
  return (
    "#" +
    channels
      .map((channel) =>
        Math.max(0, Math.min(255, Math.round(channel)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/** rough lightness (0 to 1) of a #rrggbb colour */
function lightness(hex) {
  if (hex.length !== 7 || hex[0] !== "#") {
    return 0;
  }
  const channel = (at) => parseInt(hex.slice(at, at + 2), 16) / 255;
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/**
 * `mermaid-diagram`
 * A diagram written as text (Mermaid), drawn in the page with a text
 * alternative.
 *
 * The source is the element's own content: a `<pre>` in the light DOM,
 * saved exactly as written, so without JavaScript, in a feed or under
 * server side rendering the diagram is still readable text. Mermaid is
 * loaded only when the diagram comes near the screen.
 *
 * The drawing follows the page: its colours are read from DDD tokens at
 * draw time (palette tint for fills, palette marker for lines, the DDD
 * text colour) and it is drawn again when the colour scheme changes.
 *
 * The text alternative is real text in the page. An authored description
 * (the description slot or attribute, or accDescr in the source) wins; for
 * flowcharts without one, an ordered list is written from the graph.
 *
 * @slot - the Mermaid source, in a pre
 * @slot caption - optional caption shown below the diagram
 * @slot description - optional authored text alternative (rich text)
 * @csspart frame - the block frame
 * @csspart diagram - the area the drawing is in
 * @csspart caption - the caption below the drawing
 * @cssprop --mermaid-diagram-surface - background behind the drawing
 * @cssprop --mermaid-diagram-max-height - tallest the drawing area gets
 *   before it scrolls
 * @fires mermaid-diagram-rendered - a drawing was shown;
 *   detail { diagramType }
 * @fires mermaid-diagram-error - the source could not be drawn;
 *   detail { message }
 * @demo demo/index.html
 * @element mermaid-diagram
 */
export class MermaidDiagram extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "mermaid-diagram";
  }

  constructor() {
    super();
    this.diagramTitle = "";
    this.code = "";
    this.description = "";
    this.src = "";
    this.showSource = false;
    this.showDescription = false;
    this.accentColor = "";
    this._status = "idle";
    this._error = "";
    this._errorDetail = "";
    this._diagramType = "";
    this._flow = null;
    this._sourceDescription = "";
    this._hasCaption = false;
    this._hasDescriptionSlot = false;
    this._editing = false;
    this._fullscreen = false;
    this._presenting = false;
    this._scrollable = false;
    this._remote = null;
    this._visible = false;
    this._renderToken = 0;
    this._themeKey = "";
    this._fullscreenChanged = this._fullscreenChanged.bind(this);
    this._themeMayHaveChanged = this._themeMayHaveChanged.bind(this);
    this.t = this.t || {};
    this.t = {
      ...this.t,
      diagram: "Diagram",
      flowchart: "flowchart",
      sequence: "sequence",
      source: "Source",
      textAlternative: "Text alternative",
      present: "Present",
      exitPresent: "Exit presentation",
      loading: "Loading the diagram",
      empty: "Nothing to draw yet. Add the diagram source.",
      error: "Error",
      parseError: "This diagram could not be drawn. Check the source.",
      loadError: "The diagram library could not be loaded.",
      srcError: "The diagram file could not be loaded.",
      decision: "decision",
      end: "end",
      goTo: "go to {target}",
      ifGoTo: "if {label}, go to {target}",
      describedBySource: "Diagram described by its source.",
      scrollable: "Diagram, scrollable",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** visible title of the diagram, shown in the block header */
      diagramTitle: { type: String, attribute: "diagram-title" },
      /**
       * the Mermaid source. It mirrors the pre in the light DOM: setting it
       * writes the pre, and it is never saved as an attribute.
       */
      code: { type: String },
      /** authored text alternative; the description slot wins over it */
      description: { type: String },
      /** optional .mmd file to load the source from (http, https or relative) */
      src: { type: String },
      /** show the source next to the drawing */
      showSource: { type: Boolean, attribute: "show-source", reflect: true },
      /** show the text alternative below the drawing */
      showDescription: {
        type: Boolean,
        attribute: "show-description",
        reflect: true,
      },
      /** colour of the header chip (DDD accent names) */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      _status: { state: true },
      _error: { state: true },
      _errorDetail: { state: true },
      _diagramType: { state: true },
      _flow: { state: true },
      _sourceDescription: { state: true },
      _hasCaption: { state: true },
      _hasDescriptionSlot: { state: true },
      _editing: { state: true },
      _fullscreen: { state: true },
      _presenting: { state: true },
      _scrollable: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      DDDAccentStyles,
      DDDStatusTokens,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) var(--ddd-spacing-0);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host([hidden]),
        [hidden] {
          display: none !important;
        }
        /* accent-color on the element paints the chip, nothing else: node
           colours come from the palette and the diagram */
        :host([accent-color]) .ddd-block {
          --ddd-block-chip-background: var(--ddd-accent-color);
          --ddd-block-chip-color: var(--ddd-accent-color-ink);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .ddd-block {
          position: relative;
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-4);
        }
        .work {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(min(100%, 280px), 1fr)
          );
          gap: var(--ddd-spacing-4);
          align-items: start;
        }
        figure {
          margin: var(--ddd-spacing-0);
          min-width: 0;
        }
        .panel {
          min-width: 0;
        }
        .panel-label {
          display: block;
          margin-bottom: var(--ddd-spacing-1);
        }
        .surface {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
          background-color: var(
            --mermaid-diagram-surface,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
        }
        /* a wide diagram scrolls here, never the page */
        .canvas {
          max-width: 100%;
          max-height: var(--mermaid-diagram-max-height, none);
          overflow: auto;
          padding: var(--ddd-spacing-2);
        }
        .canvas:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .stage svg {
          display: block;
          margin: var(--ddd-spacing-0) auto;
          max-width: none;
        }
        .source {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }
        ::slotted(pre) {
          margin: var(--ddd-spacing-0);
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          tab-size: 2;
        }
        .message {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
        }
        /* an error is meaning, so it takes a status token, never the
           accent: signal colour, solid line, its own icon and the word */
        .message.problem {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-3);
          border: var(--ddd-border-size-sm) var(--ddd-status-missing-line)
            var(--ddd-status-missing-signal);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-status-missing-bg);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-icon-color: var(--ddd-status-missing-ink);
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .problem-word {
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-missing-ink);
        }
        .problem-detail {
          grid-column: 2;
          margin: var(--ddd-spacing-1) var(--ddd-spacing-0) var(--ddd-spacing-0);
          font-family: var(--ddd-font-mono, monospace);
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        figcaption {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .alt-panel {
          margin-top: var(--ddd-spacing-4);
        }
        .alt {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .alt ol {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-6);
        }
        .alt li::marker {
          color: var(
            --ddd-palette-marker,
            light-dark(
              var(--ddd-theme-default-beaverBlue),
              var(--ddd-theme-default-pughBlue)
            )
          );
          font-weight: var(--ddd-font-weight-bold);
        }
        .alt p {
          margin: var(--ddd-spacing-0);
        }
        .step {
          font-weight: var(--ddd-font-weight-bold);
        }
        /* presenting: the frame fills the screen and the drawing scales to
           fit it. :fullscreen where the browser has it, .presenting (a
           fixed overlay) where it does not. */
        .ddd-block:fullscreen,
        .ddd-block.presenting {
          display: flex;
          flex-direction: column;
          overflow: auto;
          border-radius: var(--ddd-radius-0);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .ddd-block.presenting {
          position: fixed;
          inset: var(--ddd-spacing-0);
          z-index: var(--ddd-z-modal, 10000);
        }
        .ddd-block:fullscreen .ddd-block-body,
        .ddd-block.presenting .ddd-block-body {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .ddd-block:fullscreen .work,
        .ddd-block.presenting .work,
        .ddd-block:fullscreen figure,
        .ddd-block.presenting figure {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .ddd-block:fullscreen .canvas,
        .ddd-block.presenting .canvas {
          flex: 1 1 auto;
          min-height: 0;
          max-height: none;
        }
        .ddd-block:fullscreen .stage,
        .ddd-block.presenting .stage {
          height: 100%;
        }
        .ddd-block:fullscreen .stage svg,
        .ddd-block.presenting .stage svg {
          width: 100%;
          height: 100%;
        }
        .ddd-block:fullscreen .panel.source-panel,
        .ddd-block.presenting .panel.source-panel {
          display: none;
        }
        /* colour probes: never shown, only read. Each takes the token the
           drawing should use, so getComputedStyle gives Mermaid the value
           for this element, in this colour scheme, under this palette. */
        .probe-fill {
          color: var(
            --ddd-palette-tint,
            light-dark(
              var(--ddd-theme-default-skyMaxLight),
              var(--ddd-theme-default-nittanyNavy)
            )
          );
        }
        .probe-line {
          color: var(
            --ddd-palette-marker,
            light-dark(
              var(--ddd-theme-default-beaverBlue),
              var(--ddd-theme-default-pughBlue)
            )
          );
        }
        .probe-text {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .probe-surface {
          color: var(
            --mermaid-diagram-surface,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
        }
        .probe-soft {
          color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
        }
        .probe-font {
          font-family: var(--ddd-font-primary);
        }
      `,
    ];
  }

  /** the source that is drawn: the loaded file when there is one */
  get _source() {
    const text = this._remote !== null ? this._remote : this.code;
    return typeof text === "string" ? text : "";
  }

  /** presenting, by either path */
  get _present() {
    return this._fullscreen || this._presenting;
  }

  /** the source shows when asked for, while editing, and until a drawing
      replaces it (so it is there without JavaScript and on an error) */
  get _sourceOpen() {
    return this.showSource || this._editing || this._status !== "ready";
  }

  get _descriptionOpen() {
    return this.showDescription || this._editing;
  }

  /** nothing better than the source describes this diagram */
  get _describedBySource() {
    return (
      !this._hasDescriptionSlot &&
      !this.description &&
      !this._sourceDescription &&
      !this._flow
    );
  }

  _typeLabel() {
    const word = TYPE_LABELS[this._diagramType];
    return word
      ? html`${this.t.diagram} · ${this.t[word]}`
      : html`${this.t.diagram}`;
  }

  _fill(text, values) {
    return String(text)
      .split("{label}")
      .join(values.label || "")
      .split("{target}")
      .join(values.target || "");
  }

  /** the text alternative when the author did not slot one in */
  _renderDescription() {
    if (this.description) {
      return html`<p>${this.description}</p>`;
    }
    if (this._sourceDescription) {
      return html`<p>${this._sourceDescription}</p>`;
    }
    if (this._flow) {
      return html`<ol>
        ${this._flow.steps.map(
          (step) =>
            html`<li>
              <span class="step">${step.label}</span>${
                step.decision ? html` (${this.t.decision})` : nothing
              }:
              ${
                step.links.length
                  ? step.links
                      .map((link) =>
                        this._fill(
                          link.label ? this.t.ifGoTo : this.t.goTo,
                          link,
                        ),
                      )
                      .join("; ")
                  : this.t.end
              }
            </li>`,
        )}
      </ol>`;
    }
    return html`<p>${this.t.describedBySource}</p>`;
  }

  _renderMessage() {
    if (this._status === "loading") {
      return html`<p class="message">${this.t.loading}…</p>`;
    }
    if (this._status === "empty") {
      return html`<p class="message">${this.t.empty}</p>`;
    }
    if (this._status === "error") {
      return html`<div class="message problem">
        <simple-icon-lite
          icon="icons:error-outline"
          aria-hidden="true"
        ></simple-icon-lite>
        <span
          ><span class="problem-word">${this.t.error}:</span>
          ${this.t[this._error] || this.t.parseError}</span
        >
        ${
          this._errorDetail
            ? html`<pre class="problem-detail">${this._errorDetail}</pre>`
            : nothing
        }
      </div>`;
    }
    return nothing;
  }

  _renderActions() {
    const presentLabel = this._present ? this.t.exitPresent : this.t.present;
    return html`<button
        type="button"
        class="ddd-block-action"
        id="source-toggle"
        aria-label="${this.t.source}"
        aria-controls="source-panel"
        aria-expanded="${this._sourceOpen ? "true" : "false"}"
        @click="${this._toggleSource}"
      >
        <simple-icon-lite icon="icons:code" aria-hidden="true">
        </simple-icon-lite>
      </button>
      <simple-tooltip for="source-toggle" position="bottom"
        >${this.t.source}</simple-tooltip
      >
      <button
        type="button"
        class="ddd-block-action"
        id="alt-toggle"
        aria-label="${this.t.textAlternative}"
        aria-controls="alt-panel"
        aria-expanded="${this._descriptionOpen ? "true" : "false"}"
        @click="${this._toggleDescription}"
      >
        <simple-icon-lite icon="icons:subject" aria-hidden="true">
        </simple-icon-lite>
      </button>
      <simple-tooltip for="alt-toggle" position="bottom"
        >${this.t.textAlternative}</simple-tooltip
      >
      <button
        type="button"
        class="ddd-block-action"
        id="present-toggle"
        aria-label="${presentLabel}"
        aria-pressed="${this._present ? "true" : "false"}"
        @click="${this._togglePresent}"
      >
        <simple-icon-lite
          icon="${this._present ? "icons:fullscreen-exit" : "icons:fullscreen"}"
          aria-hidden="true"
        ></simple-icon-lite>
      </button>
      <simple-tooltip for="present-toggle" position="bottom"
        >${presentLabel}</simple-tooltip
      >`;
  }

  render() {
    const ready = this._status === "ready";
    // closed, the source stays reachable for assistive tech when it is the
    // only description of the diagram
    const sourceClass = this._sourceOpen
      ? "panel source-panel"
      : "panel source-panel sr-only";
    return html`<div
        class="ddd-block${this._presenting ? " presenting" : ""}"
        part="frame"
        role="group"
        aria-labelledby="header"
        @keydown="${this._frameKeydown}"
      >
        ${renderDDDBlockHeader({
          id: "header",
          icon: "hardware:device-hub",
          label: this._typeLabel(),
          title: this.diagramTitle,
          actions: this._renderActions(),
        })}
        <div class="ddd-block-body">
          <div role="status">${this._renderMessage()}</div>
          <div class="work">
            <div
              class="${sourceClass}"
              id="source-panel"
              ?hidden="${!this._sourceOpen && !this._describedBySource}"
            >
              <span class="ddd-block-label panel-label">${this.t.source}</span>
              <div class="surface source"><slot></slot></div>
            </div>
            <figure ?hidden="${!ready && !this._hasCaption}">
              <div
                class="surface canvas"
                part="diagram"
                ?hidden="${!ready}"
                role="${this._scrollable ? "group" : nothing}"
                aria-label="${this._scrollable ? this.t.scrollable : nothing}"
                tabindex="${this._scrollable ? "0" : nothing}"
              >
                <div class="stage" id="stage"></div>
              </div>
              <figcaption part="caption" ?hidden="${!this._hasCaption}">
                <slot name="caption"></slot>
              </figcaption>
            </figure>
          </div>
          <div
            class="panel alt-panel${this._descriptionOpen ? "" : " sr-only"}"
            id="alt-panel"
          >
            <span class="ddd-block-label panel-label"
              >${this.t.textAlternative}</span
            >
            <div class="surface alt" id="alt">
              <slot name="description">${this._renderDescription()}</slot>
            </div>
          </div>
        </div>
      </div>
      <span hidden aria-hidden="true">
        <span class="probe-fill"></span><span class="probe-line"></span
        ><span class="probe-text"></span><span class="probe-surface"></span
        ><span class="probe-soft"></span><span class="probe-font"></span>
      </span>`;
  }

  connectedCallback() {
    super.connectedCallback();
    const doc = globalThis.document;
    if (!doc) {
      return;
    }
    listenDDDBlockFullscreen(this._fullscreenChanged, true, FULLSCREEN);
    // authored content (the pre, a caption, a description) can arrive or
    // change after the element does
    this._contentObserver = new globalThis.MutationObserver(() =>
      this._readLightDom(),
    );
    this._contentObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    this._readLightDom();
    // the colour scheme can change with the system setting or with an
    // attribute, class or style on the page root (a theme toggle)
    if (globalThis.matchMedia) {
      this._schemeQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
      this._schemeQuery.addEventListener("change", this._themeMayHaveChanged);
    }
    this._pageObserver = new globalThis.MutationObserver(
      this._themeMayHaveChanged,
    );
    [doc.documentElement, doc.body].forEach((node) => {
      if (node) {
        this._pageObserver.observe(node, { attributes: true });
      }
    });
    // Mermaid is heavy: wait until the diagram is near the screen
    if (this._visible || !globalThis.IntersectionObserver) {
      this._visible = true;
      this._scheduleRender(0);
    } else {
      this._viewObserver = new globalThis.IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this._stopViewObserver();
            this._visible = true;
            this._scheduleRender(0);
          }
        },
        { rootMargin: "200px" },
      );
      this._viewObserver.observe(this);
    }
  }

  disconnectedCallback() {
    // anything still drawing belongs to an element that is gone
    this._renderToken++;
    clearTimeout(this._renderTimer);
    clearTimeout(this._themeTimer);
    listenDDDBlockFullscreen(this._fullscreenChanged, false, FULLSCREEN);
    if (this._contentObserver) {
      this._contentObserver.disconnect();
      this._contentObserver = null;
    }
    if (this._pageObserver) {
      this._pageObserver.disconnect();
      this._pageObserver = null;
    }
    if (this._schemeQuery) {
      this._schemeQuery.removeEventListener(
        "change",
        this._themeMayHaveChanged,
      );
      this._schemeQuery = null;
    }
    if (this._sizeObserver) {
      this._sizeObserver.disconnect();
      this._sizeObserver = null;
    }
    this._stopViewObserver();
    this._presenting = false;
    super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // a wide drawing scrolls inside the block; say so and make the scroll
    // area reachable by keyboard only while it actually scrolls
    if (globalThis.ResizeObserver) {
      const canvas = this.shadowRoot.querySelector(".canvas");
      this._sizeObserver = new globalThis.ResizeObserver(() => this._measure());
      this._sizeObserver.observe(canvas);
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("code")) {
      if (typeof this.code !== "string") {
        // the code attribute was removed (HAX strips it on save): the pre
        // is still the source
        this._readLightDom();
      } else if (this.code !== this._lightCode) {
        this._writeSource(this.code);
        this._scheduleRender(EDIT_DELAY);
      }
    }
    if (changedProperties.has("src")) {
      this._loadSrc();
    }
  }

  _stopViewObserver() {
    if (this._viewObserver) {
      this._viewObserver.disconnect();
      this._viewObserver = null;
    }
  }

  /** the pre holding the source: the first one that is not in a named slot */
  _sourceNode() {
    const children = Array.from(this.children);
    for (let i = 0; i < children.length; i++) {
      if (
        children[i].localName === "pre" &&
        !children[i].hasAttribute("slot")
      ) {
        return children[i];
      }
    }
    return null;
  }

  /** read what the author put in the light DOM; nothing there is changed */
  _readLightDom() {
    const children = Array.from(this.children);
    const slotted = (name) =>
      children.some(
        (child) =>
          child.getAttribute("slot") === name &&
          child.textContent.trim() !== "",
      );
    this._hasCaption = slotted("caption");
    this._hasDescriptionSlot = slotted("description");
    const pre = this._sourceNode();
    const text = pre ? pre.textContent : "";
    const changed = text !== this._lightCode;
    this._lightCode = text;
    if (pre || typeof this.code !== "string") {
      this.code = text;
    }
    if (changed) {
      this._scheduleRender(EDIT_DELAY);
    }
  }

  /** put a new source (the code property, set by HAX) in the pre */
  _writeSource(text) {
    let pre = this._sourceNode();
    if (!pre) {
      pre = globalThis.document.createElement("pre");
      this.insertBefore(pre, this.firstChild);
    }
    this._lightCode = text;
    if (pre.textContent !== text) {
      pre.textContent = text;
    }
  }

  /**
   * Load the source from src. Only http(s) addresses are fetched (a
   * relative one resolves against the page); anything else is ignored and
   * the inline source is drawn.
   */
  async _loadSrc() {
    const token = (this._srcToken = (this._srcToken || 0) + 1);
    let address = null;
    if (this.src && globalThis.document) {
      try {
        const parsed = new URL(this.src, globalThis.document.baseURI);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
          address = parsed.href;
        }
      } catch {
        address = null;
      }
    }
    if (!address) {
      if (this._remote !== null) {
        this._remote = null;
        this._scheduleRender(0);
      }
      return;
    }
    let text = null;
    try {
      const response = await globalThis.fetch(address);
      if (response.ok) {
        text = await response.text();
      }
    } catch {
      text = null;
    }
    // a newer src was set while this one loaded
    if (token !== this._srcToken) {
      return;
    }
    this._remote = text;
    this._srcFailed = text === null;
    this._scheduleRender(0);
  }

  _scheduleRender(delay) {
    clearTimeout(this._renderTimer);
    if (!this._visible || !this.isConnected) {
      return;
    }
    this._renderTimer = setTimeout(() => this._draw(), delay);
  }

  /**
   * The colours and font Mermaid draws with, read from this element's
   * computed styles so they follow the colour scheme, the palette and the
   * theme. Mermaid derives the rest of its theme from these.
   */
  _readTheme() {
    const read = (name, property) => {
      const probe = this.shadowRoot.querySelector(".probe-" + name);
      return probe
        ? globalThis.getComputedStyle(probe).getPropertyValue(property)
        : "";
    };
    const fill = toHex(read("fill", "color"));
    const line = toHex(read("line", "color"));
    const text = toHex(read("text", "color"));
    const surface = toHex(read("surface", "color"));
    const soft = toHex(read("soft", "color"));
    const fontFamily = read("font", "font-family");
    const darkMode = lightness(text) > 0.5;
    return {
      darkMode,
      fontFamily,
      background: surface,
      primaryColor: fill,
      primaryTextColor: text,
      primaryBorderColor: line,
      secondaryColor: soft,
      secondaryTextColor: text,
      secondaryBorderColor: line,
      tertiaryColor: surface,
      tertiaryTextColor: text,
      tertiaryBorderColor: line,
      mainBkg: fill,
      nodeBorder: line,
      lineColor: line,
      textColor: text,
      titleColor: text,
      clusterBkg: soft,
      clusterBorder: line,
      edgeLabelBackground: surface,
      noteBkgColor: soft,
      noteTextColor: text,
      noteBorderColor: line,
    };
  }

  _themeMayHaveChanged() {
    clearTimeout(this._themeTimer);
    this._themeTimer = setTimeout(() => {
      if (
        this._status === "ready" &&
        this.shadowRoot &&
        JSON.stringify(this._readTheme()) !== this._themeKey
      ) {
        this._draw();
      }
    }, 100);
  }

  /**
   * Draw the current source. Every await is followed by a check that this
   * is still the newest request, so a slow drawing never replaces a newer
   * one.
   */
  async _draw() {
    const token = ++this._renderToken;
    const stale = () => token !== this._renderToken || !this.isConnected;
    await this.updateComplete;
    if (stale()) {
      return;
    }
    const source = this._source;
    if (source.trim() === "") {
      this._clearStage();
      if (this._srcFailed) {
        this._fail("srcError", "", "error");
      } else {
        this._fail("", "", "empty");
      }
      return;
    }
    if (this._status !== "ready") {
      this._status = "loading";
    }
    let mermaid;
    try {
      mermaid = await loadMermaid();
    } catch {
      if (!stale()) {
        this._fail("loadError", "", "error");
      }
      return;
    }
    if (stale()) {
      return;
    }
    const themeVariables = this._readTheme();
    const result = await inTurn(async () => {
      if (stale()) {
        return null;
      }
      const id = "mermaid-diagram-" + ++renderCount;
      try {
        // Security: strict mode. Mermaid encodes tags in the source, turns
        // off click handlers and script links, and passes the finished SVG
        // through its bundled DOMPurify. Labels are SVG text, not HTML
        // (htmlLabels off), and the source cannot switch any of this back
        // on: the keys are locked against init directives and front matter.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          secure: LOCKED_CONFIG,
          suppressErrorRendering: true,
          htmlLabels: false,
          flowchart: { htmlLabels: false },
          theme: "base",
          darkMode: themeVariables.darkMode,
          fontFamily: themeVariables.fontFamily,
          themeVariables,
        });
        const drawn = await mermaid.render(id, source);
        let flow = null;
        if (TYPE_LABELS[drawn.diagramType] === "flowchart") {
          try {
            const diagram = await mermaid.mermaidAPI.getDiagramFromText(source);
            flow = flowchartFromDb(diagram.db);
          } catch {
            flow = null;
          }
          if (!flow) {
            flow = parseFlowchartSource(source);
          }
        }
        return { svg: drawn.svg, diagramType: drawn.diagramType, flow };
      } catch (error) {
        return { error: error && error.message ? String(error.message) : "" };
      } finally {
        // Mermaid measures in a scratch element in the page body and can
        // leave it behind when the source does not parse
        ["d" + id, id].forEach((leftover) => {
          const node = globalThis.document.getElementById(leftover);
          if (node) {
            node.remove();
          }
        });
      }
    });
    if (!result || stale()) {
      return;
    }
    if (result.error !== undefined) {
      this._clearStage();
      this._fail("parseError", result.error, "error");
      return;
    }
    if (!this._mount(result.svg)) {
      this._fail("parseError", "", "error");
      return;
    }
    this._themeKey = JSON.stringify(themeVariables);
    this._diagramType = result.diagramType || "";
    this._flow = result.flow;
    this._error = "";
    this._errorDetail = "";
    this._status = "ready";
    await this.updateComplete;
    this._measure();
    this.dispatchEvent(
      new CustomEvent("mermaid-diagram-rendered", {
        bubbles: true,
        composed: true,
        detail: { diagramType: this._diagramType },
      }),
    );
  }

  /** show a message instead of a drawing; the source stays in view */
  _fail(key, detail, status) {
    this._flow = null;
    this._sourceDescription = "";
    this._diagramType = "";
    this._error = key;
    this._errorDetail = detail;
    this._status = status;
    if (status === "error") {
      this.dispatchEvent(
        new CustomEvent("mermaid-diagram-error", {
          bubbles: true,
          composed: true,
          detail: { message: detail || this.t[key] || "" },
        }),
      );
    }
  }

  _clearStage() {
    const stage = this.shadowRoot && this.shadowRoot.querySelector("#stage");
    if (stage) {
      stage.replaceChildren();
    }
  }

  /**
   * Put Mermaid's SVG in the page.
   *
   * Security: the only markup that ever reaches this method is the string
   * mermaid.render returned in strict mode, which Mermaid has already run
   * through DOMPurify; author text never takes this path (it is rendered
   * through Lit templates as text). The string is still not handed to
   * innerHTML on a live element: it is parsed in an inert document (no
   * scripts run, nothing loads), checked again here (no script, foreign
   * object, frame or embed; no on* attributes; links only to ids inside
   * the drawing) and only then adopted into the shadow root.
   * @param {String} markup SVG from mermaid.render
   * @returns {Boolean} false when there was no drawing in it
   */
  _mount(markup) {
    const stage = this.shadowRoot.querySelector("#stage");
    const inert = new globalThis.DOMParser().parseFromString(
      String(markup),
      "text/html",
    );
    const svg = inert.body.querySelector("svg");
    if (!stage || !svg) {
      return false;
    }
    inert.body.querySelectorAll(BLOCKED_TAGS).forEach((node) => node.remove());
    [svg, ...svg.querySelectorAll("*")].forEach((node) => {
      Array.from(node.attributes).forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const local = name.split(":").pop();
        if (
          name.startsWith("on") ||
          (local === "href" && !attribute.value.trim().startsWith("#"))
        ) {
          node.removeAttribute(attribute.name);
        }
      });
    });
    // accDescr in the source is an authored description
    const authored = svg.querySelector("desc");
    this._sourceDescription = authored ? plainLabel(authored.textContent) : "";
    // one image, named by the block header and described by the text
    // alternative (both in this shadow root)
    svg.setAttribute("role", "img");
    svg.removeAttribute("aria-roledescription");
    svg.setAttribute("aria-labelledby", "header");
    svg.setAttribute("aria-describedby", "alt");
    // draw at natural size so a wide diagram scrolls instead of shrinking
    // until its text cannot be read
    const box = svg.viewBox && svg.viewBox.baseVal;
    if (box && box.width > 0 && box.height > 0) {
      svg.setAttribute("width", String(Math.ceil(box.width)));
      svg.setAttribute("height", String(Math.ceil(box.height)));
      svg.style.removeProperty("max-width");
    }
    stage.replaceChildren(globalThis.document.adoptNode(svg));
    return true;
  }

  _measure() {
    const canvas = this.shadowRoot && this.shadowRoot.querySelector(".canvas");
    if (canvas) {
      this._scrollable =
        canvas.scrollWidth > canvas.clientWidth + 1 ||
        canvas.scrollHeight > canvas.clientHeight + 1;
    }
  }

  _toggleSource() {
    this.showSource = !this._sourceOpen;
  }

  _toggleDescription() {
    this.showDescription = !this._descriptionOpen;
  }

  _fullscreenChanged() {
    const frame =
      this.shadowRoot && this.shadowRoot.querySelector(".ddd-block");
    this._fullscreen = isDDDBlockFullscreen(this.shadowRoot, frame, FULLSCREEN);
  }

  /**
   * Present the diagram: full screen where the browser can, otherwise the
   * frame covers the window (Escape or the same button leaves).
   */
  _togglePresent() {
    const frame = this.shadowRoot.querySelector(".ddd-block");
    if (canDDDBlockFullscreen(FULLSCREEN)) {
      toggleDDDBlockFullscreen(frame, this._fullscreen, FULLSCREEN);
    } else {
      this._presenting = !this._presenting;
    }
  }

  _frameKeydown(e) {
    if (e.key === "Escape" && this._presenting) {
      this._presenting = false;
      const button = this.shadowRoot.querySelector("#present-toggle");
      if (button) {
        button.focus();
      }
    }
  }

  /**
   * HAX hooks this element implements
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    };
  }

  /** editing: the source and the text alternative sit next to the drawing */
  haxeditModeChanged(value) {
    this._editing = Boolean(value);
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this._editing = true;
    }
  }

  /**
   * Saved content is the authored light DOM and authored attributes only.
   * The drawing lives in the shadow root, so the one thing to strip is the
   * code attribute the HAX form sets: the pre already holds that text.
   */
  haxpreProcessNodeToContent(node) {
    if (node && node.removeAttribute) {
      node.removeAttribute("code");
    }
    return node;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(MermaidDiagram.tag, MermaidDiagram);
