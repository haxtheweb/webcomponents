import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/map-menu/lib/map-menu-header.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
class MapMenuSubmenu extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          overflow: hidden;
        }
        :host([collapsable]) > map-menu-builder {
          cursor: pointer;
          display: block;
        }
        #container {
          margin: 0;
        }
        #container ::slotted(map-menu-builder) {
          display: block;
          cursor: pointer;
          margin-left: 20px;
        }
        a11y-collapse {
          --a11y-collapse-border: 0;
          --a11y-collapse-horizontal-padding: 0;
          --a11y-collapse-vertical-padding: 0;
          color: var(--map-menu-item-a-color, inherit);
        }
      `,
    ];
  }
  constructor() {
    super();
    this.opened = false;
    this.collapsable = true;
    this.expandChildren = false;
    this.avatarLabel = "";
    this.label = "";
    this.status = "";
    this.locked = false;
    this.published = true;
    this.icon = "";
    this.__icon = "";
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
      <a11y-collapse id="container" ?expanded="${this.opened}">
        <map-menu-header
          .avatar-label="${this.avatarLabel}"
          id="${this.id}"
          title="${this.title}"
          label="${this.label}"
          ?opened="${this.opened}"
          url="${this.url}"
          selected="${this.selected}"
          icon="${this.icon}"
          slot="heading"
          ?published="${this.published}"
          ?locked="${this.locked}"
          status="${this.status}"
        ></map-menu-header>
        <slot></slot>
      </a11y-collapse>
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
        type: String,
      },
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
      icon: {
        type: String,
      },
      url: {
        type: String,
      },
      opened: {
        type: Boolean,
      },
      collapsable: {
        type: Boolean,
      },
      expandChildren: {
        type: Boolean,
        attribute: "expand-children",
      },
      selected: {
        type: String,
      },
      published: {
        type: Boolean,
      },
      locked: {
        type: Boolean,
      },
      status: {
        type: String,
        reflect: true,
      },
    };
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
        detail: detail,
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
        detail: { opened: this.opened },
      })
    );
  }
  __activeChanged(e) {
    this.opened = true;
  }
}
customElements.define(MapMenuSubmenu.tag, MapMenuSubmenu);
export { MapMenuSubmenu };
