/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "../stop-note.js";

/**
 * `stop-note-group`
 * Stacks several `stop-note`s into one block that shows a note at a time,
 * with previous and next buttons and a count laid over the note's header
 * ("Did you know?  ← 2 / 5 →"). Made for Tips and What's new, but any
 * statuses can be mixed.
 *
 * The notes stay ordinary light DOM children: the group never changes
 * them, it only hides the ones not showing, so saved content is exactly
 * what the author wrote. While HAX is editing, and when printing, every
 * note shows.
 *
 * @demo demo/index.html
 * @element stop-note-group
 */
class StopNoteGroup extends I18NMixin(DDD) {
  static get tag() {
    return "stop-note-group";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Accessible name for the group, such as "Tips" or "What's new".
       */
      label: { type: String },
      /**
       * Index of the note showing, starting at 0.
       */
      active: { type: Number },
      /** number of stop-note children */
      _count: { type: Number, state: true },
      /** HAX edit mode shows every note */
      _editing: { type: Boolean, state: true },
      /** text for the polite live region, set only after a button press */
      _announce: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this.label = "";
    this.active = 0;
    this._count = 0;
    this._editing = false;
    this._announce = "";
    this.t = {
      notes: "Notes",
      previous: "Previous note",
      next: "Next note",
      of: "of",
    };
    this.registerLocalization({
      context: this,
      basePath: new URL("../stop-note.js", import.meta.url).href,
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-5) 0;
        }
        .wrap {
          position: relative;
          container-type: inline-size;
          /* room the notes leave at the end of their header for the pager */
          --stop-note-group-pager-space: calc(
            var(--stop-note-group-pager-width, 96px) + var(--ddd-spacing-1)
          );
        }
        :host([hidden]) {
          display: none;
        }
        ::slotted(stop-note:not(:last-child)) {
          margin-bottom: var(--ddd-spacing-3);
        }
        .pager {
          position: absolute;
          top: var(--stop-note-group-pager-top, var(--ddd-border-size-md));
          inset-inline-end: var(--ddd-spacing-1);
          height: var(
            --stop-note-group-pager-height,
            var(--ddd-control-height-sm)
          );
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-0);
          white-space: nowrap;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-variant-numeric: tabular-nums;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .pager button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-grid;
          place-items: center;
          /* 28px: above the 24px minimum target size */
          width: var(--ddd-spacing-7);
          height: var(--ddd-spacing-7);
          border-radius: var(--ddd-radius-circle);
          color: inherit;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .pager button:hover {
          background-color: color-mix(in srgb, currentColor 12%, transparent);
        }
        .pager button:focus-visible {
          outline: var(--ddd-border-size-md) solid
            light-dark(
              var(--ddd-theme-default-link),
              var(--ddd-theme-default-linkLight)
            );
          outline-offset: 1px;
        }
        .count {
          min-width: 3ch;
          text-align: center;
        }
        /* narrow: the arrows stay, the count goes (buttons and the live
          region still say where you are) so the status word fits */
        @container (max-width: 300px) {
          .count {
            display: none;
          }
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        @media (forced-colors: active) {
          .pager button {
            border: var(--ddd-border-xs);
            border-color: ButtonText;
          }
        }
        @media print {
          .pager {
            display: none;
          }
        }
      `,
    ];
  }

  /** the stop-notes this group pages through */
  get notes() {
    return Array.from(this.children).filter(
      (el) => el.tagName && el.tagName.toLowerCase() === "stop-note",
    );
  }

  get paged() {
    return this._count > 1 && !this._editing;
  }

  render() {
    const paged = this.paged;
    const i = this._index();
    return html`
      ${
        paged
          ? html`<style>
              ${this._pagedCSS(i)}
            </style>`
          : nothing
      }
      <div
        class="wrap"
        role="group"
        aria-label="${this.label || this.t.notes}"
        part="group"
      >
        <slot @slotchange="${this._sync}"></slot>
        ${
          paged
            ? html`<div class="pager" part="pager">
                <button
                  type="button"
                  data-go="-1"
                  aria-label="${this.t.previous}"
                  @click="${this.previous}"
                >
                  <simple-icon-lite
                    icon="icons:chevron-left"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>
                <span class="count" aria-hidden="true"
                  >${i + 1} / ${this._count}</span
                >
                <button
                  type="button"
                  data-go="1"
                  aria-label="${this.t.next}"
                  @click="${this.next}"
                >
                  <simple-icon-lite
                    icon="icons:chevron-right"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>
              </div>`
            : nothing
        }
        <span class="sr-only" role="status">${this._announce}</span>
      </div>
    `;
  }

  /**
   * While paging, only the showing note is displayed and every note leaves
   * room in its header for the pager. Hiding is done here, in the group's
   * own styles, so the notes themselves are never changed.
   */
  _pagedCSS(i) {
    return `::slotted(:not(stop-note)),
      ::slotted(stop-note:not(:nth-of-type(${i + 1}))) { display: none; }
      ::slotted(stop-note) { margin: 0; --stop-note-header-end: var(--stop-note-group-pager-space); }
      @media print {
        ::slotted(*) { display: block !important; }
        ::slotted(stop-note) { --stop-note-header-end: initial; }
        ::slotted(stop-note:not(:last-child)) { margin-bottom: var(--ddd-spacing-3); }
      }`;
  }

  /** active, kept inside the notes there are */
  _index() {
    if (!this._count) {
      return 0;
    }
    const n = parseInt(this.active, 10) || 0;
    return ((n % this._count) + this._count) % this._count;
  }

  /** show the next note, wrapping to the first */
  next() {
    this.go(1);
  }

  /** show the previous note, wrapping to the last */
  previous() {
    this.go(-1);
  }

  go(dir) {
    if (this._count < 2) {
      return;
    }
    this.active = (this._index() + dir + this._count) % this._count;
    const note = this.notes[this.active];
    const title = note && note.title ? `: ${note.title}` : "";
    this._announce = `${this.active + 1} ${this.t.of} ${this._count}${title}`;
    this.dispatchEvent(
      new CustomEvent("stop-note-group-change", {
        bubbles: true,
        composed: true,
        detail: { active: this.active, note: note },
      }),
    );
  }

  _sync() {
    this._count = this.notes.length;
  }

  connectedCallback() {
    super.connectedCallback();
    this._sync();
    this._resize = new ResizeObserver(() => this._place());
    this._resize.observe(this);
  }

  disconnectedCallback() {
    if (this._resize) {
      this._resize.disconnect();
    }
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    this._place();
  }

  /**
   * Lay the pager over the showing note's header: measure the header (or
   * the whole row of a compact note) and the pager itself.
   */
  async _place() {
    const pager = this.shadowRoot && this.shadowRoot.querySelector(".pager");
    const wrap = this.shadowRoot && this.shadowRoot.querySelector(".wrap");
    const note = this.notes[this._index()];
    if (!pager || !note || !wrap) {
      return;
    }
    if (note.updateComplete) {
      await note.updateComplete;
    }
    const root = note.shadowRoot;
    if (!root) {
      return;
    }
    let box = root.querySelector(".ddd-block-header");
    let r = box ? box.getBoundingClientRect() : null;
    if (!r || !r.height) {
      // a compact note (message only) has no header box: line the pager up
      // with its first row, the status badge
      box = root.querySelector(".ddd-block-chip");
      if (!box) {
        return;
      }
      const c = box.getBoundingClientRect();
      r = { top: c.top - 4, height: c.height + 8 };
    }
    // set on the shadow wrapper, never the host, so nothing is saved with
    // the content
    const me = wrap.getBoundingClientRect();
    wrap.style.setProperty(
      "--stop-note-group-pager-top",
      `${r.top - me.top}px`,
    );
    wrap.style.setProperty("--stop-note-group-pager-height", `${r.height}px`);
    wrap.style.setProperty(
      "--stop-note-group-pager-width",
      `${pager.getBoundingClientRect().width}px`,
    );
  }

  /**
   * HAX: show every note while editing so each one can be edited.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
    };
  }

  haxeditModeChanged(val) {
    this._editing = val;
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}
globalThis.customElements.define(StopNoteGroup.tag, StopNoteGroup);
export { StopNoteGroup };
