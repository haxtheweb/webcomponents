/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `doodle-board`
 * A drawing on an optional background image. One element covers three
 * uses through `mode`:
 *
 * - draw: a picture made in HAX, or by visitors when `interactive`
 * - feedback: marks, highlight zones and comments over a submission
 *   (the submission is `src`, the marks are `drawing`)
 * - signature: a signature pad
 *
 * The marks are a transparent PNG kept apart from the background, so the
 * background can be swapped without losing them. In HAX the Drawing
 * setting uses the "doodle" input method: a preview in the settings
 * panel and a dialog with the full editor.
 *
 * @demo demo/index.html
 * @element doodle-board
 */
export class DoodleBoard extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "doodle-board";
  }

  constructor() {
    super();
    this.mode = "draw";
    this.src = "";
    this.drawing = "";
    this.alt = "";
    this.caption = "";
    this.interactive = false;
    this.width = 0;
    this.height = 0;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      empty: "Nothing drawn yet",
      drawing: "Drawing",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** draw, feedback or signature */
      mode: { type: String, reflect: true },
      /** background image: a submission to mark up, or a picture to draw on */
      src: { type: String },
      /** the marks, a transparent PNG data URL */
      drawing: { type: String },
      /** describes the drawing and its background for people who cannot see it */
      alt: { type: String },
      caption: { type: String },
      /** visitors draw on the published page and can download their picture */
      interactive: { type: Boolean, reflect: true },
      /** surface size when there is no background image */
      width: { type: Number },
      height: { type: Number },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
        }
        :host([hidden]) {
          display: none;
        }
        figure {
          margin: 0;
        }
        .picture {
          position: relative;
          display: grid;
          border-radius: var(--ddd-radius-xs);
          overflow: hidden;
        }
        :host(:not([mode="signature"])) .picture {
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-limestoneLight);
          background-color: var(--ddd-theme-default-white);
        }
        :host([mode="signature"]) .picture {
          max-width: 480px;
          border-bottom: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-limestoneGray);
        }
        .picture img {
          grid-area: 1 / 1;
          display: block;
          width: 100%;
          height: auto;
        }
        .empty {
          display: grid;
          place-items: center;
          aspect-ratio: 3 / 2;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-theme-default-slateGray);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
        }
        figcaption {
          margin-top: var(--ddd-spacing-2);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-theme-default-slateGray);
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    // load the editor only for pages that offer it to visitors
    if (changedProperties.has("interactive") && this.interactive) {
      import("./lib/doodle-board-canvas.js");
    }
  }

  render() {
    return html`
      <figure>
        ${this.interactive ? this._renderCanvas() : this._renderPicture()}
        ${
          this.caption
            ? html`<figcaption>${this.caption}</figcaption>`
            : nothing
        }
      </figure>
    `;
  }

  _renderCanvas() {
    return html`<doodle-board-canvas
      mode="${this.mode}"
      .src="${this.src}"
      .value="${this.drawing}"
      .width="${this.width}"
      .height="${this.height}"
      label="${this.alt || this.t.drawing}"
      background-upload
      downloadable
    ></doodle-board-canvas>`;
  }

  _renderPicture() {
    if (!this.src && !this.drawing) {
      return html`<div class="picture">
        <div class="empty">${this.t.empty}</div>
      </div>`;
    }
    return html`<div
      class="picture"
      role="img"
      aria-label="${this.alt || this.t.drawing}"
    >
      ${this.src ? html`<img src="${this.src}" alt="" />` : nothing}
      ${this.drawing ? html`<img src="${this.drawing}" alt="" />` : nothing}
    </div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(DoodleBoard.tag, DoodleBoard);
