/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDCompletionTracker,
  celebrateDDDCompletion,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import {
  DDDProgressRingStyles,
  dddProgressPercent,
  renderDDDProgressRing,
} from "@haxtheweb/d-d-d/lib/DDDProgressRing.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { LearnerProgress } from "@haxtheweb/haxcms-elements/lib/core/haxcms-learner-progress.js";

// The panel (This page / All pages, with the site outline) loads the first
// time a learner reaches for it, not with every themed page: hovering or
// focusing the button starts the download, and opening waits for it.
const PANEL_TAG = "my-learning-panel";
let panelLoad = null;
const panelDefined = () => Boolean(globalThis.customElements.get(PANEL_TAG));
function loadPanel() {
  if (!panelLoad) {
    panelLoad = import("./my-learning-panel.js").then(
      () => true,
      () => {
        // let the next attempt try again (offline, a deploy in progress)
        panelLoad = null;
        return false;
      },
    );
  }
  return panelLoad;
}

const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );

/**
 * `my-learning-button`
 * `My learning: this page's progress, for every visitor`
 *
 * A pill button with a ring around a chart icon filled to the percent of
 * the page open now (live as the visitor reads and engages), the label "My
 * learning" and the percent ("49%"). Once the page is done the ring is a
 * filled disc with a check, and the first time that happens while the page
 * is open it bursts once (never on a revisit or a reload; reduced motion:
 * no burst, the ring moves in 25% steps). It opens my-learning-panel (This
 * page / All pages) as a popover; Escape or Close returns focus here. The
 * panel's code loads on first use (hover, focus or open), not up front.
 * Hidden while editing.
 *
 * Drop it into a theme's toolbar (clean-one: right after the menu button;
 * clean-two and learn-two-theme: their icon rail / sidebar with compact,
 * before search; training-theme: under its progress card).
 * Styling hooks: --my-learning-button-width (default auto),
 * --my-learning-button-background, -color, -border-color, -percent-color
 * and -shadow, plus the DDD progress ring hooks
 * (--ddd-component-progress-ring-*) for the ring.
 * floating pins it bottom-left of the viewport
 * above the content, inside the safe area, for narrow layouts without a
 * toolbar.
 *
 * Learner progress comes from the profile on this device
 * (core/haxcms-learner-progress.js; haxtheweb/issues#3267, #3269).
 *
 * @element my-learning-button
 */
export class MyLearningButton extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "my-learning-button";
  }
  constructor() {
    super();
    this.compact = false;
    this.floating = false;
    this.percent = 0;
    this._editMode = false;
    this._available = false;
    this._open = false;
    this._pageId = "";
    // first time the page open now completes while this button shows it
    this._completion = new DDDCompletionTracker();
    this.t = {
      ...this.t,
      myLearning: "My learning",
      percent: "{percent}%",
      percentComplete: "{percent}% complete",
      complete: "Complete",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.__disposer = [];
    this._onResize = () => this._place();
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Only the ring (an icon button, for an icon rail); the label and
       * percent are its hover text and accessible name
       */
      compact: { type: Boolean, reflect: true },
      /**
       * Pin it bottom-left of the viewport above the content (inside the
       * safe area), for narrow layouts
       */
      floating: { type: Boolean, reflect: true },
      /**
       * Percent of the page open now, 0 to 1 (read only, from the learner
       * profile on this device)
       */
      percent: { type: Number, reflect: true },
      _editMode: { type: Boolean, state: true },
      _available: { type: Boolean, state: true },
      _open: { type: Boolean, state: true },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    // shown once there is a page to report on
    this.toggleAttribute("hidden", !this._available);
    LearnerProgress.start();
    this.__disposer.push(
      autorun(() => {
        const id = store.activeId;
        const item = store.activeItem;
        const edit = Boolean(store.editMode);
        const page = id ? LearnerProgress.pageProgress(id) : null;
        Promise.resolve().then(() =>
          this._progressChanged(id, item, edit, page),
        );
      }),
    );
    globalThis.addEventListener("resize", this._onResize);
  }
  disconnectedCallback() {
    this.__disposer.forEach((d) => d());
    this.__disposer = [];
    globalThis.removeEventListener("resize", this._onResize);
    super.disconnectedCallback();
  }
  _progressChanged(id, item, edit, page) {
    const available = Boolean(id && item && !item._internalRoute && !edit);
    this._editMode = edit;
    this._available = available;
    this.toggleAttribute("hidden", !available);
    if (!available) {
      this._closePanel(false);
      return;
    }
    const percent = page ? Number(page.percent) || 0 : 0;
    const done = Boolean(page && (page.status === "done" || percent >= 1));
    this.percent = done ? 1 : Math.min(percent, 0.999);
    if (this._pageId && this._pageId !== id) {
      this._completion.forget(this._pageId);
    }
    this._pageId = id;
    if (this._completion.update(id, done)) {
      this.updateComplete.then(() =>
        celebrateDDDCompletion(
          this.shadowRoot && this.shadowRoot.querySelector("#button .ddd-ring"),
        ),
      );
    }
  }
  /**
   * "49% complete" / "Complete"
   */
  get statusText() {
    return this.percent >= 1
      ? this.t.complete
      : fill(this.t.percentComplete, {
          percent: dddProgressPercent(this.percent),
        });
  }
  static get styles() {
    return [
      super.styles,
      ...DDDProgressRingStyles,
      css`
        :host {
          display: inline-flex;
          vertical-align: middle;
          font-family: var(--ddd-font-navigation);
        }
        :host([hidden]) {
          display: none;
        }
        :host([floating]) {
          position: fixed;
          z-index: var(--ddd-z-sticky, 100);
          inset-inline-start: max(
            var(--ddd-spacing-3),
            env(safe-area-inset-left)
          );
          bottom: max(var(--ddd-spacing-3), env(safe-area-inset-bottom));
        }
        #button {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          width: var(--my-learning-button-width, auto);
          height: var(--ddd-control-height-sm);
          margin: 0;
          padding: 0 var(--ddd-spacing-3) 0 var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: var(
            --my-learning-button-border-color,
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            )
          );
          border-radius: var(--ddd-radius-rounded);
          background-color: var(
            --my-learning-button-background,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-coalyGray)
            )
          );
          color: var(
            --my-learning-button-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: var(--my-learning-button-shadow, var(--ddd-boxShadow-sm));
          --simple-icon-color: currentColor;
        }
        :host([compact]) #button {
          justify-content: center;
          width: var(--ddd-control-height-sm);
          padding: 0;
        }
        #button:hover,
        #button[aria-expanded="true"] {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        #button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .label {
          color: inherit;
        }
        .pct {
          font-variant-numeric: tabular-nums;
          color: var(
            --my-learning-button-percent-color,
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            )
          );
        }
        :host([compact]) .label,
        :host([compact]) .pct {
          display: none;
        }
        @media (forced-colors: active) {
          #button {
            border-color: ButtonText;
          }
        }
      `,
    ];
  }
  render() {
    const pct = fill(this.t.percent, {
      percent: dddProgressPercent(this.percent),
    });
    // the visible words first, so the name holds what is seen
    const name =
      this.percent >= 1
        ? `${this.t.myLearning} ${pct}, ${this.t.complete}`
        : `${this.t.myLearning} ${this.statusText}`;
    return html`<button
        type="button"
        id="button"
        part="button"
        popovertarget="panel"
        aria-haspopup="dialog"
        aria-expanded="${this._open ? "true" : "false"}"
        aria-controls="panel"
        aria-label="${name}"
        title="${name}"
        @click="${this._clicked}"
        @pointerenter="${this._warmPanel}"
        @focus="${this._warmPanel}"
      >
        ${renderDDDProgressRing({
          percent: this.percent,
          icon: "editor:insert-chart",
          burst: true,
          part: "ring",
        })}
        <span class="label" aria-hidden="true">${this.t.myLearning}</span>
        <span class="pct" aria-hidden="true">${pct}</span>
      </button>
      <my-learning-panel
        id="panel"
        popover="auto"
        @beforetoggle="${this._beforeToggle}"
        @toggle="${this._toggled}"
        @my-learning-panel-close="${this._panelClose}"
      ></my-learning-panel>`;
  }
  get panel() {
    return this.shadowRoot ? this.shadowRoot.querySelector("#panel") : null;
  }
  // start loading the panel as soon as the learner reaches for the button
  _warmPanel() {
    loadPanel();
  }
  // browsers without the popover API: toggle it by hand
  _clicked(e) {
    const panel = this.panel;
    if (!panel || typeof panel.showPopover === "function") {
      return;
    }
    e.preventDefault();
    if (!panelDefined()) {
      loadPanel().then((ok) => {
        if (ok) {
          this._clicked({ preventDefault() {} });
        }
      });
      return;
    }
    if (this._open) {
      this._closePanel(true);
    } else {
      this._place();
      panel.style.display = "block";
      panel.style.position = "fixed";
      panel.style.zIndex = "var(--ddd-z-modal, 1000)";
      this._opened();
    }
  }
  /**
   * Open the panel (the This page tab unless given)
   */
  open(tab) {
    const panel = this.panel;
    if (!panel || !this._available) {
      return;
    }
    if (!panelDefined()) {
      loadPanel().then((ok) => {
        if (ok) {
          this.open(tab);
        }
      });
      return;
    }
    if (tab) {
      panel.tab = tab;
    }
    if (typeof panel.showPopover === "function") {
      if (!panel.matches(":popover-open")) {
        panel.showPopover();
      }
    } else if (!this._open) {
      this._clicked({ preventDefault() {} });
    }
  }
  _beforeToggle(e) {
    // first open before the panel's code arrived: hold it, then open the
    // defined panel (no empty popover in between)
    if (e.newState === "open" && !panelDefined()) {
      e.preventDefault();
      loadPanel().then((ok) => {
        const panel = this.panel;
        if (ok && panel && this._available && !panel.matches(":popover-open")) {
          panel.showPopover();
        }
      });
      return;
    }
    if (e.newState === "open") {
      this._place();
    }
  }
  _toggled(e) {
    if (e.newState === "open") {
      this._opened();
    } else {
      this._closed();
    }
  }
  _opened() {
    this._open = true;
    const panel = this.panel;
    panel.refresh();
    panel.updateComplete.then(() => panel.focusFirst());
  }
  _closed() {
    const focusBack = this._returnFocus !== false;
    this._returnFocus = true;
    this._open = false;
    const panel = this.panel;
    const inside =
      panel &&
      (panel.matches(":focus-within") ||
        (panel.shadowRoot && panel.shadowRoot.activeElement));
    const lost =
      globalThis.document.activeElement === globalThis.document.body ||
      !globalThis.document.activeElement;
    if (focusBack && (inside || lost)) {
      const b = this.shadowRoot.querySelector("#button");
      if (b) {
        b.focus();
      }
    }
  }
  _panelClose(e) {
    this._closePanel(!(e && e.detail && e.detail.returnFocus === false));
  }
  _closePanel(returnFocus) {
    const panel = this.panel;
    if (!panel) {
      return;
    }
    if (typeof panel.hidePopover === "function") {
      if (panel.matches(":popover-open")) {
        this._returnFocus = returnFocus;
        panel.hidePopover();
      }
    } else if (this._open) {
      this._returnFocus = returnFocus;
      panel.style.display = "none";
      this._closed();
    }
  }
  // put the panel under the button, or above it when the button sits in
  // the lower half of the viewport (floating at the bottom), kept on screen
  _place() {
    const panel = this.panel;
    const b = this.shadowRoot && this.shadowRoot.querySelector("#button");
    if (!panel || !b) {
      return;
    }
    const r = b.getBoundingClientRect();
    const vw = globalThis.innerWidth || 0;
    const vh = globalThis.innerHeight || 0;
    const gap = 8;
    const width = Math.min(420, Math.max(0, vw - 16));
    const left = Math.max(8, Math.min(r.left, vw - width - 8));
    panel.style.left = `${Math.round(left)}px`;
    panel.style.right = "auto";
    if (r.top > vh / 2) {
      panel.style.top = "auto";
      panel.style.bottom = `${Math.round(vh - r.top + gap)}px`;
      panel.style.setProperty(
        "--my-learning-panel-max-height",
        `${Math.round(Math.max(200, r.top - gap - 8))}px`,
      );
    } else {
      panel.style.bottom = "auto";
      panel.style.top = `${Math.round(r.bottom + gap)}px`;
      panel.style.setProperty(
        "--my-learning-panel-max-height",
        `${Math.round(Math.max(200, vh - r.bottom - gap - 8))}px`,
      );
    }
  }
}
globalThis.customElements.define(MyLearningButton.tag, MyLearningButton);
