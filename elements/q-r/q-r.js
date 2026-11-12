/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

// fill {key} placeholders in a translated string
const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );

// formats qr-code can draw
const FORMATS = ["png", "svg", "html"];

/**
 * `q-r`
 * `wrapper for a qr code.`
 *
 * The code sits on its own white tile (black on white in either colour
 * scheme so phones can scan it) inside a small framed figure, with the
 * `title` as a link to `data` under it. The figure is the "frame" part and
 * the tile the "tile" part, so a surface that already frames it (a theme's
 * QR code panel) can drop the frame.
 *
 * @demo demo/index.html
 * @element q-r
 */
class QR extends I18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          max-width: 100%;
        }
        :host([hidden]) {
          display: none;
        }
        .frame {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          box-sizing: border-box;
          max-width: 100%;
          margin: var(--ddd-spacing-0, 0);
          padding: var(--ddd-spacing-3, 12px);
          border: var(--ddd-border-xs, 1px solid);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight, #e4e5e7),
            var(--ddd-theme-default-slateGray, #314d64)
          );
          border-radius: var(--ddd-radius-md, 8px);
          font-family: var(--ddd-font-navigation, sans-serif);
        }
        .tile {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          padding: var(--ddd-spacing-2, 8px);
          border-radius: var(--ddd-radius-sm, 4px);
          /* always black on white so it scans in either colour scheme */
          background-color: var(--ddd-theme-default-white, #ffffff);
          color: var(--ddd-theme-default-coalyGray, #262626);
          box-shadow: inset 0 0 0 1px
            var(--ddd-theme-default-limestoneLight, #e4e5e7);
          overflow: auto;
        }
        qr-code {
          display: block;
          max-width: 100%;
        }
        qr-code::part(code) {
          display: block;
          max-width: 100%;
          height: auto;
          image-rendering: pixelated;
        }
        .caption {
          max-width: 100%;
          font-size: var(--ddd-font-size-4xs, 14px);
          line-height: var(--ddd-lh-140, 1.4);
          text-align: center;
          overflow-wrap: anywhere;
        }
        .caption a {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: light-dark(
            var(--ddd-theme-default-link, #005fa9),
            var(--ddd-theme-default-linkLight, #cfeceb)
          );
          text-decoration: none;
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
          --simple-icon-color: currentColor;
        }
        .caption a:hover {
          text-decoration: underline;
        }
        .caption a:focus-visible {
          outline: var(--ddd-focus-ring, 2px solid);
          outline-offset: var(--ddd-focus-offset, 2px);
          border-radius: var(--ddd-radius-xs, 2px);
        }
        .note {
          margin: var(--ddd-spacing-0, 0);
          font-size: var(--ddd-font-size-4xs, 14px);
          line-height: var(--ddd-lh-140, 1.4);
          color: light-dark(
            var(--ddd-theme-default-slateGray, #314d64),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
        }
      `,
    ];
  }
  constructor() {
    super();
    this.modulesize = 4;
    this.margin = 2;
    this.format = "png";
    this._error = null;
    this.t = {
      qrCodeFor: "QR code for {title}",
      noData: "No data to show as a QR code",
      formatNotSupported: "QR code format {format} is not supported",
      noCanvas: "This browser can't draw the QR code (no canvas support)",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    import("@haxtheweb/q-r/lib/qr-code.js");
  }
  /**
   * Why no code can be drawn ("data", "format", "canvas"), or null
   */
  get problem() {
    if (!this.data) {
      return "data";
    }
    if (!FORMATS.includes(this.format)) {
      return "format";
    }
    return this._error;
  }
  /**
   * The muted note shown instead of a code
   */
  problemText(problem) {
    switch (problem) {
      case "data":
        return this.t.noData;
      case "format":
        return fill(this.t.formatNotSupported, { format: this.format });
      case "canvas":
        return this.t.noCanvas;
    }
    return "";
  }
  /**
   * Accessible name of the code: "QR code for {title}", the data when
   * there is no title
   */
  get altText() {
    return fill(this.t.qrCodeFor, { title: this.title || this.data || "" });
  }
  /**
   * href for the title link; script and data URLs are never linked
   */
  get safeHref() {
    const value = String(this.data || "").trim();
    if (!value || /^(javascript|data|vbscript):/i.test(value)) {
      return null;
    }
    return value;
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // a new code to draw clears the last drawing error
    if (changedProperties.has("data") || changedProperties.has("format")) {
      this._error = null;
    }
  }
  _codeError(e) {
    const reason = e && e.detail ? e.detail.reason : null;
    // missing data and formats are caught before qr-code is rendered
    if (reason === "canvas") {
      this._error = reason;
    }
  }
  render() {
    const problem = this.problem;
    const href = this.safeHref;
    return html`
      <figure class="frame" part="frame">
        ${
          problem
            ? html`<p class="note" part="note">${this.problemText(problem)}</p>`
            : html`<div class="tile" part="tile">
                <qr-code
                  id="qr"
                  data="${this.data}"
                  modulesize="${this.modulesize}"
                  margin="${this.margin}"
                  format="${this.format}"
                  alt="${this.altText}"
                  @qr-code-error="${this._codeError}"
                ></qr-code>
              </div>`
        }
        ${
          this.title
            ? html`<figcaption class="caption" part="caption">
                ${
                  href
                    ? html`<a href="${href}" id="link"
                        >${this.title}<simple-icon-lite
                          icon="icons:open-in-new"
                          aria-hidden="true"
                        ></simple-icon-lite
                      ></a>`
                    : html`<span id="link">${this.title}</span>`
                }
              </figcaption>`
            : nothing
        }
      </figure>
    `;
  }
  static get tag() {
    return "q-r";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Data to code via QR code
       */
      data: {
        type: String,
      },
      /**
       * Alternate title for the data
       */
      title: {
        type: String,
      },
      /**
       * module size of the square
       */
      modulesize: {
        type: Number,
      },
      /**
       * Margin on the square
       */
      margin: {
        type: Number,
      },
      /**
       * format to output
       */
      format: {
        type: String,
      },
      _error: {
        type: String,
        state: true,
      },
    };
  }
  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    // Establish hax property binding
    return new URL("./lib/q-r.haxProperties.json", import.meta.url).href;
  }
}
globalThis.customElements.define(QR.tag, QR);
export { QR };
