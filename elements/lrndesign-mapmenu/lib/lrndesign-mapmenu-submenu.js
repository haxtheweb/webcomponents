import { LitElement, html, css } from "lit-element/lit-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "./lrndesign-mapmenu-item.js";
import "./lrndesign-mapmenu-header.js";
class LrndesignMapmenuSubmenu extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  render() {
    return html`
      <lrndesign-mapmenu-header
        @click="${this._headerClickHandler}"
        avatar-label="${this.avatarLabel}"
        title="${this.title}"
        label="${this.label}"
        ?opened="${this.opened}"
      ></lrndesign-mapmenu-header>
      <iron-collapse id="container"> <slot></slot> </iron-collapse>
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
        type: String,
        attribute: "avatar-label"
      },
      label: {
        type: String
      },
      opened: {
        type: Boolean
      },
      collapsable: {
        type: Boolean,
        reflect: true
      },
      expandChildren: {
        type: Boolean,
        attribute: "expand-children"
      }
    };
  }

  _openChanged(opened) {
    var target = this.shadowRoot.querySelector("#container");
    if (opened) target.show();
    if (!opened) target.hide();
  }

  _headerClickHandler(e) {
    if (this.collapsable) {
      this.opened = !this.opened;
    }
  }

  constructor() {
    super();
    this.opened = false;
    this.collapsable = true;
    this.expandChildren = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this._observer = new FlattenedNodesObserver(this, info => {
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
