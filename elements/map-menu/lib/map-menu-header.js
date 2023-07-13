import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
class MapMenuHeader extends I18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          transition: 0.3s all ease;
          --map-menu-item-height: 44px;
        }
        :host([active]) button {
          font-weight: bold;
        }
        a,
        a:visited {
          display: block;
          color: var(--map-menu-item-a-color, inherit);
          text-decoration: var(--map-menu-header-a-text-decoration, none);
          transition: background-color 0.3s ease;
          background-color: transparent;
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
            var(--simple-colors-default-theme-light-grey-2, #dddddd)
          );
        }

        #link {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
        }

        #right simple-icon-lite {
          display: inline-block;
          color: gray;
        }

        simple-icon-lite {
          color: inherit;
          display: inline-flex;
          --simple-icon-height: var(--map-menu-item-icon-height);
          --simple-icon-width: var(--map-menu-item-icon-height);
          margin-right: 8px;
          margin-top: 12px;
          line-height: 44px;
        }

        .title {
          text-transform: none;
          font-size: var(--map-menu-font-size, 16px);
          font-family: "Open+Sans", sans-serif;
          text-overflow: ellipsis;
          height: 44px;
          line-height: 44px;
          vertical-align: middle;
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          word-break: break-all;
        }

        button {
          cursor: pointer;
          color: inherit;
          display: flex;
          background-color: transparent;
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0px;
          border: 0px;
          min-height: var(--map-menu-header-button-min-height, 44px);
          padding: 0px 16px;
          text-align: left;
          border-radius: 0px;
          height: var( --map-menu-item-button-height, var(--map-menu-item-height, 44px) );
          vertical-align: middle;
          line-height: var( --map-menu-item-button-height, var(--map-menu-item-height, 44px) );
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
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          color: orange;
          float: right;
          margin: -4px 32px 0px 0px;
          vertical-align: top;
          height: 0px;
          width: 0px;
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
          ${!this.published
            ? html`<simple-icon-lite
                id="unpublished"
                title="${this.t.pageIsUnpublished}"
                icon="icons:visibility-off"
              ></simple-icon-lite>`
            : ``}
        </button>
      </a>
    `;
  }

  static get tag() {
    return "map-menu-header";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.iconLabel = null;
    this.icon = null;
    this.url = "";
    this.status = "";
    this.opened = false;
    this.active = false;
    this.published = true;
    this.locked = false;
    this.itemtitle = "";
    this.t = {
      pageIsUnpublished: "Page is unpublished",
    };
    this.registerLocalization({
      context: this,
      namespace: "map-menu",
      localesPath: new URL("../locales", import.meta.url).href,
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
    return {
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
      url: {
        type: String,
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
          })
        );
      }
      this.dispatchEvent(
        new CustomEvent("active-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
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
        })
      );
    }
  }
}
customElements.define(MapMenuHeader.tag, MapMenuHeader);
export { MapMenuHeader };
