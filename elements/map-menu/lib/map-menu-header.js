import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-behaviors/iron-button-state.js";
import "@polymer/paper-button/paper-button.js";
class MapMenuHeader extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          transition: 0.2s all ease-in-out;
          transition-delay: 0.2s;
          --map-menu-item-height: 16px;
        }

        :host([active]) {
          background: var(--map-menu-active-color);
          @apply --map-menu-item-active-item;
        }

        #container {
          display: flex;
          align-items: center;
        }

        #avatarLabel {
          margin-right: 10px;
        }

        #center {
          flex: 1 1 auto;
        }

        a,
        a:hover,
        a:visited,
        a:focus {
          color: var(--map-menu-header-a-color, inherit);
          text-decoration: var(--map-menu-header-a-text-decoration, inherit);
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

        #title {
          font-size: var(--map-menu-font-size, 16px);
        }

        #right iron-icon {
          display: inline-block;
          color: gray;
        }

        /* @todo this is a hack */
        #icon iron-icon {
          display: inline-block;
          --iron-icon-height: var(--map-menu-item-height);
          transform: translateX(10px);
        }

        paper-button {
          text-transform: none;
        }
      </style>
      <div id="container">
        <div hidden$="[[!avatarLabel]]" id="avatarLabel">
          <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>
        </div>
        <div hidden$="[[!icon]]" id="icon">
          <iron-icon icon="[[icon]]"></iron-icon>
        </div>
        <div id="center">
          <a tabindex="-1" href$="[[url]]">
            <paper-button id="title" noink="" role\$="[[__titleRole()]]">
              <div id="label">[[label]]</div>
              <div id="title">[[title]]</div>
            </paper-button>
          </a>
        </div>
        <div id="right">
          <iron-icon
            id="toggle"
            icon="[[__collapseIcon]]"
            aria-role="button"
            aria-label$="[[__collapseAria]]"
            tabindex="0"
          ></iron-icon>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "map-menu-header";
  }

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
        value: ""
      },
      opened: {
        type: Boolean,
        observer: "_openedChanged"
      },
      url: {
        type: String,
        value: ""
      },
      id: {
        type: String,
        reflectToAttribute: true
      },
      icon: {
        type: String
      },
      active: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      selected: {
        type: String,
        reflectToAttribute: true
      }
    };
  }
  static get observers() {
    return ["__selectedChanged(selected, id)"];
  }
  _openedChanged(newValue, oldValue) {
    if (newValue) {
      this.__collapseIcon = "arrow-drop-down";
      this.__collapseAria = "collapse menu";
    } else {
      this.__collapseIcon = "arrow-drop-up";
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
    afterNextRender(this, function() {
      this.addEventListener("click", this.__tap.bind(this));
      this.addEventListener("keypress", this.__keypress.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.__tap.bind(this));
    this.removeEventListener("keypress", this.__keypress.bind(this));
    super.disconnectedCallback();
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
    let rootTarget = dom(e).rootTarget;
    if (typeof rootTarget !== "undefined") {
      if (typeof rootTarget.id !== "undefined" && rootTarget.id === "toggle") {
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
}
window.customElements.define(MapMenuHeader.tag, MapMenuHeader);
export { MapMenuHeader };
