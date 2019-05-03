import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@lrnwebcomponents/map-menu/lib/map-menu-item.js";
import "@lrnwebcomponents/map-menu/lib/map-menu-header.js";
class MapMenuSubmenu extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-collapse/iron-collapse.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([collapsable]) > map-menu-header {
          cursor: pointer;
          display: block;
        }

        #container {
          margin-left: 16px;
        }

        #container ::slotted(map-menu-item) {
          margin-top: 0.4em;
        }
      </style>
      <map-menu-header
        avatar-label="[[avatarLabel]]"
        id="[[id]]"
        title="[[title]]"
        label="[[label]]"
        opened="[[opened]]"
        url="[[url]]"
        icon="[[icon]]"
        selected="[[selected]]"
      ></map-menu-header>
      <iron-collapse id="container"> <slot></slot> </iron-collapse>
    `;
  }

  static get tag() {
    return "map-menu-submenu";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      //this.addEventListener("child-deactivated", this.__childDeactivated.bind(this));
      // this.addEventListener("child-activated", this.__childActivated.bind(this));
      this.addEventListener("active-item", this.__activeChanged.bind(this));
      this.addEventListener("toggle-header", this.__toggleHeader.bind(this));
      this.addEventListener(
        "link-clicked",
        this._headerClickHandler.bind(this)
      );
      //this.addEventListener("map-menu-active-item-changed", this._mapMenuActiveItemChangedHandler.bind(this));
      this.addEventListener(
        "map-menu-item-hidden-check",
        this._mapMenuItemHiddenCheckHandler.bind(this)
      );
    });
  }
  disconnectedCallback() {
    //this.removeEventListener("child-deactivated", this.__childDeactivated.bind(this));
    //this.removeEventListener("child-activated", this.__childActivated.bind(this));
    this.removeEventListener("active-item", this.__activeChanged.bind(this));
    this.removeEventListener("toggle-header", this.__toggleHeader.bind(this));
    this.removeEventListener(
      "link-clicked",
      this._headerClickHandler.bind(this)
    );
    //this.removeEventListener("map-menu-active-item-changed", this._mapMenuActiveItemChangedHandler.bind(this));
    this.removeEventListener(
      "map-menu-item-hidden-check",
      this._mapMenuItemHiddenCheckHandler.bind(this)
    );
    super.disconnectedCallback();
  }
  static get properties() {
    return {
      id: {
        type: String
      },
      title: {
        type: String
      },
      avatarLabel: {
        type: String
      },
      label: {
        type: String
      },
      icon: {
        type: String
      },
      opened: {
        type: Boolean,
        value: false
      },
      collapsable: {
        type: Boolean,
        value: true
      },
      expandChildren: {
        type: Boolean,
        value: false
      },
      selected: {
        type: String
      }
    };
  }

  static get observers() {
    return ["_openChanged(opened)"];
  }
  _openChanged(opened) {
    var target = this.shadowRoot.querySelector("#container");
    if (opened) target.show();
    if (!opened) target.hide();
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
        detail: detail
      })
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
        detail: { opened: this.opened }
      })
    );
  }
  __activeChanged(e) {
    this.opened = true;
  }
}
window.customElements.define(MapMenuSubmenu.tag, MapMenuSubmenu);
export { MapMenuSubmenu };
