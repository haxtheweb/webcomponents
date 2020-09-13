/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `elmsln-loading`
 * A spinner to tell the user that something is loading.
 * This is just the spinner though and doesn't provide any text or anything else.
 *
 * @microcopy - language worth noting:
 *  - elmsln - an open source NGDLE to save education
 *
 * @demo demo/index.html
 * @element elmsln-loading
 */
class ElmslnLoading extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        @-moz-keyframes spin {
          100% {
            -moz-transform: rotate(60deg);
            filter: saturate(10) invert(0.9);
          }
        }
        @-webkit-keyframes spin {
          100% {
            -webkit-transform: rotate(60deg);
            filter: saturate(10) invert(0.9);
          }
        }
        @keyframes spin {
          100% {
            -webkit-transform: rotate(60deg);
            transform: rotate(60deg);
          }
        }
        :host iron-icon {
          color: var(--simple-colors-default-theme-accent-6);
          display: block;
          -webkit-animation: spin 1.25s ease-out infinite;
          -moz-animation: spin 1.25s ease-out infinite;
          animation: spin 1.25s ease-out infinite;
        }
        :host([size="tiny"]) iron-icon {
          width: 16px;
          height: 16px;
          -webkit-animation: spin 0.75s ease-out infinite;
          -moz-animation: spin 0.75s ease-out infinite;
          animation: spin 0.75s ease-out infinite;
        }
        :host([size="small"]) iron-icon {
          width: 32px;
          height: 32px;
          -webkit-animation: spin 1s ease-out infinite;
          -moz-animation: spin 1s ease-out infinite;
          animation: spin 1s ease-out infinite;
        }
        :host([size="medium"]) iron-icon {
          width: 64px;
          height: 64px;
          -webkit-animation: spin 1.25s ease-out infinite;
          -moz-animation: spin 1.25s ease-out infinite;
          animation: spin 1.25s ease-out infinite;
        }
        :host([size="large"]) iron-icon {
          width: 80px;
          height: 80px;
          -webkit-animation: spin 1.25s ease-out infinite;
          -moz-animation: spin 1.25s ease-out infinite;
          animation: spin 1.25s ease-out infinite;
        }
        :host([size="epic"]) iron-icon {
          width: 400px;
          height: 400px;
          -webkit-animation: spin 2s ease-out infinite;
          -moz-animation: spin 2s ease-out infinite;
          animation: spin 2s ease-out infinite;
        }
      `,
    ];
  }
  static get tag() {
    return "elmsln-loading";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.size = "medium";
    import("@lrnwebcomponents/lrn-icons/lrn-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._getAccentColor(this[propName]);
      }
    });
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * color
       */
      color: {
        type: String,
      },
      /**
       * tiny, small, medium, large, epic sizing.
       */
      size: {
        type: String,
        reflect: true,
      },
    };
  }
  /**
   * LitElement render
   */
  render() {
    return html` <iron-icon icon="lrn:network"></iron-icon> `;
  }

  _getAccentColor(color) {
    color = color.replace("-text", "");
    if (
      (!this.accentColor || this.accentColor === "grey") &&
      this.colors[color]
    ) {
      this.accentColor = color;
    }
  }
}
window.customElements.define(ElmslnLoading.tag, ElmslnLoading);
export { ElmslnLoading };
