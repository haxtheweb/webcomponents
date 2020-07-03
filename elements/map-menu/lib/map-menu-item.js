import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
class MapMenuItem extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          transition: 0.1s all ease-in-out;
          font-size: var(--map-menu-item-font-size, 14px);
          --map-menu-item-height: 24px;
          --map-menu-item-a-color: inherit;
        }
        :host([active]) {
          background: var(--map-menu-active-color);
          color: var(--map-menu-item-active-item-color, #000000);
        }
        paper-button {
          width: 100%;
          justify-content: left;
          margin: 0;
        }
        iron-icon {
          display: inline-block;
          --iron-icon-height: var(--map-menu-item-height);
          --iron-icon-width: var(--map-menu-item-height);
        }
        .title {
          text-transform: none;
        }
        a:visited,
        a {
          display: block;
          color: var(--map-menu-item-a-color);
          text-decoration: var(--map-menu-item-a-text-decoration, none);
        }
        a:hover,
        a:active,
        a:focus {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color)
          );
          text-decoration: var(--map-menu-item-a-text-decoration-hover, underline);
        }
        #track {
          transition: 0.1s all ease-in-out;
          position: absolute;
          right: 0;

          margin-right: 0px;
          width: 0px;
          height: 0px;
          visibility: hidden;
          opacity: 0;
        }
        #track.show-icon {
          margin-right: 5px;
          width: 18px;
          height: 18px;
          visibility: visible;
          opacity: 1;
        }
        #wrapper {
          font-size: var(--map-menu-font-size, 16px);
        }
      `
    ];
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <a tabindex="-1" href="${this.url}">
        <paper-button id="wrapper" role="link" noink>
          ${this.icon
            ? html`
                <iron-icon icon="${this.icon}"></iron-icon>
              `
            : ``}
          <span class="title">${this.title}</span>
          ${this.trackIcon
            ? html`
                <iron-icon id="track" icon="${this.trackIcon}"></iron-icon>
              `
            : ``}
        </paper-button>
      </a>
    `;
  }
  static get tag() {
    return "map-menu-item";
  }
  constructor() {
    super();
    this.icon = "";
    this.trackIcon = "";
    this.title = "";
    this.url = "";
    this.active = false;
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    return {
      icon: {
        type: String
      },
      trackIcon: {
        type: String,
        attribute: "track-icon"
      },
      title: {
        type: String
      },
      url: {
        type: String
      },
      icon: {
        type: String
      },
      id: {
        type: String,
        reflect: true
      },
      active: {
        type: Boolean
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
      if (propName == "trackIcon") {
        this._trackIconChanged(this[propName], oldValue);
      }
      if (["id", "selected"].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
    });
  }
  _trackIconChanged(newValue, oldValue) {
    if (this.shadowRoot.querySelector("#track")) {
      if (newValue) {
        this.shadowRoot.querySelector("#track").classList.add("show-icon");
      } else {
        this.shadowRoot.querySelector("#track").classList.remove("show-icon");
      }
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

  _click() {
    this.dispatchEvent(
      new CustomEvent("link-clicked", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { id: this.id }
      })
    );
  }
}
window.customElements.define(MapMenuItem.tag, MapMenuItem);
export { MapMenuItem };
