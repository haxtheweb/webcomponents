/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";

/**
 * `la-tex`
 * `render LaTeX formatted math and science content`
 * @demo demo/index.html
 * @element la-tex
 */
class LaTex extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.hydrated = false;
    this.initialText = this.innerText;
    this.hydrateLaTeX();
  }
  hydrateLaTeX() {
    ESGlobalBridgeStore.import(
      "latex2html5",
      new URL(`./lib/latex2html5.js`, import.meta.url).href,
    ).then(() => {
      setTimeout(() => {
        if (globalThis.LaTeX2HTML5) {
          globalThis.LaTeX2HTML5.init();
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
      css`
        :host {
          display: block;
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

        .enumerate {
          list-style: circle;
          padding: 12px;
        }

        span.tt {
          font-family: courier;
        }

        p.quotation {
          padding: 0 0 0 15px;
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
      initialText: { type: String },
    };
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`<div class="wrapper"></div>`;
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
  haxactiveElementChanged(el, val) {
    this.innerHTML = this.initialText;
    this.hydrated = false;
    return el;
  }
  // allow HAX to toggle edit state when activated
  haxeditModeChanged(val) {
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
