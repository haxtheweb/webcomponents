import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-icons/places-icons.js";
/**
 * `hax-item-button-inner`
 * `A button on the hax-gizmo-browser app display`
 * @demo demo/index.html
 */
class HaxItemButtonInner extends SimpleColors {
  /**
   * LitElement life cycle - styles addition
   */
  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    styles.push(css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .button-inner {
        width: 30px;
        height: 30px;
        padding: 5px;
        background-color: var(--simple-colors-default-theme-accent-7, #000);
        border-radius: 50%;
      }
      iron-icon {
        width: 30px;
        height: 30px;
        color: var(--simple-colors-default-theme-grey-1, #fff);
      }
      .item-label {
        margin-top: 8px;
        color: var(--simple-colors-default-theme-grey-12, #000);
        width: 70px;
        font-size: 12px;
        line-height: 12px;
        height: 12px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
    `);
    return styles;
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      <div class="button-inner">
        <iron-icon icon="${this.icon}" ?hidden="${!this.icon}"></iron-icon>
      </div>
      <div class="item-label">${this.label}</div>
    `;
  }
  static get tag() {
    return "hax-item-button-inner";
  }
  /**
   * LitElement life cycle - properties changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._getAccentColor(this[propName], oldValue);
      }
    });
  }
  static get properties() {
    let props = {
      /**
       * label
       */
      label: {
        type: String
      },
      /**
       * Icon for the button, optional.
       */
      icon: {
        type: String
      },
      /**
       * color name of the item
       */
      color: {
        type: String
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  _getAccentColor(color) {
    if (
      (!this.accentColor || this.accentColor === "grey") &&
      this.colors[color]
    ) {
      this.accentColor = color;
    }
  }
}
window.customElements.define(HaxItemButtonInner.tag, HaxItemButtonInner);
export { HaxItemButtonInner };
