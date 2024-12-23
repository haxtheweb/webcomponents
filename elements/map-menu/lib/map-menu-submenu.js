import { LitElement, html, css } from "lit";
import "@haxtheweb/map-menu/lib/map-menu-header.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
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
        :host([hide-in-menu]) {
          display: none;
        }
        #container {
          margin: 0 0 -2px 0;
        }
        #container ::slotted(map-menu-builder) {
          display: var(--map-menu-submenu-display, block);
        }
        a11y-collapse {
          --a11y-collapse-border: 0;
          --a11y-collapse-horizontal-padding: 0;
          --a11y-collapse-vertical-padding: 0;
          color: var(--map-menu-item-a-color, inherit);
          --simple-tooltip-margin: 0 -36px 0 0;
        }
        :host([is-flex]) a11y-collapse {
          --a11y-collapse-transition-duration: var(
            --a11y-collapse-transition-duration,
            0.15s
          );
        }
        :host([is-flex][is-nested]) a11y-collapse {
          --a11y-collapse-transition-duration: 0s;
        }

        #container ::slotted(map-menu-builder)::after {
          transition: 0.3s ease-in-out all;
        }
        :host([opened]) #container ::slotted(map-menu-builder)::after {
          display: block;
          width: var(--map-menu-submenu-after-width, 12px);
          bottom: 2px;
          content: "";
          position: relative;
          border-bottom: 2px solid
            var(--map-menu-item-a-active-background-color, black);
        }
        a11y-collapse::before {
          transition: 0.3s ease-in-out all;
        }
        :host([opened]) a11y-collapse::before {
          display: block;
          width: 12px;
          height: 40px;
          content: "";
          position: absolute;
          border-bottom: 2px solid
            var(--map-menu-item-a-active-background-color, black);
        }

        :host([is-nested]) a11y-collapse::before,
        :host([is-nested]) #container ::slotted(map-menu-builder)::after {
          border-bottom: 0;
        }

        :host([active]) a11y-collapse::part(icon),
        :host([hovered]) a11y-collapse::part(icon) {
          color: var(--map-menu-item-icon-active-color, black);
          background-color: var(--map-menu-container-background-color, white);
        }

        a11y-collapse::part(icon) {
          position: var(--a11y-collapse-icon-position, absolute);
          margin-left: 4px;
          --simple-icon-height: 18px;
          --simple-icon-width: 18px;
        }
        :host(:not([icon=""])) a11y-collapse::part(icon) {
          visibility: none;
          opacity: 0;
        }
        :host(:focus) a11y-collapse::part(icon),
        :host(:hover) a11y-collapse::part(icon) {
          visibility: visible;
          opacity: 1;
          color: var(--map-menu-item-icon-active-color, black);
          background-color: var(--map-menu-container-background-color, white);
        }
        :host([is-flex][is-nested]) a11y-collapse::part(icon) {
          display: none;
        }
        :host([is-flex][is-nested]) map-menu-header::part(icon) {
          display: none;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.editControls = false;
    this.iconLabel = null;
    this.opened = false;
    this.collapsable = true;
    this.isFlex = false;
    this.isNested = false;
    this.isHorizontal = false;
    this.expandChildren = false;
    this.hovered = false;
    this.active = false;
    this.label = "";
    this.status = "";
    this.itemtitle = "";
    this.locked = false;
    this.published = true;
    this.hideInMenu = false;
    this.icon = null;
    this.__icon = "";
    setTimeout(() => {
      this.addEventListener("active-item", this.__activeChanged.bind(this));
      this.addEventListener("toggle-header", this.__toggleHeader.bind(this));
      this.addEventListener(
        "link-clicked",
        this._headerClickHandler.bind(this),
      );
      this.addEventListener(
        "map-menu-item-hidden-check",
        this._mapMenuItemHiddenCheckHandler.bind(this),
      );
      this.addEventListener("focusin", this.__active.bind(this));
      this.addEventListener("focusout", this.__deactive.bind(this));
      this.addEventListener("mouseover", this.__active.bind(this));
      this.addEventListener("mouseleave", this.__deactive.bind(this));
    }, 0);
  }

  __active(e) {
    this.hovered = true;
    if (e.type == "mouseover") {
      if (this.isHorizontal && !this.isNested && this.opened == false) {
        this.opened = true;
      }
    }
  }
  __deactive(e) {
    this.hovered = false;
    if (e.type == "mouseleave") {
      if (this.isHorizontal && !this.isNested && this.opened == true) {
        this.opened = false;
      }
    }
  }

  // align the collapse state w/ this state
  // ensure we block this moving up tho or we'll align too much :)
  __alignCollapseState(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
    this.opened = e.detail.expanded;
    if (this.isHorizontal) {
      // when the user tabs to the open icon
      this.dispatchEvent(
        new CustomEvent("opened-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
        }),
      );
    }
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
          id="${this.id}"
          ?edit-controls="${this.editControls}"
          itemtitle="${this.itemtitle}"
          label="${this.label}"
          ?hovered="${this.hovered}"
          ?opened="${this.opened}"
          url="${this.url}"
          selected="${this.selected}"
          icon="${this.icon}"
          icon-label="${this.iconLabel}"
          slot="heading"
          ?published="${this.published}"
          ?hide-in-menu="${this.hideInMenu}"
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
      iconLabel: {
        type: String,
        attribute: "icon-label",
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
      hideInMenu: {
        type: Boolean,
        reflect: true,
        attribute: "hide-in-menu",
      },
      label: {
        type: String,
      },
      hovered: {
        type: Boolean,
        reflect: true,
      },
      active: {
        type: Boolean,
        reflect: true,
      },
      icon: {
        type: String,
        reflect: true,
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
      isFlex: { type: Boolean, attribute: "is-flex" },
      isNested: {
        type: Boolean,
        attribute: "is-nested",
      },
      isHorizontal: {
        type: Boolean,
        attribute: "is-horizontal",
        reflect: true,
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
        reflect: true,
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
      }),
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
      }),
    );
  }
  __activeChanged(e) {
    if (this.shadowRoot.querySelector("map-menu-header") === e.detail) {
      this.active = true;
    } else {
      this.active = false;
    }
    if (this.isHorizontal && !this.isNested) {
      this.blur();
      this.opened = false;
    } else {
      this.opened = true;
    }
  }
}
customElements.define(MapMenuSubmenu.tag, MapMenuSubmenu);
export { MapMenuSubmenu };
