/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

/**
 * `sheet-music`
 * `Renders and plays sheet music, guitar tabs, and score notation via alphaTab.`
 *
 * alphaTab (MPL-2.0) + Bravura font (OFL-1.1) + sonivox soundfont (Apache-2.0)
 * are vendored under ./lib/alphatab/ and loaded via dynamic import so they are
 * never in the direct module chain. The alphaTab engine + API are only
 * initialized once the element is scrolled into view (IntersectionObserverMixin)
 * and the element is designed to work as a replace-tag target so HAXcms can
 * defer even the definition load until visible.
 *
 * alphaTab renders into a LIGHT-DOM container (not the shadow root) because it
 * injects its Bravura @font-face and .at-surface CSS into document.head, which
 * only applies to light DOM. That container is slotted into a shadow-DOM
 * viewport frame. Dark mode is handled purely via CSS light-dark() and
 * prefers-color-scheme (no JS detection). Notation text (alphaTex) lives in a
 * light-DOM <template preserve-content> which survives replace-tag swaps. A
 * code-sample-style inline edit mode lets authors edit the alphaTex directly
 * in the page via <code-editor>.
 *
 * The control bar provides play/pause/stop, a visual playback-progress bar,
 * display options (zoom in/out, stretch, layout), and export actions
 * (download MIDI, print/PDF, export audio).
 *
 * @demo demo/index.html
 * @element sheet-music
 */
class SheetMusic extends IntersectionObserverMixin(I18NMixin(DDD)) {
  static get tag() {
    return "sheet-music";
  }

  constructor() {
    super();
    this.source = "";
    this.audio = true;
    this.showDisplayOptions = true;
    this.showExport = true;
    this.editMode = false;
    this._haxstate = false;
    this.dataHaxActive = "";
    this.api = null;
    this._tex = "";
    this._observer = null;
    this._surfaceWrap = null;
    this._playerReady = false;
    this._playing = false;
    this._loadProgress = 0;
    this._playProgress = 0;
    this._timeText = "00:00 / 00:00";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      play: "Play",
      pause: "Pause",
      stop: "Stop",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      stretch: "Toggle spacing",
      layout: "Toggle layout",
      downloadMidi: "Download MIDI",
      print: "Print / Save PDF",
      loading: "Loading",
      sheetMusic: "Sheet music",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/sheet-music.es.json", import.meta.url).href + "/../",
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      source: { type: String, reflect: true },
      audio: { type: Boolean, reflect: true, attribute: "audio" },
      // Show display option buttons (zoom, stretch, layout)
      showDisplayOptions: {
        type: Boolean,
        reflect: true,
        attribute: "show-display-options",
      },
      // Show export buttons (download MIDI, print, export audio)
      showExport: { type: Boolean, reflect: true, attribute: "show-export" },
      editMode: { type: Boolean, reflect: true, attribute: "edit-mode" },
      _haxstate: { type: Boolean },
      dataHaxActive: {
        type: String,
        reflect: true,
        attribute: "data-hax-active",
      },
      _playerReady: { type: Boolean },
      _playing: { type: Boolean },
      _loadProgress: { type: Number },
      _playProgress: { type: Number },
      _timeText: { type: String },
    };
  }

  // Lit scoped styles — DDD tokens, dark mode via CSS light-dark() + media query
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          color-scheme: light dark;
          /* internal var: uses data-primary if set, otherwise falls back to info */
          --sheet-music-primary: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-info)
          );
          --sheet-music-primary-contrast: var(
            --lowContrast-override,
            var(--ddd-theme-bgContrast, var(--ddd-theme-default-white))
          );
        }
        :host([hidden]),
        [hidden] {
          display: none;
        }
        .at-viewport {
          overflow: auto;
          max-height: var(--sheet-music-viewport-max-height, 70vh);
          padding: var(--ddd-spacing-2);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          border-radius: var(--ddd-radius-xs);
        }
        .at-container {
          width: 100%;
          min-height: var(--ddd-spacing-12, 200px);
        }
        @media (prefers-color-scheme: dark) {
          ::slotted([data-sheet-music-surface]) {
            filter: invert(1) hue-rotate(180deg);
          }
        }
        .at-controls {
          display: none;
          align-items: center;
          gap: var(--ddd-spacing-2);
          height: var(--ddd-spacing-11, 44px);
          padding: 0 var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-1);
          background-color: var(--sheet-music-primary);
          color: var(--sheet-music-primary-contrast);
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-navigation);
          --simple-icon-color: var(--sheet-music-primary-contrast);
          --simple-icon-button-background-color: transparent;
          --simple-icon-button-focus-background-color: var(
            --sheet-music-primary-contrast
          );
          --simple-icon-button-focus-color: var(--sheet-music-primary);
        }
        :host([audio]) .at-controls {
          display: flex;
        }
        .at-controls simple-icon-button-lite {
          --simple-icon-height: var(--ddd-icon-sm, 32px);
          --simple-icon-width: var(--ddd-icon-sm, 32px);
        }
        .at-progress-track {
          flex: 1 1 auto;
          height: var(--ddd-spacing-2, 8px);
          min-width: var(--ddd-spacing-20, 120px);
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-rounded);
          overflow: hidden;
          opacity: 0.3;
        }
        .at-progress-fill {
          height: 100%;
          width: 0%;
          background-color: var(
            --sheet-music-progress-fill-color,
            var(--sheet-music-primary)
          );
          border-radius: var(--ddd-radius-rounded);
          transition: width var(--ddd-duration-fast) linear;
        }
        .at-time {
          font-size: var(--ddd-font-size-xs);
          color: var(--sheet-music-primary-contrast);
          white-space: nowrap;
          margin-left: var(--ddd-spacing-2);
        }
        .at-separator {
          width: 1px;
          height: var(--ddd-spacing-6, 24px);
          background-color: var(--sheet-music-primary-contrast);
          opacity: 0.3;
          margin: 0 var(--ddd-spacing-1);
        }
        .at-load-text {
          font-size: var(--ddd-font-size-xs);
          color: var(--sheet-music-primary-contrast);
          white-space: nowrap;
        }
        simple-tooltip {
          --simple-tooltip-background: var(--ddd-theme-default-coalyGray);
          --simple-tooltip-text-color: var(--ddd-theme-default-white);
          font-size: var(--ddd-font-size-xs);
        }
        /* inline edit mode swap (mirrors code-sample) */
        code-editor {
          display: none;
        }
        :host([edit-mode]) code-editor {
          display: block;
          --monaco-element-iframe-height: var(
            --sheet-music-editor-height,
            480px
          );
        }
        :host([edit-mode]) .at-viewport,
        :host([edit-mode]) .at-controls {
          display: none;
        }
      `,
    ];
  }

  // Lit render the HTML.
  render() {
    return html`${this._haxstate
        ? html`<code-editor language="plaintext"></code-editor>`
        : ``}
      <div class="at-viewport" id="viewport">
        <slot></slot>
      </div>
      <div class="at-controls">
        <simple-icon-button-lite
          id="sm-play"
          icon="${this._playing ? "av:pause" : "av:play-arrow"}"
          label="${this._playing ? this.t.pause : this.t.play}"
          ?disabled="${!this._playerReady}"
          @click="${this._playPause}"
        ></simple-icon-button-lite>
        <simple-tooltip for="sm-play" position="top"
          >${this._playing ? this.t.pause : this.t.play}</simple-tooltip
        >
        <simple-icon-button-lite
          id="sm-stop"
          icon="av:stop"
          label="${this.t.stop}"
          ?disabled="${!this._playerReady}"
          @click="${this._stop}"
        ></simple-icon-button-lite>
        <simple-tooltip for="sm-stop" position="top">${this.t.stop}</simple-tooltip>
        ${!this._playerReady
          ? html`<span class="at-load-text"
              >${this.t.loading} ${this._loadProgress}%</span
            >`
          : html`<div class="at-progress-track">
              <div
                class="at-progress-fill"
                style="width: ${this._playProgress}%"
              ></div>
            </div>`}
        <span class="at-time" aria-live="polite">${this._timeText}</span>
        ${this.showDisplayOptions
          ? html`<div class="at-separator"></div>
              <simple-icon-button-lite
                id="sm-zoom-out"
                icon="icons:zoom-out"
                label="${this.t.zoomOut}"
                @click="${this._zoomOut}"
              ></simple-icon-button-lite>
              <simple-tooltip for="sm-zoom-out" position="top"
                >${this.t.zoomOut}</simple-tooltip
              >
              <simple-icon-button-lite
                id="sm-zoom-in"
                icon="icons:zoom-in"
                label="${this.t.zoomIn}"
                @click="${this._zoomIn}"
              ></simple-icon-button-lite>
              <simple-tooltip for="sm-zoom-in" position="top"
                >${this.t.zoomIn}</simple-tooltip
              >
              <simple-icon-button-lite
                id="sm-stretch"
                icon="icons:aspect-ratio"
                label="${this.t.stretch}"
                @click="${this._toggleStretch}"
              ></simple-icon-button-lite>
              <simple-tooltip for="sm-stretch" position="top"
                >${this.t.stretch}</simple-tooltip
              >
              <simple-icon-button-lite
                id="sm-layout"
                icon="icons:view-module"
                label="${this.t.layout}"
                @click="${this._toggleLayout}"
              ></simple-icon-button-lite>
              <simple-tooltip for="sm-layout" position="top"
                >${this.t.layout}</simple-tooltip
              >`
          : ``}
        ${this.showExport
          ? html`<div class="at-separator"></div>
              <simple-icon-button-lite
                id="sm-download"
                icon="icons:file-download"
                label="${this.t.downloadMidi}"
                @click="${this._downloadMidi}"
              ></simple-icon-button-lite>
              <simple-tooltip for="sm-download" position="top"
                >${this.t.downloadMidi}</simple-tooltip
              >
              <simple-icon-button-lite
                id="sm-print"
                icon="icons:print"
                label="${this.t.print}"
                @click="${this._print}"
              ></simple-icon-button-lite>
              <simple-tooltip for="sm-print" position="top"
                >${this.t.print}</simple-tooltip
              >`
          : ``}
      </div>`;
  }

  /**
   * Lit life cycle - 1st updated. Ensure a light-DOM <template> exists as the
   * alphaTex source of truth, create the light-DOM alphaTab surface wrapper,
   * inject cursor/highlight CSS, read the tex, and observe changes.
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!this.querySelector("template")) {
      const t = globalThis.document.createElement("template");
      t.setAttribute("preserve-content", "preserve-content");
      this.appendChild(t);
    }
    this._surfaceWrap = globalThis.document.createElement("div");
    this._surfaceWrap.setAttribute("data-sheet-music-surface", "surface");
    this._surfaceWrap.classList.add("at-surface-wrap");
    this.appendChild(this._surfaceWrap);
    this._injectCursorStyles();
    this._readTex();
    this._observeContent();
  }

  /**
   * Inject CSS for alphaTab's playback cursor / highlight classes into
   * document.head (scoped to our surface so it does not affect other alphaTab
   * instances). DDD color tokens are available on :root so we can use them.
   */
  _injectCursorStyles() {
    if (
      globalThis.document &&
      globalThis.document.getElementById("sheet-music-cursor-styles")
    ) {
      return;
    }
    const style = globalThis.document.createElement("style");
    style.id = "sheet-music-cursor-styles";
    style.textContent = `
[data-sheet-music-surface] .at-cursor-bar {
  background: var(--sheet-music-primary, var(--ddd-theme-default-info));
  opacity: 0.18;
}
[data-sheet-music-surface] .at-cursor-beat {
  background: var(--sheet-music-primary, var(--ddd-theme-default-info));
  width: 3px;
  margin-left: -1.5px;
}
[data-sheet-music-surface] .at-highlight * {
  fill: var(--sheet-music-primary, var(--ddd-theme-default-info));
  stroke: var(--sheet-music-primary, var(--ddd-theme-default-info));
}
[data-sheet-music-surface] .at-selection div {
  background: var(--sheet-music-primary, var(--ddd-theme-default-info));
  opacity: 0.1;
}
    `;
    if (globalThis.document.head) {
      globalThis.document.head.appendChild(style);
    }
  }

  /**
   * Read alphaTex from the first light-DOM <template preserve-content> child.
   */
  _readTex() {
    const t = this.querySelector("template");
    if (t && t.content) {
      this._tex = (t.content.textContent || "").trim();
    } else {
      this._tex = "";
    }
    return this._tex;
  }

  /**
   * Observe light-DOM changes so authored alphaTex edits flow into alphaTab.
   * CRITICAL: filter out mutations originating from the alphaTab surface
   * wrapper to avoid an infinite render loop.
   */
  _observeContent() {
    if (this._observer) {
      return;
    }
    this._observer = new MutationObserver((mutations) => {
      if (!this.shadowRoot) {
        return;
      }
      for (let i = 0; i < mutations.length; i++) {
        let target = mutations[i].target;
        if (
          this._surfaceWrap &&
          (target === this._surfaceWrap ||
            this._surfaceWrap.contains(target))
        ) {
          return;
        }
      }
      let prev = this._tex;
      this._readTex();
      if (
        this._tex !== prev &&
        this.api &&
        !this.source &&
        !this._haxstate &&
        !this.dataHaxActive
      ) {
        this.api.tex(this._tex);
      }
    });
    this._observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  /**
   * Lit reactive properties changed.
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "elementVisible" && this.elementVisible && !this.api) {
        this._initAlphaTab();
      }
      if (
        propName === "source" &&
        this.api &&
        this.source &&
        !this._haxstate &&
        !this.dataHaxActive
      ) {
        this.api.load(this.source);
      }
      if (
        propName === "audio" &&
        this.api &&
        this.elementVisible &&
        !this._haxstate &&
        !this.dataHaxActive
      ) {
        this._rebuildAlphaTab();
      }
      if (propName === "editMode") {
        this._editModeChanged(this.editMode);
      }
    });
  }

  /**
   * Lazily import + initialize alphaTab. Runs only once visible.
   */
  async _initAlphaTab() {
    if (this.api || !this.elementVisible) {
      return;
    }
    if (!this._surfaceWrap) {
      return;
    }
    try {
      const module = await import("./lib/alphatab/alphaTab.min.mjs");
      if (this.api) {
        return;
      }
      const AlphaTabApi =
        module.AlphaTabApi ||
        (module.default && module.default.AlphaTabApi) ||
        module.default;
      const viewport = this.shadowRoot.querySelector("#viewport");
      const settings = {
        core: {
          engine: "svg",
          fontDirectory: new URL("./lib/alphatab/font/", import.meta.url).href,
        },
        ...(this.source ? { file: this.source } : { tex: true }),
        player: {
          enablePlayer: this.audio,
          soundFont: new URL(
            "./lib/alphatab/soundfont/sonivox.sf2",
            import.meta.url,
          ).href,
          scrollElement: viewport,
          enableCursor: true,
          enableAnimatedBeatCursor: true,
          enableElementHighlighting: true,
        },
      };
      this.api = new AlphaTabApi(this._surfaceWrap, settings);
      if (!this.source && this._tex) {
        this.api.tex(this._tex);
      }
      this._wireEvents();
    } catch (e) {
      console.warn("<sheet-music> alphaTab failed to initialize", e);
    }
  }

  /**
   * Wire the alphaTab player events to the built-in control UI.
   */
  _wireEvents() {
    if (!this.api) {
      return;
    }
    this.api.playerReady.on(() => {
      this._playerReady = true;
    });
    this.api.playerStateChanged.on((e) => {
      this._playing = !!(e && e.state === 1);
    });
    this.api.playerFinished.on(() => {
      this._playing = false;
      this._playProgress = 0;
    });
    this.api.playerPositionChanged.on((e) => {
      if (e) {
        this._timeText =
          this._formatTime(e.currentTime) + " / " + this._formatTime(e.endTime);
        if (e.endTime > 0) {
          this._playProgress = Math.round(
            (e.currentTime / e.endTime) * 100,
          );
        }
      }
    });
    this.api.soundFontLoad.on((e) => {
      const pct = e && e.total ? Math.round((e.loaded / e.total) * 100) : 0;
      this._loadProgress = pct;
    });
    if (this.api.error) {
      this.api.error.on((e) => {
        console.warn("<sheet-music> alphaTab error", e);
      });
    }
  }

  /**
   * Tear down and re-init alphaTab (used when toggling audio on/off).
   */
  _rebuildAlphaTab() {
    if (this.api) {
      this.api.destroy();
      this.api = null;
      this._playerReady = false;
      this._playing = false;
      this._loadProgress = 0;
      this._playProgress = 0;
      this._timeText = "00:00 / 00:00";
    }
    this._initAlphaTab();
  }

  // ---- display option handlers ----

  /**
   * Apply a display setting change and trigger a re-render.
   */
  _applyDisplayChange(key, value) {
    if (!this.api) {
      return;
    }
    this.api.settings.display[key] = value;
    this.api.updateSettings();
    this.api.render();
  }

  _zoomIn() {
    if (!this.api) {
      return;
    }
    let scale = this.api.settings.display.scale || 1;
    this._applyDisplayChange("scale", Math.min(2.0, +(scale + 0.1).toFixed(1)));
  }

  _zoomOut() {
    if (!this.api) {
      return;
    }
    let scale = this.api.settings.display.scale || 1;
    this._applyDisplayChange("scale", Math.max(0.5, +(scale - 0.1).toFixed(1)));
  }

  _toggleStretch() {
    if (!this.api) {
      return;
    }
    let force = this.api.settings.display.stretchForce || 1;
    // cycle: 1 (normal) -> 1.5 (wide) -> 0.5 (compact) -> 1
    let next = force >= 1.5 ? 0.5 : force <= 0.5 ? 1 : 1.5;
    this._applyDisplayChange("stretchForce", next);
  }

  _toggleLayout() {
    if (!this.api) {
      return;
    }
    // LayoutMode: 0 = Page, 1 = Horizontal
    let current = this.api.settings.display.layoutMode;
    let next = current === 0 ? 1 : 0;
    this._applyDisplayChange("layoutMode", next);
  }

  // ---- export handlers ----

  _downloadMidi() {
    if (this.api) {
      this.api.downloadMidi();
    }
  }

  _print() {
    if (this.api) {
      this.api.print();
    }
  }

  // ---- edit mode ----

  /**
   * Handle inline edit mode entering/leaving (mirrors code-sample).
   */
  _editModeChanged(value) {
    if (value) {
      if (this._surfaceWrap) {
        this._surfaceWrap.style.display = "none";
      }
      import("@haxtheweb/code-editor/code-editor.js").then(() => {
        const editor = this.shadowRoot.querySelector("code-editor");
        if (editor) {
          editor.innerHTML = this._tex;
        }
      });
    } else {
      if (this._surfaceWrap) {
        this._surfaceWrap.style.display = "";
      }
      const editor = this.shadowRoot.querySelector("code-editor");
      if (editor && editor.getValueAsNode) {
        const val = editor.getValueAsNode().innerHTML || "";
        this.innerHTML =
          '<template preserve-content="preserve-content">' + val + "</template>";
        this._readTex();
        if (
          this.api &&
          !this.source &&
          !this._haxstate &&
          !this.dataHaxActive
        ) {
          this.api.tex(this._tex);
        }
      }
    }
  }

  /**
   * Format milliseconds as mm:ss for the time position readout.
   */
  _formatTime(ms) {
    let value = ms;
    if (!value || value < 0) {
      value = 0;
    }
    const s = Math.floor(value / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  _playPause() {
    if (this.api) {
      this.api.playPause();
    }
  }

  _stop() {
    if (this.api) {
      this.api.stop();
    }
  }

  /**
   * HTMLElement life cycle - tear down alphaTab + observers + light-DOM surface.
   */
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this.api) {
      this.api.destroy();
      this.api = null;
    }
    if (this._surfaceWrap && this._surfaceWrap.parentNode) {
      this._surfaceWrap.parentNode.removeChild(this._surfaceWrap);
      this._surfaceWrap = null;
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  // ---- HAX hooks ----

  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
      editModeChanged: "haxeditModeChanged",
      inlineContextMenu: "haxinlineContextMenu",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    };
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this._haxstate = true;
      this.editMode = value;
    }
  }

  haxeditModeChanged(value) {
    if (!value && this.shadowRoot) {
      const editor = this.shadowRoot.querySelector("code-editor");
      if (editor && editor.getValueAsNode) {
        const val = editor.getValueAsNode().innerHTML || "";
        this.innerHTML =
          '<template preserve-content="preserve-content">' + val + "</template>";
        this._readTex();
        if (this.api && !this.source) {
          this.api.tex(this._tex);
        }
      }
    }
    this._haxstate = value;
  }

  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "lrn:edit",
        callback: "haxToggleEdit",
        label: "Toggle edit mode",
      },
    ];
  }

  haxToggleEdit(e) {
    this.editMode = !this.editMode;
    return true;
  }

  haxpreProcessNodeToContent(node) {
    if (this.api) {
      this.api.destroy();
      this.api = null;
      this._playerReady = false;
      this._playing = false;
    }
    this._haxstate = false;
    this.editMode = false;
    if (this._surfaceWrap && this._surfaceWrap.parentNode) {
      this._surfaceWrap.parentNode.removeChild(this._surfaceWrap);
      this._surfaceWrap = null;
    }
    return node;
  }

  /**
   * haxProperties integration via file reference (external schema preferred).
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(SheetMusic.tag, SheetMusic);
export { SheetMusic };
