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
          color: var(--site-menu-button-link-color, black);
          text-decoration: var(--site-menu-button-link-decoration, underline);
        }
        paper-button {
          transition: 0.3s all ease-in-out;
          min-width: unset;
        }
        paper-button:hover,
        paper-button:focus,
        paper-button:active {
          color: var(--site-menu-button-button-hover-color, inherit);
          background-color: var(
            --site-menu-button-button-hover-background-color,
            inherit
          );
        }
        iron-icon {
          display: block;
          font-size: 16px;
          --iron-icon-width: var(--site-menu-button-icon-width, 32px);
          --iron-icon-height: var(--site-menu-button-icon-height, 32px);
          --iron-icon-fill-color: var(
            --site-menu-button-icon-fill-color,
            black
          );
        }
        simple-tooltip {
          --simple-tooltip-background: var(
            --site-menu-button-tooltip-bg,
            #000000
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: var(
            --site-menu-button-tooltip-text,
            #ffffff
          );
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
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
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    import("@polymer/paper-button/paper-button.js");
  }
  // render function
  render() {
    return html`
      <custom-style>
        <style>
          paper-button {
            @apply --site-menu-button-button;
          }
        </style>
      </custom-style>
      <a tabindex="-1" ?disabled="${this.disabled}" .aria-label="${this.label}">
        <paper-button
          id="menulink"
          noink
          ?disabled="${this.disabled}"
          ?raised="${this.raised}"
          aria-label="${this.label}"
        >
          <slot name="prefix"></slot>
          <iron-icon icon="${this.icon}"></iron-icon>
          <slot name="suffix"></slot>
        </paper-button>
      </a>
      <simple-tooltip for="menulink" offset="8" .position="${this.position}">
        ${this.label}
      </simple-tooltip>
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
        reflect: true,
        attribute: "disabled"
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
      if (propName == "link") {
        this._linkChanged(this[propName]);
      }
      if (
        ["type", "activeRouterManifestIndex", "routerManifest"].includes(
          propName
        ) &&
        this.routerManifest
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
          "editMode",
          "link"
        ].includes(propName) &&
        this.routerManifest
      ) {
        this.disabled = this.pageLinkStatus(
          this.type,
          this.activeRouterManifestIndex,
          this.routerManifest.items,
          this.editMode,
          this.link
        );
      }
    });
  }
  _linkChanged(newValue) {
    if (newValue == null) {
      this.shadowRoot.querySelector("a").removeAttribute("href");
    } else {
      this.shadowRoot.querySelector("a").setAttribute("href", newValue);
    }
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
        return items[activeRouterManifestIndex - 1].slug;
      }
      return null;
    } else if (type === "next" && items) {
      if (
        activeRouterManifestIndex < items.length - 1 &&
        items[activeRouterManifestIndex + 1]
      ) {
        return items[activeRouterManifestIndex + 1].slug;
      }
      return null;
    }
    // @todo add support for up and down as far as children and parent relationships
    else {
      return null;
    }
  }
  /**
   * true is disabled
   */
  pageLinkStatus(type, activeRouterManifestIndex, items, editMode, link) {
    if (editMode || link == null) {
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
