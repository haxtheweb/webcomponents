/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

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
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this._inline = false;
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
          try {
            globalThis.LaTeX2HTML5.init();
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
      css`
        :host {
          display: block;
        }
        /* block header shared with the other DDD learning blocks */
        .frame {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          min-height: var(--ddd-control-height-sm);
          font-family: var(--ddd-font-primary);
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-label {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-body {
          display: block;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          overflow-x: auto;
        }
        /* placed inline by the page: no frame, exactly as before */
        .frame.is-inline {
          display: contents;
        }
        .frame.is-inline .frame-header {
          display: none;
        }
        .frame.is-inline .frame-body {
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
      _inline: { type: Boolean, state: true },
    };
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`<div
      class="frame ${this._inline ? "is-inline" : ""}"
      role="${this._inline ? nothing : "group"}"
      aria-labelledby="${this._inline ? nothing : "label"}"
    >
      <div class="frame-header">
        <span class="frame-chip" aria-hidden="true"
          ><simple-icon-lite icon="editor:functions"></simple-icon-lite
        ></span>
        <span class="frame-label" id="label">${this.t.math} · LaTeX</span>
      </div>
      <div class="frame-body"><div class="wrapper"></div></div>
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
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._checkInline();
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
