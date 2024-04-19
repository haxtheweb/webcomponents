import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
class MapMenuItem extends I18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          transition: 0.3s all ease;
          font-size: var(--map-menu-item-font-size);
          --map-menu-item-height: 44px;
          --map-menu-item-icon-height: 24px;
          overflow: var(--map-menu-item-overflow, hidden);
        }
        :host([active]) button {
          font-weight: var(--map-menu-item-button-active-font-weight, bold);
          color: var(--map-menu-item-button-active-color, inherit);
          background-color: var(
            --map-menu-item-button-active-background-color,
            transparent
          );
        }
        simple-icon-lite {
          display: inline-flex;
          --simple-icon-height: var(--map-menu-item-icon-height);
          --simple-icon-width: var(--map-menu-item-icon-height);
          margin-right: 8px;
          margin-top: 12px;
          line-height: 44px;
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
          font-size: var(--map-menu-font-size, 16px);
          text-overflow: ellipsis;
          height: 44px;
          vertical-align: middle;
          width: auto;
          line-height: 44px;
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
        a button {
          transition: all 0.1s ease;
        }
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
          );
        }
        button {
          cursor: pointer;
          color: inherit;
          display: flex;
          font-family: inherit;
          background-color: transparent;
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0px;
          border: 0;
          min-height: var(--map-menu-header-button-min-height, 44px);
          padding: 0 16px;
          text-align: left;
          border-radius: 0;
          height: var(
            --map-menu-item-button-height,
            var(--map-menu-item-height, 44px)
          );
          vertical-align: middle;
          line-height: var(
            --map-menu-item-button-height,
            var(--map-menu-item-height, 44px)
          );
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
      `,
    ];
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <a tabindex="-1" href="${this.url}" title="${this.itemtitle}">
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
    `;
  }
  static get tag() {
    return "map-menu-item";
  }
  constructor() {
    super();
    this.icon = null;
    this.iconLabel = null;
    this.itemtitle = "";
    this.url = "";
    this.active = false;
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
      localesPath: new URL("../locales", import.meta.url).href,
      locales: ["es"],
    });
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
