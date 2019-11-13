import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/map-menu/lib/map-menu-item.js";
import "@lrnwebcomponents/map-menu/lib/map-menu-header.js";
class MapMenuSubmenu extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([collapsable]) > map-menu-header {
          cursor: pointer;
          display: block;
        }
        #container {
          margin-left: 16px;
        }
        #container ::slotted(map-menu-item) {
          margin-top: 0.4em;
        }
      `
    ];
  }
  constructor() {
    super();
    this.opened = false;
    this.collapsable = true;
    this.expandChildren = false;
    this.avatarLabel = "";
    this.label = "";
    import("@polymer/iron-collapse/iron-collapse.js");
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      <map-menu-header
        .avatar-label="${this.avatarLabel}"
        id="${this.id}"
        title="${this.title}"
        label="${this.label}"
        ?opened="${this.opened}"
        url="${this.url}"
        icon="${this.icon}"
        selected="${this.selected}"
      ></map-menu-header>
      <iron-collapse id="container"> <slot></slot> </iron-collapse>
    `;
  }

  static get tag() {
    return "map-menu-submenu";
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    this.addEventListener("active-item", this.__activeChanged.bind(this));
    this.addEventListener("toggle-header", this.__toggleHeader.bind(this));
    this.addEventListener("link-clicked", this._headerClickHandler.bind(this));
    this.addEventListener(
      "map-menu-item-hidden-check",
      this._mapMenuItemHiddenCheckHandler.bind(this)
    );
  }
  /**
   * HTMLElement life cycle
   */
  disconnectedCallback() {
    this.removeEventListener("active-item", this.__activeChanged.bind(this));
    this.removeEventListener("toggle-header", this.__toggleHeader.bind(this));
    this.removeEventListener(
      "link-clicked",
      this._headerClickHandler.bind(this)
    );
    this.removeEventListener(
      "map-menu-item-hidden-check",
      this._mapMenuItemHiddenCheckHandler.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    return {
      id: {
        type: String
      },
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
      icon: {
        type: String
      },
      url: {
        type: String
      },
      opened: {
        type: Boolean
      },
      collapsable: {
        type: Boolean
      },
      expandChildren: {
        type: Boolean,
        attribute: "expand-children"
      },
      selected: {
        type: String
      }
    };
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        this._openedChanged(this[propName], oldValue);
      }
    });
  }

  _openedChanged(opened) {
    var target = this.shadowRoot.querySelector("#container");
    if (target) {
      if (opened && typeof target.show === "function") {
        target.show();
      } else if (typeof target.hide === "function") {
        target.hide();
      }
    }
  }

  _headerClickHandler(e) {
    if (!this.opened) {
      this.opened = !this.opened;
    }
  }

  _mapMenuItemHiddenCheckHandler(e) {
    const hiddenChild = e.detail.hiddenChild;
    let detail = Object.assign({}, e.detail);
    if (hiddenChild !== true && this.opened === false) {
      detail = Object.assign({}, detail, { hiddenChild: true });
    } else {
      detail = Object.assign({}, detail, { hiddenChild: false });
    }
    this.dispatchEvent(
      new CustomEvent("map-meu-item-hidden-check", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: detail
      })
    );
  }
  __toggleHeader(e) {
    // catch the event and end propagation
    e.stopPropagation();
    this.opened = !this.opened;
    this.dispatchEvent(
      new CustomEvent("toggle-updated", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { opened: this.opened }
      })
    );
  }
  __activeChanged(e) {
    this.opened = true;
  }
}
window.customElements.define(MapMenuSubmenu.tag, MapMenuSubmenu);
export { MapMenuSubmenu };
