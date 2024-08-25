import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
class MapMenuItem extends I18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
          font-size: var(--map-menu-font-size);
          overflow: var(--map-menu-item-overflow, hidden);
        }
        simple-icon-lite {
          display: inline-flex;
          --simple-icon-height: var(--map-menu-item-icon-height);
          --simple-icon-width: var(--map-menu-item-icon-height);
          margin-right: 8px;
        }
        :host(:not([published])) {
          text-decoration: line-through;
          color: red;
          opacity: 0.5;
        }

        :host([hide-in-menu]) {
          display: none;
        }

        .title {
          text-transform: none;
          font-size: var(--map-menu-font-size);
          text-overflow: ellipsis;
          vertical-align: middle;
          width: auto;
          white-space: nowrap;
          overflow: hidden;
          word-break: break-all;
        }
        a,
        a:visited {
          display: block;
          color: var(--map-menu-item-a-color, inherit);
          text-decoration: var(--map-menu-item-a-text-decoration, none);
        }
        :host([active]) button {
          font-weight: var(--map-menu-item-button-active-font-weight, bold);
        }
        :host([active]) a button,
        a:hover button,
        a:active button,
        a:focus button {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color, inherit)
          );
          text-decoration: var(--map-menu-header-a-text-decoration-hover, none);
          background-color: var(
            --map-menu-item-a-active-background-color,
            black
          );
        }
        button {
          cursor: pointer;
          color: inherit;
          transition: 0.1s ease-in all;
          display: flex;
          font-family: inherit;
          background-color: transparent;
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0px;
          border: 0;
          line-height: var(
            --map-menu-item-button-height,
            var(--map-menu-item-height)
          );
          padding: 10px 0 10px 30px;
          text-align: left;
          border-radius: 0;
          vertical-align: middle;
        }
        :host(:not([icon=""])) button {
          padding: 10px 0 10px 4px;
        }
        :host([status="new"]) a::after {
          border-right: 8px solid green;
          content: "";
          margin-left: -8px;
        }
        :host([status="modified"]) a::after {
          border-right: 8px solid orange;
          content: "";
          margin-left: -8px;
        }
        :host([status="delete"]) a::after {
          border-right: 8px solid red;
          content: "";
          margin-left: -8px;
        }
        #unpublished {
          color: red;
        }
        .no-icon {
          display: inline-flex;
        }
        .ops {
          position: absolute;
          display: block;
          right: 0px;
          height: 40px;
          top: 0px;
          z-index: 2;
          margin: 0 4px 0 0;
        }
        .ops .op {
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
          margin: 4px;
          color: var(--map-menu-item-a-active-color, black);
        }
      `,
    ];
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html` <a tabindex="-1" href="${this.url}" title="${this.itemtitle}">
        <button>
          ${!this.published
            ? html`<simple-icon-lite
                id="unpublished"
                title="${this.t.pageIsUnpublished}"
                icon="icons:visibility-off"
              ></simple-icon-lite>`
            : ``}
          ${this.icon
            ? html`
                <simple-icon-lite
                  icon="${this.icon}"
                  id="icon"
                ></simple-icon-lite>
                ${this.iconLabel
                  ? html`<simple-tooltip for="icon"
                      >${this.iconLabel}</simple-tooltip
                    >`
                  : ``}
              `
            : html`<div class="no-icon"></div>`}
          <span class="title">${this.itemtitle}</span>
        </button>
      </a>
      ${this.editControls && this.active
        ? html` <div class="ops">
            <haxcms-button-add
              class="op"
              type="child"
              label="Add child page"
              action-id="${this.id}"
            ></haxcms-button-add>
          </div>`
        : ``}`;
  }
  static get tag() {
    return "map-menu-item";
  }
  constructor() {
    super();
    this.editControls = false;
    this.icon = null;
    this.iconLabel = null;
    this.itemtitle = "";
    this.url = "";
    this.active = false;
    this.hovered = false;
    this.hideInMenu = false;
    this.published = false;
    this.locked = false;
    this.status = "";
    this.t = {
      pageIsUnpublished: "Page is unpublished",
    };
    this.registerLocalization({
      context: this,
      namespace: "map-menu",
      localesPath:
        new URL("../locales/map-menu.es.json", import.meta.url).href + "/../",
      locales: ["es"],
    });
    setTimeout(() => {
      this.addEventListener("focusin", this.__active.bind(this));
      this.addEventListener("focusout", this.__deactive.bind(this));
      this.addEventListener("mouseover", this.__active.bind(this));
      this.addEventListener("mouseleave", this.__deactive.bind(this));
    }, 0);
  }

  __active() {
    this.hovered = true;
  }
  __deactive() {
    this.hovered = false;
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    return {
      ...super.properties,
      icon: {
        type: String,
        reflect: true,
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
      hovered: {
        type: Boolean,
        reflect: true,
      },
      iconLabel: {
        type: String,
        attribute: "icon-label",
      },
      itemtitle: {
        type: String,
      },
      url: {
        type: String,
      },
      id: {
        type: String,
        reflect: true,
      },
      active: {
        type: Boolean,
        reflect: true,
      },
      selected: {
        type: String,
      },
      published: {
        type: Boolean,
        reflect: true,
      },
      hideInMenu: {
        type: Boolean,
        reflect: true,
        attribute: "hide-in-menu",
      },
      locked: {
        type: Boolean,
        reflect: true,
      },
      status: {
        type: String,
        reflect: true,
      },
    };
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["id", "selected"].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
    });
  }
  __selectedChanged(selected, id) {
    if (selected === id) {
      this.dispatchEvent(
        new CustomEvent("active-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
    }
  }

  _click() {
    this.dispatchEvent(
      new CustomEvent("link-clicked", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  }
}
customElements.define(MapMenuItem.tag, MapMenuItem);
export { MapMenuItem };
