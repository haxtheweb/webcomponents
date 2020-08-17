import { LitElement, html, css } from "lit-element/lit-element.js";
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
    this.published = true;
    import("@lrnwebcomponents/map-menu/lib/map-menu-header.js");
    import("@polymer/iron-collapse/iron-collapse.js");
    setTimeout(() => {
      this.addEventListener("active-item", this.__activeChanged.bind(this));
      this.addEventListener("toggle-header", this.__toggleHeader.bind(this));
      this.addEventListener(
        "link-clicked",
        this._headerClickHandler.bind(this)
      );
      this.addEventListener(
        "map-menu-item-hidden-check",
        this._mapMenuItemHiddenCheckHandler.bind(this)
      );
    }, 0);
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
      ></map-menu-header>
      <iron-collapse id="container"> <slot></slot> </iron-collapse>
    `;
  }

  static get tag() {
    return "map-menu-submenu";
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
      },
      published: {
        type: Boolean
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
      if (propName == "published") {
        if (this.published === false) {
          this.icon = "visibility-off";
        }
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
