import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
class MapMenuItem extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          transition: 0.2s all ease-in-out;
          transition-delay: 0.2s;
          font-size: var(--map-menu-item-font-size, 14px);
          --map-menu-item-height: var(--map-menu-item-height);
          --map-menu-item-a-color: inherit;
        }
        :host([active]) {
          background: var(--map-menu-active-color);
          @apply --map-menu-item-active-item;
        }
        paper-button {
          width: 100%;
          justify-content: left;
          margin: 0;
        }
        iron-icon {
          display: inline-block;
          --iron-icon-height: var(--map-menu-item-height);
        }
        .title {
          text-transform: none;
        }
        a {
          color: var(--map-menu-item-a-color);
          text-decoration: var(--map-menu-item-a-text-decoration);
        }
        a,
        a:hover,
        a:visited,
        a:focus {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color)
          );
          text-decoration: var(--map-menu-item-a-text-decoration);
        }
        #track {
          transition: 0.2s all ease-in-out;
          transition-delay: 0.5s;
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
      </style>
      <a tabindex="-1" href$="[[url]]">
        <paper-button id="wrapper" role="link" noink>
          <iron-icon hidden$="[[__hasIcon(icon)]]" icon="[[icon]]"></iron-icon>
          <span class="title">[[title]]</span>
          <iron-icon
            id="track"
            hidden$="[[__hasIcon(trackIcon)]]"
            icon="[[trackIcon]]"
          ></iron-icon>
        </paper-button>
      </a>
    `;
  }
  static get tag() {
    return "map-menu-item";
  }

  static get properties() {
    return {
      icon: {
        type: String,
        value: ""
      },
      trackIcon: {
        stype: String,
        value: "",
        observer: "_trackIconChanged"
      },
      title: {
        type: String,
        value: ""
      },
      url: {
        type: String,
        value: ""
      },
      icon: {
        type: String
      },
      id: {
        type: String,
        reflectToAttribute: true
      },
      active: {
        type: Boolean,
        value: false
      },
      selected: {
        type: String
      }
    };
  }

  static get observers() {
    return ["__selectedChanged(selected, id)"];
  }
  _trackIconChanged(newValue, oldValue) {
    if (newValue) {
      this.shadowRoot.querySelector("#track").classList.add("show-icon");
    } else {
      this.shadowRoot.querySelector("#track").classList.remove("show-icon");
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

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent("child-attached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { id: this.id }
      })
    );
  }

  __hasIcon(icon) {
    return icon || icon === "" ? true : false;
  }
}
window.customElements.define(MapMenuItem.tag, MapMenuItem);
export { MapMenuItem };
