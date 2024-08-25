import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
class MapMenuHeader extends I18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
          transition: 0.3s ease-in all;
        }

        :host([hovered]) {
          opacity: 0.8;
        }
        :host(:hover),
        :host(:focus) {
          opacity: 1;
        }

        a,
        a:visited {
          display: block;
          color: var(--map-menu-item-a-color, inherit);
          text-decoration: var(--map-menu-header-a-text-decoration, none);
          transition: background-color 0.3s ease;
          background-color: transparent;
        }

        :host([active]) button {
          font-weight: var(--map-menu-item-button-active-font-weight, bold);
        }
        :host([active]) button,
        :host([hovered]) button,
        a:hover button,
        a:focus-within button,
        a:focus button {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color, inherit)
          );
          text-decoration: var(--map-menu-header-a-text-decoration-hover, none);
          background-color: var(--map-menu-item-a-active-background-color);
        }

        #link {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
        }

        :host([hovered]) simple-icon-lite,
        :host(:hover) simple-icon-lite,
        :host(:focus-within) simple-icon-lite,
        :host(:focus) simple-icon-lite {
          visibility: none;
          opacity: 0;
          pointer-events: none;
        }

        simple-icon-lite {
          color: inherit;
          margin-left: 4px;
          display: inline-flex;
          --simple-icon-height: var(--map-menu-item-icon-height);
          --simple-icon-width: var(--map-menu-item-icon-height);
        }

        .title {
          text-transform: none;
          font-size: var(--map-menu-font-size);
          text-overflow: ellipsis;
          vertical-align: middle;
          max-width: 240px;
          margin-left: 8px;
          white-space: nowrap;
          overflow: hidden;
          word-break: break-all;
        }

        button {
          transition: 0.1s ease-in all;
          cursor: pointer;
          font-family: inherit;
          color: inherit;
          display: flex;
          background-color: transparent;
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0;
          border: 0px;
          padding: 10px 20px;
          text-align: left;
          border-radius: 0px;
          vertical-align: middle;
          line-height: var(
            --map-menu-item-button-height,
            var(--map-menu-item-height)
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
        :host([hide-in-menu]) {
          display: none;
        }
        :host(:not([icon=""])) button {
          padding-left: 0;
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
            : ``}
          <div class="title">${this.itemtitle}</div>
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
    return "map-menu-header";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.editControls = false;
    this.iconLabel = null;
    this.icon = null;
    this.url = "";
    this.status = "";
    this.opened = false;
    this.active = false;
    this.published = true;
    this.hideInMenu = false;
    this.hovered = false;
    this.locked = false;
    this.itemtitle = "";
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
      this.addEventListener("click", this.__tap.bind(this));
      this.addEventListener("keypress", this.__keypress.bind(this));
    }, 0);
  }

  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened" && oldValue !== undefined) {
        this._openedChanged(this[propName], oldValue);
      }
      if (["id", "selected"].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
    });
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      opened: {
        type: Boolean,
        reflect: true,
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
      url: {
        type: String,
      },
      hideInMenu: {
        type: Boolean,
        reflect: true,
        attribute: "hide-in-menu",
      },
      id: {
        type: String,
        reflect: true,
      },
      icon: {
        type: String,
        reflect: true,
      },
      active: {
        type: Boolean,
        reflect: true,
      },
      hovered: {
        type: Boolean,
        reflect: true,
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
      selected: {
        type: String,
        reflect: true,
      },
      __collapseIcon: {
        type: String,
      },
      __collapseAria: {
        type: String,
      },
    };
  }
  _openedChanged(newValue, oldValue) {
    if (newValue) {
      this.__collapseIcon = "icons:expand-more";
      this.__collapseAria = "collapse menu";
    } else {
      this.__collapseIcon = "icons:chevron-right";
      this.__collapseAria = "expand menu";
    }
  }
  __selectedChanged(selected, id) {
    if (selected === id) {
      if (!this.parentNode.expanded) {
        this.dispatchEvent(
          new CustomEvent("toggle-header", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: true,
          }),
        );
      }
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

  __tap(e) {
    // send to toggle event
    this.__toggleEventHandler(e);
  }

  __keypress(e) {
    // send to toggle event
    if (e.code === "Enter") {
      this.__toggleEventHandler(e);
    }
  }

  __toggleEventHandler(e) {
    if (!this.parentNode.expanded) {
      this.dispatchEvent(
        new CustomEvent("toggle-header", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        }),
      );
    }
  }
}
customElements.define(MapMenuHeader.tag, MapMenuHeader);
export { MapMenuHeader };
