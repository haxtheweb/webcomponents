import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@polymer/paper-button/paper-button.js";
import "./lrndesign-mapmenu-item.js";
import "./lrndesign-mapmenu-header.js";
class LrndesignMapmenuSubmenu extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host([collapsable]) > lrndesign-mapmenu-header {
          cursor: pointer;
          display: block;
        }
        #container {
          padding: 16px;
        }
        #container ::slotted(lrndesign-mapmenu-item) {
          margin-top: 6.4px;
        }
      </style>
      <lrndesign-mapmenu-header
        on-click="_headerClickHandler"
        avatar-label="[[avatarLabel]]"
        title="[[title]]"
        label="[[label]]"
        opened="[[opened]]"
      ></lrndesign-mapmenu-header>
      <iron-collapse id="container"> <slot id="slot"></slot> </iron-collapse>
    `;
  }

  static get tag() {
    return "lrndesign-mapmenu-submenu";
  }

  static get properties() {
    return {
      title: {
        type: String
      },
      avatarLabel: {
        type: String
      },
      label: {
        type: String
      },
      opened: {
        type: Boolean,
        value: false
      },
      collapsable: {
        type: Boolean,
        value: true
      },
      expandChildren: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return ["_openChanged(opened)"];
  }

  _openChanged(opened) {
    var target = this.$.container;
    if (opened) target.show();
    if (!opened) target.hide();
  }

  _headerClickHandler(e) {
    if (this.collapsable) {
      this.opened = !this.opened;
    }
  }

  ready() {
    super.ready();
    this._observer = new FlattenedNodesObserver(this.$.slot, info => {
      var submenus = info.addedNodes.filter(
        item => item.nodeName === "LRNDESIGN-MAPMENU-SUBMENU"
      );
      if (this.expandChildren) {
        for (let menu of submenus) {
          menu.setAttribute("opened", true);
        }
      }
    });
  }
  disconnectedCallback() {
    this._observer.disconnect();
    super.disconnectedCallback();
  }
}
window.customElements.define(
  LrndesignMapmenuSubmenu.tag,
  LrndesignMapmenuSubmenu
);
export { LrndesignMapmenuSubmenu };
