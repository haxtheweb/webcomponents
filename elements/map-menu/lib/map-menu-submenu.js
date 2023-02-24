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
        :host([opened]) map-menu-header {
          /*border-left: 16px solid var(--map-menu-border-depth, rgba(0,0,0,.1));*/
        }
        #container {
          margin: 0;
        }
        #container ::slotted(map-menu-builder) {
          display: block;
        }
        #container ::slotted(map-menu-item),
        #container ::slotted(map-menu-submenu) {
          margin-left: 10px;
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
    this.itemtitle = "";
    this.locked = false;
    this.published = true;
    this.icon = null;
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

  // align the collapse state w/ this state
  // ensure we block this moving up tho or we'll align too much :)
  __alignCollapseState(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
    this.opened = e.detail.expanded;
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      <a11y-collapse
        id="container"
        ?expanded="${this.opened}"
        @a11y-collapse-click="${this.__alignCollapseState}"
      >
        <map-menu-header
          .avatar-label="${this.avatarLabel}"
          id="${this.id}"
          itemtitle="${this.itemtitle}"
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
      itemtitle: {
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
        attribute: "opened",
        reflect: true,
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
