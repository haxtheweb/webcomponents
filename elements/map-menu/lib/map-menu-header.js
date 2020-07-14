import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-behaviors/iron-button-state.js";
import "@polymer/paper-button/paper-button.js";
class MapMenuHeader extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          transition: 0.1s all ease-in-out;
          --map-menu-item-height: 24px;
        }
        :host([active]) {
          background: var(--map-menu-active-color);
          color: var(--map-menu-item-active-item-color, #000000);
        }
        #container {
          display: flex;
          align-items: center;
        }

        .avatarlabel {
          margin-right: 10px;
        }

        #center {
          flex: 1 1 auto;
        }
        a:visited,
        a {
          display: block;
          color: var(--map-menu-item-a-color);
          text-decoration: var(--map-menu-header-a-text-decoration, none);
        }
        a:hover,
        a:active,
        a:focus {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color)
          );
          text-decoration: var(
            --map-menu-header-a-text-decoration-hover,
            underline
          );
        }
        lrndesign-avatar {
          display: inline-block;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
          padding: 2px;
          position: relative;
          margin-top: -2px;
          transform: translateY(2px);
        }

        #link {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
        }

        .title {
          font-size: var(--map-menu-font-size);
        }

        #right iron-icon {
          display: inline-block;
          color: gray;
        }

        iron-icon {
          display: inline-block;
          --iron-icon-height: var(--map-menu-item-height);
          --iron-icon-width: var(--map-menu-item-height);
        }

        paper-button {
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0px;
        }
      `
    ];
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <div id="container">
        ${this.avatarLabel
          ? html`
              <div class="avatarlabel">
                <lrndesign-avatar
                  label="${this.avatarLabel}"
                ></lrndesign-avatar>
              </div>
            `
          : ``}
        ${this.icon
          ? html`
              <iron-icon icon="${this.icon}"></iron-icon>
            `
          : ``}

        <div id="center">
          <a tabindex="-1" href="${this.url}">
            <paper-button class="title" noink>
              <div id="label">${this.label}</div>
              <div class="title">${this.title}</div>
            </paper-button>
          </a>
        </div>
        <div id="right">
          <iron-icon
            id="toggle"
            icon="${this.__collapseIcon}"
            aria-role="button"
            aria-label="${this.__collapseAria}"
            tabindex="0"
          ></iron-icon>
        </div>
      </div>
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
    this.avatarLabel = "";
    this.url = "";
    this.opened = false;
    this.active = false;
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
      if (propName == "opened") {
        this._openedChanged(this[propName], oldValue);
      }
      if (["id", "selected"].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      // only import avatar if we absolutely need it since its heavy
      if (propName == "avatarLabel" && this[propName] != "") {
        import("@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js");
      }
    });
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    return {
      title: {
        type: String
      },
      label: {
        type: String
      },
      avatarLabel: {
        type: String,
        attribute: "avatar-label"
      },
      opened: {
        type: Boolean
      },
      url: {
        type: String
      },
      id: {
        type: String,
        reflect: true
      },
      icon: {
        type: String
      },
      active: {
        type: Boolean,
        reflect: true
      },
      selected: {
        type: String,
        reflect: true
      },
      __collapseIcon: {
        type: String
      },
      __collapseAria: {
        type: String
      }
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
      this.dispatchEvent(
        new CustomEvent("active-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
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
    var target = null;
      if (e.path && e.path[0]) {
        target = e.path[0];
      }
      else if (e.originalTarget) {
        target = e.originalTarget;
      }
      else {
        target = e.target;
      }
    if (e.originalTarget && e.originalTarget.id === "toggle") {
      this.dispatchEvent(
        new CustomEvent("toggle-header", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true
        })
      );
    } else if (target && target.id === "toggle") {
      this.dispatchEvent(
        new CustomEvent("toggle-header", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true
        })
      );
    }
  }
}
window.customElements.define(MapMenuHeader.tag, MapMenuHeader);
export { MapMenuHeader };
