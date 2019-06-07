/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import "@polymer/paper-button/paper-button.js";
/**
 * `site-menu-button`
 * `Menu button based on the hierarchy`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteMenuButton extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-menu-button";
  }
  constructor() {
    super();
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size: 16px;
          transition: 0.3s all ease-in-out;
        }
        :host([disabled]) {
          pointer-event: none;
          opacity: 0.3;
        }
        a {
          color: black;
          text-decoration: underline;
          @apply --site-menu-button-link;
        }
        paper-button {
          transition: 0.3s all ease-in-out;
          min-width: unset;
          @apply --site-menu-button-button;
        }
        paper-button:hover,
        paper-button:focus,
        paper-button:active {
          @apply --site-menu-button-button-hover;
        }
        iron-icon {
          display: block;
          font-size: 16px;
          @apply --site-menu-button-icon;
        }
        paper-tooltip {
          --paper-tooltip-background: var(
            --site-menu-button-tooltip-bg,
            #000000
          );
          --paper-tooltip-opacity: 1;
          --paper-tooltip-text-color: var(
            --site-menu-button-tooltip-text,
            #ffffff
          );
          --paper-tooltip-delay-in: 0;
          --paper-tooltip: {
            border-radius: 0;
          }
        }
      </style>
      <a tabindex="-1" href$="[[link]]" disabled$="[[disabled]]">
        <paper-button
          id="menulink"
          noink
          disabled="[[disabled]]"
          raised="[[raised]]"
        >
          <slot name="prefix"></slot>
          <iron-icon icon="[[icon]]"></iron-icon>
          <slot name="suffix"></slot>
        </paper-button>
      </a>
      <paper-tooltip for="menulink" offset="8" position="[[position]]">
        [[label]]
      </paper-tooltip>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      type: {
        type: String,
        observer: "_typeChanged",
        reflectToAttribute: true
      },
      /**
       * acitvely selected item
       */
      activeManifestIndex: {
        type: String
      },
      routerManifest: {
        type: Object
      },
      link: {
        type: String,
        computed: "pageLink(type, activeManifestIndex, routerManifest.items)"
      },
      editMode: {
        type: Boolean
      },
      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        computed:
          "pageLinkStatus(type, activeManifestIndex, routerManifest.items, editMode)"
      },
      label: {
        type: String
      },
      icon: {
        type: String
      },
      position: {
        type: String
      },
      raised: {
        type: Boolean
      }
    };
  }
  _typeChanged(newValue) {
    if (newValue === "prev") {
      if (!this.label) {
        this.label = "Previous page";
      }
      if (!this.icon) {
        this.icon = "icons:chevron-left";
      }
      if (!this.position) {
        this.position = "right";
      }
    } else if (newValue === "next") {
      if (!this.label) {
        this.label = "Next page";
      }
      if (!this.icon) {
        this.icon = "icons:chevron-right";
      }
      if (!this.position) {
        this.position = "left";
      }
    }
    // @todo add support for up and down as far as children and parent relationships
    else {
      this.label = "";
      this.icon = "";
      this.direction = "";
    }
  }
  pageLink(type, activeManifestIndex, items) {
    if (type === "prev" && items) {
      if (activeManifestIndex > 0 && items[activeManifestIndex - 1]) {
        return items[activeManifestIndex - 1].location;
      }
      return null;
    } else if (type === "next" && items) {
      if (
        activeManifestIndex < items.length - 1 &&
        items[activeManifestIndex + 1]
      ) {
        return items[activeManifestIndex + 1].location;
      }
      return null;
    }
    // @todo add support for up and down as far as children and parent relationships
    else {
      return null;
    }
  }
  pageLinkStatus(type, activeManifestIndex, items, editMode) {
    if (editMode) {
      return true;
    }
    if (type === "prev") {
      if (activeManifestIndex === 0 || activeManifestIndex === -1) {
        return true;
      }
    } else if (type === "next" && items) {
      if (activeManifestIndex >= items.length - 1) {
        return true;
      }
    }
    return false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.routerManifest = toJS(store.routerManifest);
    });
    this.__disposer2 = autorun(() => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
    });
    this.__disposer3 = autorun(() => {
      this.editMode = toJS(store.editMode);
    });
  }
  disconnectedCallback() {
    this.__disposer();
    this.__disposer2();
    this.__disposer3();
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteMenuButton.tag, SiteMenuButton);
export { SiteMenuButton };
