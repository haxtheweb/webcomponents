/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import {
  loadMathJax,
  typesetIn,
} from "@haxtheweb/lrn-math/lib/mathjax-loader.js";
import {
  applySvgContrast,
  watchSvgContrast,
  OVERRIDE_ATTRIBUTE,
} from "@haxtheweb/utils/lib/svg-contrast.js";

/**
 * `la-tex`
 * `render LaTeX formatted math and science content`
 * @demo demo/index.html
 * @element la-tex
 */
class LaTex extends I18NMixin(LitElement) {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      math: "Math",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/la-tex.en.json", import.meta.url).href + "/../",
    });
    this._inline = false;
    this.hydrated = false;
    this.initialText = this.innerText;
    this.hydrateLaTeX();
  }
  hydrateLaTeX() {
    // fetch MathJax alongside the layout bundle rather than after it
    const mathJax = loadMathJax().catch((error) => {
      console.warn(error.message);
    });
    ESGlobalBridgeStore.import(
      "latex2html5",
      new URL(`./lib/latex2html5.js`, import.meta.url).href,
    ).then(async () => {
      // es-global-bridge resolves a second import of a script that is still
      // loading right away; wait for it to finish (each la-tex now renders
      // itself, so one that gave up here would never render)
      if (
        !globalThis.LaTeX2HTML5 &&
        typeof ESGlobalBridgeStore.imports.latex2html5 === "string"
      ) {
        await new Promise((resolve) => {
          globalThis.document.addEventListener(
            "es-bridge-latex2html5-loaded",
            resolve,
            { once: true },
          );
        });
      }
      setTimeout(async () => {
        if (globalThis.LaTeX2HTML5) {
          // MathJax 4, shared with lrn-math and served with HAX; if it can
          // not load, the layout still renders with the TeX source showing
          await mathJax;
          try {
            if (globalThis.LaTeX2HTML5.hydrate) {
              // render just this element (its wrapper exists once it has
              // rendered); init re-scans the whole page for every la-tex
              await this.updateComplete;
              globalThis.LaTeX2HTML5.hydrate(this);
            } else {
              globalThis.LaTeX2HTML5.init();
            }
          } catch (error) {
            // the vendored bundle throws on page content it cannot parse;
            // log it instead of letting an uncaught error break the page
            console.error("la-tex failed to hydrate LaTeX content", error);
          }
        }
      }, 0);
    });
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          overflow-x: auto;
          container-type: inline-size;
        }
        /* placed inline by the page: no frame, exactly as before */
        .ddd-block.is-inline {
          display: contents;
        }
        .ddd-block.is-inline .ddd-block-header {
          display: none;
        }
        .ddd-block.is-inline .ddd-block-body {
          display: contents;
        }
        /* LaTeX2JS */
        div,
        svg {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        .pspicture {
          position: relative;
          margin: auto;
        }
        /* a picture whose drawing would be hard to see where it lands (an
           author color like linecolor=black on a dark page), or the backdrop
           the author picked */
        /* fallbacks: on a page without the DDD tokens (la-tex outside
           HAXcms) the backdrop must still paint */
        .pspicture[data-hax-contrast="light"] {
          background-color: var(--ddd-theme-default-white, #ffffff);
          color: var(--ddd-theme-default-coalyGray, #262626);
          border-radius: var(--ddd-radius-xs, 4px);
        }
        .pspicture[data-hax-contrast="dark"] {
          background-color: var(--ddd-theme-default-coalyGray, #262626);
          color: var(--ddd-theme-default-white, #ffffff);
          border-radius: var(--ddd-radius-xs, 4px);
        }

        /* pspicture slider controls sit side by side under the picture,
           which keeps its own (often wide) width. In a narrow block, stack
           them and keep them at the visible left edge while the picture
           scrolls, so none is pushed out of view (reflow) */
        /* the picture gets a fixed inline height for its drawing; slider
           controls come after the drawing, so let the box grow to hold
           them instead of letting them hang out of it */
        .pspicture:has(> label) {
          height: auto !important;
        }
        @container (max-width: 480px) {
          .pspicture > label {
            display: block;
            position: sticky;
            inset-inline-start: 0;
            width: fit-content;
            max-width: 100cqi;
          }
          .pspicture > label input {
            max-width: 100%;
          }
        }

        .enumerate {
          list-style: circle;
          padding: 12px;
        }

        span.tt {
          font-family: courier;
        }

        p.quotation {
          padding-block: 0;
          padding-inline: 15px 0;
          margin: 0 0 20px;
          font-size: 10pt;
        }

        .nicebox {
          margin-top: 20px;
          min-height: 20px;
          padding: 19px;
          margin-bottom: 20px;
          background-color: #f5f5f5;
          border: 1px solid #e3e3e3;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
          -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .latex-container {
          max-width: 870px;
          margin-right: auto;
          margin-left: auto;
          zoom: 1;
        }

        @media (min-width: 768px) and (max-width: 979px) {
          .latex-container {
            width: 724px;
          }
        }

        @media (max-width: 767px) {
          .latex-container {
            width: auto;
          }
        }

        pre {
          overflow: auto;
        }
      `,
    ];
  }
  static get properties() {
    return {
      hydrated: { type: Boolean, reflect: true },
      /**
       * background behind drawn (pspicture) pictures: "auto" (the default)
       * adds one only when the drawing would be hard to see where it is,
       * "light" or "dark" always, "none" never
       */
      backdrop: { type: String, reflect: true },
      initialText: { type: String },
      _inline: { type: Boolean, state: true },
    };
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`<div
      class="ddd-block ${this._inline ? "is-inline" : ""}"
      role="${this._inline ? nothing : "group"}"
      aria-labelledby="${this._inline ? nothing : "label"}"
    >
      ${renderDDDBlockHeader({
        id: "label",
        icon: "editor:functions",
        label: this.t.math + " · LaTeX",
      })}
      <div class="ddd-block-body"><div class="wrapper"></div></div>
    </div>`;
  }
  /**
   * The header is for display (block) equations only. When a page or theme
   * places la-tex inline, the frame steps aside so the math reads as it
   * always has.
   */
  _checkInline() {
    if (!this.isConnected || !globalThis.getComputedStyle) {
      return;
    }
    const display = globalThis.getComputedStyle(this).display || "";
    this._inline = display.indexOf("inline") === 0 || display === "contents";
  }
  /**
   * once LaTeX2HTML5 has laid out the content, typeset the math in it.
   * MathJax 2 only ever scanned the main document, so math inside this
   * element's shadow root used to stay as raw TeX.
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("hydrated") && this.hydrated) {
      const wrapper = this.shadowRoot.querySelector(".wrapper");
      if (wrapper) {
        typesetIn(wrapper)
          .catch((error) => {
            console.warn(error.message);
          })
          .then(() => this._checkContrast());
      }
    } else if (changedProperties.has("backdrop")) {
      this._checkContrast();
    }
  }
  /**
   * give a picture a backdrop when its drawing would be hard to see on the
   * page behind it (or as the author chose); the backdrop goes on the whole
   * picture so the math placed on it changes color with the lines
   */
  _checkContrast() {
    const wrapper =
      this.shadowRoot && this.shadowRoot.querySelector(".wrapper");
    if (!wrapper) {
      return;
    }
    const choice = ["light", "dark", "none"].includes(this.backdrop)
      ? this.backdrop
      : null;
    wrapper.querySelectorAll(".pspicture > svg").forEach((svg) => {
      if (choice) {
        svg.setAttribute(OVERRIDE_ATTRIBUTE, choice);
      } else {
        svg.removeAttribute(OVERRIDE_ATTRIBUTE);
      }
    });
    applySvgContrast(wrapper, { target: this._pictureOf });
  }
  _pictureOf(svg) {
    return svg.closest(".pspicture");
  }
  connectedCallback() {
    super.connectedCallback();
    // re-check when the page switches between light and dark
    if (this.shadowRoot) {
      this._startContrastWatch();
    }
  }
  disconnectedCallback() {
    if (this._stopContrastWatch) {
      this._stopContrastWatch();
      this._stopContrastWatch = null;
    }
    super.disconnectedCallback();
  }
  _startContrastWatch() {
    if (this._stopContrastWatch) {
      this._stopContrastWatch();
    }
    const wrapper = this.shadowRoot.querySelector(".wrapper");
    if (wrapper) {
      this._stopContrastWatch = watchSvgContrast(wrapper, {
        target: this._pictureOf,
      });
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._checkInline();
    this._startContrastWatch();
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "la-tex";
  }
  // Support being an editing interface element for HAX
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  // about to convert to content, ensure we are no longer the editable-table
  async haxpreProcessNodeToContent(node) {
    node.innerHTML = this.initialText;
    node.hydrated = false;
    return node;
  }
  // ALWAYS enable edit mode if HAX is around
  haxactiveElementChanged(el, _val) {
    this.innerHTML = this.initialText;
    this.hydrated = false;
    return el;
  }
  // allow HAX to toggle edit state when activated
  haxeditModeChanged(_val) {
    this.innerHTML = this.initialText;
    this.hydrated = false;
    setTimeout(() => {
      this.hydrateLaTeX();
    }, 0);
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(LaTex.tag, LaTex);
export { LaTex };
