import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
/**
 *
 * @customElement
 * @element simple-tag
 * @class SimpleTag
 * @extends {LitElement}
 * @demo ./demo/tags.html Demo
 */
export const SimpleTagLiteSuper = function (SuperClass) {
  return class extends SuperClass {
    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.properties;
      }
      return {
        ...props,
        readonly: {
          type: Boolean,
          reflect: true,
        },
        icon: { type: String },
        disabled: {
          type: Boolean,
          reflect: true,
        },
        value: {
          type: String,
        },
        data: {
          type: Object,
        },
        cancelButton: {
          type: Boolean,
          attribute: "cancel-button",
        },
        toggles: {
          type: Boolean,
          attribute: "toggles",
        },
        toggled: {
          type: Boolean,
          attribute: "toggled",
        },
        toggledIcon: { type: String, attribute: "toggled-icon" },
      };
    }
    constructor() {
      super();
      this.data = {};
      this.icon = "cancel";
      this.cancelButton = false;
      this.disabled = false;
      this.readonly = false;
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          :host {
            display: inline-flex;
            align-items: center;
            color: var(
              --simple-fields-button-color,
              var(--simple-fields-color)
            );
            background-color: var(
              --simple-fields-button-background-color,
              var(--simple-fields-background-color)
            );
            font-size: var(--simple-fields-font-size, 16px);
            font-family: var(--simple-fields-font-family, sans-serif);
            line-height: var(--simple-fields-line-height, 22px);
            border-radius: var(--simple-fields-tag-border-radius, 4px);
            padding: var(--simple-fields-button-padding, 2px)
              calc(2 * var(--simple-fields-button-padding, 2px));
            border-width: var(--simple-fields-tag-border-width, 1px);
            border-style: solid;
            border-color: var(
              --simple-fields-fieldset-border-color,
              var(--simple-fields-border-color-light, #ccc)
            );
          }
          :host([draggable="true"]) {
            cursor: move;
          }
          simple-icon-button-lite {
            cursor: pointer;
            margin-left: var(--simple-fields-tag-margin-left, 4px);
            --simple-icon-height: var(--simple-fields-font-size, 16px);
            --simple-icon-width: var(--simple-fields-font-size, 16px);
          }
          :host([hidden]) {
            display: none;
          }
          :host([disabled]):not([readonly]) {
            opacity: 0.5;
          }
        `,
      ];
    }
    render() {
      return html`
        <span>${this.value}<slot></slot></span>
        ${!!this.readonly
          ? ""
          : html`
              <simple-icon-button-lite
                icon="${!!this.toggles && !!this.toggled && !!this.toggledIcon
                  ? this.toggledIcon
                  : this.icon}"
                label="Remove ${this.value}"
                ?hidden="${!this.cancelButton}"
                @click="${this.clickEvent}"
                ?disabled="${this.disabled}"
                ?toggles="${this.toggles}"
                ?toggled="${this.toggled}"
              ></simple-icon-button-lite>
            `}
      `;
    }
    clickEvent(e) {
      if (!!this.toggles) this.toggled = !this.toggled;
      this.dispatchEvent(
        new CustomEvent("simple-tag-clicked", {
          composed: false,
          bubbles: false,
          cancelable: false,
          detail: {
            value: this.value,
          },
        }),
      );
    }
  };
};
export class SimpleTagLite extends SimpleTagLiteSuper(LitElement) {
  static get tag() {
    return "simple-tag-lite";
  }
}
customElements.define(SimpleTagLite.tag, SimpleTagLite);
