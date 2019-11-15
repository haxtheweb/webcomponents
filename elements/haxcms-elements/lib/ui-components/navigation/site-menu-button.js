/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `site-menu-button`
 * `Menu button based on the hierarchy`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteMenuButton extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 16px;
          transition: 0.3s all ease-in-out;
        }
        :host([disabled]) {
          pointer-events: none;
          opacity: 0.3;
        }
        a {
          color: black;
          text-decoration: underline;
        }
        paper-button {
          transition: 0.3s all ease-in-out;
          min-width: unset;
        }
        iron-icon {
          display: block;
          font-size: 16px;
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-menu-button";
  }
  constructor() {
    super();
    this.__disposer = [];
    autorun(reaction => {
      this.activeRouterManifestIndex = toJS(store.activeRouterManifestIndex);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.routerManifest = toJS(store.routerManifest);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
    import("@polymer/paper-button/paper-button.js");
  }
  // render function
  render() {
    return html`
      <custom-style>
        <style>
          a {
            @apply --site-menu-button-link;
          }
          paper-button {
            @apply --site-menu-button-button;
          }
          paper-button:hover,
          paper-button:focus,
          paper-button:active {
            @apply --site-menu-button-button-hover;
          }
          iron-icon {
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
      </custom-style>
      <a
        tabindex="-1"
        .href="${this.link}"
        ?disabled="${this.disabled}"
        .title="${this.label}"
      >
        <paper-button
          id="menulink"
          noink
          ?disabled="${this.disabled}"
          ?raised="${this.raised}"
          title="${this.label}"
        >
          <slot name="prefix"></slot>
          <iron-icon icon="${this.icon}"></iron-icon>
          <slot name="suffix"></slot>
        </paper-button>
      </a>
      <paper-tooltip for="menulink" offset="8" .position="${this.position}">
        ${this.label}
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
        reflect: true
      },
      /**
       * acitvely selected item
       */
      activeRouterManifestIndex: {
        type: String
      },
      routerManifest: {
        type: Object
      },
      link: {
        type: String
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      },
      disabled: {
        type: Boolean,
        reflect: true
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
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "type") {
        this._typeChanged(this[propName], oldValue);
      }
      if (
        ["type", "activeRouterManifestIndex", "routerManifest"].includes(
          propName
        )
      ) {
        this.link = this.pageLink(
          this.type,
          this.activeRouterManifestIndex,
          this.routerManifest.items
        );
        this.label = this.pageLinkLabel(
          this.type,
          this.activeRouterManifestIndex,
          this.routerManifest.items
        );
      }
      if (
        [
          "type",
          "activeRouterManifestIndex",
          "routerManifest",
          "editMode"
        ].includes(propName)
      ) {
        this.disabled = this.pageLinkStatus(
          this.type,
          this.activeRouterManifestIndex,
          this.routerManifest.items,
          this.editMode
        );
      }
    });
  }
  _typeChanged(newValue) {
    if (newValue === "prev") {
      if (!this.icon) {
        this.icon = "icons:chevron-left";
      }
      if (!this.position) {
        this.position = "right";
      }
    } else if (newValue === "next") {
      if (!this.icon) {
        this.icon = "icons:chevron-right";
      }
      if (!this.position) {
        this.position = "left";
      }
    }
    // @todo add support for up and down as far as children and parent relationships
    else {
      this.icon = "";
      this.direction = "";
    }
  }
  pageLink(type, activeRouterManifestIndex, items) {
    if (type === "prev" && items) {
      if (
        activeRouterManifestIndex > 0 &&
        items[activeRouterManifestIndex - 1]
      ) {
        return items[activeRouterManifestIndex - 1].location;
      }
      return null;
    } else if (type === "next" && items) {
      if (
        activeRouterManifestIndex < items.length - 1 &&
        items[activeRouterManifestIndex + 1]
      ) {
        return items[activeRouterManifestIndex + 1].location;
      }
      return null;
    }
    // @todo add support for up and down as far as children and parent relationships
    else {
      return null;
    }
  }
  pageLinkStatus(type, activeRouterManifestIndex, items, editMode) {
    if (editMode) {
      return true;
    }
    if (type === "prev") {
      if (activeRouterManifestIndex === 0 || activeRouterManifestIndex === -1) {
        return true;
      }
    } else if (type === "next" && items) {
      if (activeRouterManifestIndex >= items.length - 1) {
        return true;
      }
    }
    return false;
  }
  pageLinkLabel(type, activeRouterManifestIndex, items) {
    if (type === "prev" && items) {
      if (
        activeRouterManifestIndex === 0 ||
        activeRouterManifestIndex === -1 ||
        !items[activeRouterManifestIndex - 1]
      ) {
        return "";
      } else {
        return items[activeRouterManifestIndex - 1].title;
      }
    } else if (type === "next" && items) {
      if (
        activeRouterManifestIndex >= items.length - 1 ||
        !items[activeRouterManifestIndex + 1]
      ) {
        return "";
      } else {
        return items[activeRouterManifestIndex + 1].title;
      }
    }
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteMenuButton.tag, SiteMenuButton);
export { SiteMenuButton };
