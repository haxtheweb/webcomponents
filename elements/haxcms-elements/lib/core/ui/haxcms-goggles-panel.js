/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * The panel a site's own goggles lens shows inside the goggles (see
 * haxcms-goggles-site.js): HAX UI dark chrome, a title bar with a move
 * button and a collapse button, and a body the lens fills by overriding
 * renderBody(). It sits on the right; the title bar drags it anywhere on the
 * screen, the arrow keys on its move button move it (Shift for bigger steps,
 * Home puts it back), and where it was put is remembered per panel. On a
 * phone it is a sheet at the bottom and does not move.
 *
 *   class MyPanel extends HaxcmsGogglesPanel {
 *     get panelTitle() { return "Update"; }
 *     get panelIcon() { return "icons:update"; }
 *     renderBody() { return html`...`; }
 *   }
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  HaxUiAdminTokens,
  HaxUiDarkChromeDeclarations,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import {
  HaxUiAdminControls,
  HaxUiAdminSimpleFields,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  localStorageGet,
  localStorageSet,
  localStorageDelete,
} from "@haxtheweb/utils/lib/storage.js";

// a lens panel module builds its templates with the same lit
export { html, css, nothing };

export const GOGGLES_PANEL_T = {
  move: "Move this panel",
  moveHelp: "Drag to move. Arrow keys move it too; Home puts it back.",
  collapse: "Collapse this panel",
  expand: "Expand this panel",
  lensesOff:
    "The lenses are off, so the page works as usual. Turn the lenses on to pick parts of the page.",
};

export class HaxcmsGogglesPanel extends DDD {
  constructor() {
    super();
    this.lensOn = true;
    this.collapsed = false;
    this._said = "";
    this.t = { ...GOGGLES_PANEL_T };
    this._place = null;
    this._onResize = () => this._applyPlace();
  }

  static get properties() {
    return {
      ...super.properties,
      /** the goggles' lenses are on: selecting picks part of the page */
      lensOn: { type: Boolean, reflect: true, attribute: "lens-on" },
      /** only the panel's title bar shows, so the page under it can be seen */
      collapsed: { type: Boolean, reflect: true },
      _said: { type: String, state: true },
    };
  }

  /** the title in the panel's bar */
  get panelTitle() {
    return "";
  }
  /** the icon in the panel's bar */
  get panelIcon() {
    return "hax:goggles";
  }
  /** where this panel's place is remembered */
  get placeKey() {
    return this.localName + "-place";
  }
  /** what follows the title in the bar (the thing being worked on) */
  renderSubtitle() {
    return nothing;
  }
  /** the panel's content */
  renderBody() {
    return nothing;
  }

  static get styles() {
    return [
      super.styles,
      HaxUiAdminTokens,
      ...HaxUiAdminControls,
      ...HaxUiAdminSimpleFields,
      css`
        :host {
          /* the goggles' panel: HAX UI dark chrome. It sits on the right and
             can be moved anywhere on the screen (its title bar drags it) */
          color-scheme: dark;
          ${HaxUiDarkChromeDeclarations}
          position: absolute;
          top: 76px;
          right: var(--ddd-spacing-4, 16px);
          bottom: 92px;
          width: min(380px, calc(100vw - 32px));
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          pointer-events: auto;
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border: var(--ddd-border-size-xs, 1px) solid var(--hax-ui-line-strong);
          border-top: var(--ddd-border-size-md, 3px) solid
            var(--haxcms-goggles-lens, #2fd3e0);
          border-radius: var(--hax-ui-radius-lg, 8px);
          box-shadow: var(
            --hax-ui-shadow-popover,
            0 8px 24px rgba(0, 0, 0, 0.4)
          );
          overflow: hidden;
          font-family: var(
            --hax-ui-admin-font-family,
            var(--ddd-font-navigation)
          );
          font-size: var(--ddd-font-size-4xs, 16px);
          line-height: var(--ddd-lh-140, 1.4);
        }
        :host([collapsed]) {
          bottom: auto;
        }
        header {
          cursor: grab;
          touch-action: none;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          border-bottom: var(--ddd-border-size-xs, 1px) solid var(--hax-ui-line);
        }
        :host([moving]) header {
          cursor: grabbing;
        }
        .eyebrow {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          margin: var(--ddd-spacing-0);
          font-size: var(--hax-ui-font-size-sm, 14px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
        }
        .eyebrow .n {
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
          --simple-icon-color: currentColor;
          flex: none;
        }
        .body {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: var(--ddd-spacing-3, 12px);
          display: grid;
          align-content: start;
          gap: var(--ddd-spacing-4, 16px);
        }
        :host([collapsed]) .body {
          display: none;
        }
        h2,
        h3 {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0)
            var(--ddd-spacing-2, 8px);
          color: var(--hax-ui-text);
        }
        h2 {
          font-size: var(--ddd-font-size-3xs, 18px);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        h3 {
          font-size: var(--hax-ui-font-size-sm, 14px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text-muted);
        }
        p {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs, 16px);
          line-height: var(--ddd-lh-140, 1.4);
        }
        .muted {
          font-size: var(--hax-ui-font-size-sm, 14px);
          color: var(--hax-ui-text-muted);
          overflow-wrap: anywhere;
        }
        p.help {
          margin-top: calc(-1 * var(--ddd-spacing-1, 4px));
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-2, 8px);
        }
        .hax-ui-btn,
        .hax-ui-seg button {
          min-height: 32px;
        }
        fieldset {
          border: 0;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          min-width: 0;
          display: grid;
          gap: var(--ddd-spacing-1, 4px);
        }
        legend {
          padding: var(--ddd-spacing-0);
          font-size: var(--hax-ui-font-size-sm, 14px);
          color: var(--hax-ui-text);
          margin-bottom: var(--ddd-spacing-1, 4px);
        }
        details summary {
          cursor: pointer;
          min-height: 32px;
          display: list-item;
          padding: var(--ddd-spacing-1, 4px) 0;
          color: var(--hax-ui-text);
          font-size: var(--hax-ui-font-size-sm, 14px);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 24px;
        }
        pre {
          margin: var(--ddd-spacing-2, 8px) 0 0;
          padding: var(--ddd-spacing-3, 12px);
          max-height: 240px;
          overflow: auto;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-font-size-xs, 12px);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-sunken);
          border: var(--ddd-border-size-xs, 1px) solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius, 4px);
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1, 4px);
        }
        .chips button {
          min-height: 32px;
          padding: 0 var(--ddd-spacing-2, 8px);
          border-radius: 16px;
          border: var(--ddd-border-size-xs, 1px) solid var(--hax-ui-line-strong);
          background: transparent;
          color: var(--hax-ui-text);
          font: inherit;
          font-size: var(--hax-ui-font-size-sm, 14px);
          cursor: pointer;
        }
        .chips button[aria-pressed="true"] {
          background: var(--hax-ui-text);
          color: var(--hax-ui-surface);
        }
        .chips button:focus-visible {
          outline: 2px solid var(--haxcms-goggles-lens, #2fd3e0);
          outline-offset: 2px;
        }
        /* moved: where it was put, as tall as the screen below it allows */
        :host([placed]) {
          bottom: auto;
          right: auto;
          max-height: calc(100vh - var(--goggles-panel-top, 76px) - 16px);
        }
        @media (max-width: 719px) {
          .move {
            display: none;
          }
          header {
            cursor: auto;
          }
          :host,
          :host([placed]) {
            top: auto;
            left: 12px;
            right: 12px;
            bottom: 84px;
            width: auto;
            max-height: 50dvh;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("resize", this._onResize);
  }

  disconnectedCallback() {
    globalThis.removeEventListener("resize", this._onResize);
    super.disconnectedCallback();
  }

  firstUpdated(changed) {
    if (super.firstUpdated) super.firstUpdated(changed);
    const p = localStorageGet(this.placeKey, null);
    this._place =
      p && typeof p.x === "number" && typeof p.y === "number" ? p : null;
    this._applyPlace();
  }

  /** a phone keeps the panel as a sheet at the bottom: it is not moved there */
  get _movable() {
    return !(
      globalThis.matchMedia &&
      globalThis.matchMedia("(max-width: 719px)").matches
    );
  }

  /** the panel where it was put, kept on screen; or back in its place on the right */
  _applyPlace() {
    const p = this._place;
    if (!p || !this._movable) {
      this.removeAttribute("placed");
      this.style.removeProperty("left");
      this.style.removeProperty("top");
      this.style.removeProperty("--goggles-panel-top");
      return;
    }
    const w = this.offsetWidth || 380;
    const x = Math.max(8, Math.min(p.x, globalThis.innerWidth - w - 8));
    const y = Math.max(8, Math.min(p.y, globalThis.innerHeight - 120));
    this.setAttribute("placed", "");
    this.style.left = x + "px";
    this.style.top = y + "px";
    this.style.setProperty("--goggles-panel-top", y + "px");
  }

  /** move the panel to {x, y} (null: its place on the right), and remember it */
  _putAt(p) {
    this._place = p;
    if (p) {
      localStorageSet(this.placeKey, p);
    } else {
      localStorageDelete(this.placeKey);
    }
    this._applyPlace();
  }

  /** drag by the title bar (but not from its other buttons) */
  _dragStart(e) {
    if (!this._movable || e.button !== 0) return;
    const path = e.composedPath();
    const btn = path.find((n) => n.localName === "button");
    if (btn && !btn.classList.contains("move")) return;
    const r = this.getBoundingClientRect();
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    const header = e.currentTarget;
    header.setPointerCapture(e.pointerId);
    this.setAttribute("moving", "");
    const move = (m) => {
      this._place = { x: m.clientX - dx, y: m.clientY - dy };
      this._applyPlace();
    };
    const up = () => {
      header.removeEventListener("pointermove", move);
      header.removeEventListener("pointerup", up);
      header.removeEventListener("pointercancel", up);
      this.removeAttribute("moving");
      if (this._place) this._putAt(this._place);
    };
    header.addEventListener("pointermove", move);
    header.addEventListener("pointerup", up);
    header.addEventListener("pointercancel", up);
  }

  /** the move button: arrow keys move the panel (Shift for bigger steps), Home puts it back */
  _moveKey(e) {
    const step = e.shiftKey ? 64 : 16;
    const d = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[e.key];
    if (e.key === "Home") {
      e.preventDefault();
      this._putAt(null);
      return;
    }
    if (!d) return;
    e.preventDefault();
    const r = this.getBoundingClientRect();
    this._putAt({ x: r.left + d[0], y: r.top + d[1] });
  }

  /**
   * A field, with its help as plain text under it: a field's own
   * description adds a small info button, under the 24px a phone needs.
   */
  field(label, value, change, type, help) {
    return html`<simple-fields-field
        class="hax-ui-simple-field"
        type="${type || "text"}"
        label="${label}"
        autocomplete="off"
        .value="${value}"
        @value-changed="${(e) => change(e.detail.value || "")}"
      ></simple-fields-field
      >${help ? html`<p class="muted help">${help}</p>` : nothing}`;
  }

  render() {
    return html`<header @pointerdown="${this._dragStart}">
        <button
          type="button"
          class="hax-ui-icon-btn move"
          aria-label="${this.t.move}"
          title="${this.t.moveHelp}"
          @keydown="${this._moveKey}"
          @dblclick="${() => this._putAt(null)}"
        >
          <simple-icon-lite icon="icons:open-with"></simple-icon-lite>
        </button>
        <p class="eyebrow">
          <simple-icon-lite icon="${this.panelIcon}"></simple-icon-lite
          >${this.panelTitle} ${this.renderSubtitle()}
        </p>
        <button
          type="button"
          class="hax-ui-icon-btn"
          aria-expanded="${this.collapsed ? "false" : "true"}"
          aria-label="${this.collapsed ? this.t.expand : this.t.collapse}"
          @click="${() => {
            this.collapsed = !this.collapsed;
          }}"
        >
          <simple-icon-lite
            icon="${this.collapsed ? "icons:expand-less" : "icons:expand-more"}"
          ></simple-icon-lite>
        </button>
      </header>
      <div class="body" role="region" aria-label="${this.panelTitle}">
        ${
          this.lensOn
            ? nothing
            : html`<p class="hax-ui-message" data-tone="info">
                ${this.t.lensesOff}
              </p>`
        }
        ${this.renderBody()}
        <p class="muted" role="status">${this._said}</p>
      </div>`;
  }
}
