import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
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
          font-size: var(--map-menu-item-font-size);
          --map-menu-item-height: 42px;
          --map-menu-item-icon-height: 24px;
          overflow: var(--map-menu-item-overflow, hidden);
        }
        :host([active]) {
          background: var(--map-menu-active-color);
          color: var(--map-menu-item-active-item-color, #000000);
        }
        simple-icon-lite {
          display: inline-block;
          --simple-icon-height: var(--map-menu-item-icon-height);
          --simple-icon-width: var(--map-menu-item-icon-height);
        }
        .title {
          text-transform: none;
        }
        a,
        a:visited {
          display: block;
          color: var(--map-menu-item-a-color, inherit);
          text-decoration: var(--map-menu-item-a-text-decoration, none);
        }
        a:hover button,
        a:active button,
        a:focus button {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color, inherit)
          );
          text-decoration: var(
            --map-menu-item-a-text-decoration-hover,
            underline
          );
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
        button {
          cursor: pointer;
          color: inherit;
          background-color: transparent;
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0px;
          border: 0;
          height: var(
            --map-menu-item-button-height,
            var(--map-menu-item-height)
          );
          padding: 4px;
          text-align: left;
          border-radius: 0;
        }
      `,
    ];
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <a tabindex="-1" href="${this.url}">
        <button id="wrapper" role="link" noink>
          ${this.__icon
            ? html`
                <simple-icon-lite icon="${this.__icon}"></simple-icon-lite>
              `
            : ``}
          <span class="title">${this.title}</span>
          ${this.trackIcon
            ? html`
                <simple-icon-lite
                  id="track"
                  icon="${this.trackIcon}"
                ></simple-icon-lite>
              `
            : ``}
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
    this.__icon = null;
    this.trackIcon = null;
    this.title = "";
    this.url = "";
    this.active = false;
    this.published = true;
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    return {
      icon: {
        type: String,
        reflect: true,
      },
      __icon: {
        type: String,
      },
      trackIcon: {
        type: String,
        attribute: "track-icon",
      },
      title: {
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
      },
      selected: {
        type: String,
      },
      published: {
        type: Boolean,
      },
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
      if (propName == "icon") {
        this.__icon = this[propName];
      }
      if (["id", "selected"].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      if (propName == "published" && this[propName]) {
        if (this.published === false) {
          this.__icon = "visibility-off";
        }
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
          detail: this,
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
        detail: { id: this.id },
      })
    );
  }
}
window.customElements.define(MapMenuItem.tag, MapMenuItem);
export { MapMenuItem };
