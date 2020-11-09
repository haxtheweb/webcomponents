import { LitElement, html, css } from "lit-element/lit-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
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
        a11y-collapse {
          border: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <a11y-collapse id="container">
        <lrndesign-mapmenu-header
          avatar-label="${this.avatarLabel}"
          title="${this.title}"
          label="${this.label}"
          slot="heading"
        ></lrndesign-mapmenu-header>
        <slot></slot>
      </a11y-collapse>
    `;
  }

  static get tag() {
    return "lrndesign-mapmenu-submenu";
  }

  static get properties() {
    return {
      title: {
        type: String,
      },
      avatarLabel: {
        type: String,
        attribute: "avatar-label",
      },
      label: {
        type: String,
      },
      opened: {
        type: Boolean,
      },
      collapsable: {
        type: Boolean,
        reflect: true,
      },
      expandChildren: {
        type: Boolean,
        attribute: "expand-children",
      },
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
    this.label = "";
    this.title = "";
    this.avatarLabel = "";
    this.opened = false;
    this.collapsable = true;
    this.expandChildren = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this._observer = new FlattenedNodesObserver(this, (info) => {
      var submenus = info.addedNodes.filter(
        (item) => item.nodeName === "LRNDESIGN-MAPMENU-SUBMENU"
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
