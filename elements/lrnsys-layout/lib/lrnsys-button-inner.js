import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `lrnsys-button-inner`
 * @customElement lrnsys-button-inner
 */
class LrnsysButtonInner extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host > div > * {
          vertical-align: middle;
        }
        .text-label {
          margin-left: 8px;
        }
        .text-label-only {
          margin-left: 0;
        }
      </style>
      <div>
        <template is="dom-if" if="[[avatar]]">
          <paper-avatar src\$="[[avatar]]"></paper-avatar>
        </template>
        <template is="dom-if" if="[[icon]]">
          <lrn-icon icon="[[icon]]"></lrn-icon>
        </template>
        <template is="dom-if" if="[[text]]">
          <span class\$="[[_getTextLabelClass(avatar,icon)]]">[[text]]</span>
        </template>
      </div>
      <div><slot name="button"></slot><slot></slot></div>
    `;
  }

  static get tag() {
    return "lrnsys-button-inner";
  }

  static get properties() {
    return {
      /**
       * Icon to present for clicking.
       */
      icon: {
        type: String
      },
      /**
       * Icon to present for clicking.
       */
      avatar: {
        type: String
      },
      /**
       * Text to present for clicking.
       */
      text: {
        type: String
      }
    };
  }

  /**
   * Find out if the text does not have an avatar or an icon to the left,
   * and add a class to remove the left margin.
   */
  _getTextLabelClass(avatar, icon) {
    if (!avatar && !icon) {
      return "text-label-only";
    }
    return "text-label";
  }
}
window.customElements.define(LrnsysButtonInner.tag, LrnsysButtonInner);
export { LrnsysButtonInner };
