import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { IronButtonState } from "@polymer/iron-behaviors/iron-button-state.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
class LrndesignMapmenuHeader extends mixinBehaviors(
  [IronButtonState],
  PolymerElement
) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #container {
          display: flex;
          align-items: center;
        }
        #icon {
          margin-right: 10px;
        }
        #center {
          flex: 1 1 auto;
        }
        lrndesign-avatar {
          display: inline-block;
          position: relative;
        }
        lrndesign-avatar ::slotted(*) {
          transform: translateY(2px);
        }
        #title {
          font-size: 19.2px;
        }
        #right simple-icon {
          color: gray;
          display: inline-flex;
        }
      </style>
      <div id="container">
        <template is="dom-if" if="[[avatarLabel]]">
          <div id="icon">
            <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>
          </div>
        </template>
        <div id="center">
          <div id="label">[[label]]</div>
          <div id="title">[[title]]</div>
        </div>
        <div id="right">
          <template is="dom-if" if="[[!opened]]">
            <simple-icon icon="arrow-drop-down"></simple-icon>
          </template>
          <template is="dom-if" if="[[opened]]">
            <simple-icon icon="arrow-drop-up"></simple-icon>
          </template>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lrndesign-mapmenu-header";
  }

  static get properties() {
    return {
      title: {
        type: String,
      },
      label: {
        type: String,
      },
      avatarLabel: {
        type: String,
        value: "",
      },
      opened: {
        type: Boolean,
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
  }
}
window.customElements.define(
  LrndesignMapmenuHeader.tag,
  LrndesignMapmenuHeader
);
export { LrndesignMapmenuHeader };
