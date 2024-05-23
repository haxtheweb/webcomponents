/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXCMSThemeParts } from "../../core/utils/HAXCMSThemeParts.js";
import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `site-menu-button`
 * `Menu button based on the hierarchy`
 *
 * @demo demo/index.html
 */
class SiteMenuButton extends HAXCMSI18NMixin(
  HAXCMSThemeParts(DDDPulseEffectSuper(LitElement)),
) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-size: 16px;
        }
        :host([disabled]) {
          pointer-events: none;
          opacity: 0.3;
        }
        a {
          display: block;
          height: 100%;
          width: 100%;
          color: var(--site-menu-button-link-color);
          text-decoration: var(--site-menu-button-link-decoration, underline);
        }
        button {
          display: flex;
          cursor: pointer;
          transition:
            color,
            outline 0.2s ease;
          outline: 2px transparent;
          min-width: unset;
          background-color: var(
            --site-menu-button-button-background-color,
            transparent
          );
          border: 0;
          border-radius: var(--site-menu-button-button-border-radius, 0);
          height: var(--site-menu-button-button-height, 100%);
          width: var(--site-menu-button-button-width, 100%);
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
        }
        button:hover,
        button:focus,
        button:active {
          outline: 2px solid var(--site-menu-button-button-hover-color, inherit);
          background-color: var(
            --site-menu-button-button-hover-background-color,
            inherit
          );
        }
        button:hover simple-icon-lite,
        button:focus simple-icon-lite,
        button:active simple-icon-lite {
          color: var(--site-menu-button-button-hover-color, inherit);
        }
        simple-icon-lite {
          display: block;
          font-size: 16px;
          transition: 0.2s color ease;
          --simple-icon-width: var(--site-menu-button-icon-width, 32px);
          --simple-icon-height: var(--site-menu-button-icon-height, 32px);
          color: light-dark(
            var(--site-menu-button-icon-fill-color, black),
            var(--ddd-theme-default-linkLight)
          );
        }
        simple-tooltip {
          --simple-tooltip-background: var(
            --haxcms-tooltip-background-color,
            #000000
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: var(--haxcms-tooltip-color, #ffffff);
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
      `,
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
    this.HAXCMSI18NMixinBase = "../../../";
    this.disabled = false;
    this.icon = "";
    this.position = "right";
    this.t = {
      noPreviousPage: "no previous page",
      noNextPage: "no next page",
    };
    this.hideLabel = false;
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.activeRouterManifestIndex = toJS(store.activeRouterManifestIndex);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.routerManifest = toJS(store.routerManifest);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    import("@haxtheweb/simple-tooltip/simple-tooltip.js");
  }
  // render function
  render() {
    return html`
      <a
        tabindex="-1"
        ?disabled="${this.disabled}"
        aria-disabled="${this.disabled}"
        aria-label="${this.label}"
        .part="${this.editMode ? `edit-mode-active link` : `link`}"
      >
        <button
          id="menulink"
          noink
          ?disabled="${this.disabled}"
          ?raised="${this.raised}"
          aria-label="${this.label}"
          .part="${this.editMode ? `edit-mode-active button` : `button`}"
        >
          <slot name="prefix"></slot>
          <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
          <slot name="suffix"></slot>
        </button>
      </a>
      ${!this.hideLabel
        ? html`
            <simple-tooltip
              for="menulink"
              offset="8"
              .position="${this.position}"
            >
              ${this.label}
            </simple-tooltip>
          `
        : ``}
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      ...super.properties,
      type: {
        type: String,
        reflect: true,
      },
      /**
       * acitvely selected item
       */
      activeRouterManifestIndex: {
        type: Number,
      },
      routerManifest: {
        type: Object,
      },
      link: {
        type: String,
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled",
      },
      label: {
        type: String,
      },
      hideLabel: {
        type: Boolean,
        attribute: "hide-label",
      },
      icon: {
        type: String,
      },
      position: {
        type: String,
      },
      raised: {
        type: Boolean,
      },
    };
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // if type or router changes and we are the next button, it means prev isn't shown
    // make us pulse
    if (
      changedProperties.has("type") ||
      changedProperties.has("activeRouterManifestIndex")
    ) {
      if (this.type === "next" && this.activeRouterManifestIndex === 0) {
        this.dataPulse = "1";
      } else {
        this.dataPulse = null;
      }
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "type") {
        this._typeChanged(this[propName], oldValue);
      }
      if (propName == "link") {
        this._linkChanged(this[propName]);
      }
      if (propName == "label") {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (
        ["type", "activeRouterManifestIndex", "routerManifest"].includes(
          propName,
        ) &&
        this.routerManifest
      ) {
        this.link = this.pageLink(
          this.type,
          this.activeRouterManifestIndex,
          this.routerManifest.items,
        );
        this.label = this.pageLinkLabel(
          this.type,
          this.activeRouterManifestIndex,
          this.routerManifest.items,
        );
      }
      if (
        [
          "type",
          "activeRouterManifestIndex",
          "routerManifest",
          "editMode",
          "link",
        ].includes(propName) &&
        this.routerManifest
      ) {
        this.disabled = this.pageLinkStatus(
          this.type,
          this.activeRouterManifestIndex,
          this.routerManifest.items,
          this.editMode,
          this.link,
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
    this.dispatchEvent(
      new CustomEvent("super-daemon-define-option", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          title: newValue + " page",
          icon: this.icon,
          tags: ["CMS", "page", "navigation"],
          value: {
            target: this,
            method: "clickLink",
          },
          context: "CMS",
          eventName: "super-daemon-element-method",
          path: "CMS/navigation/page/next",
        },
      }),
    );
  }
  clickLink(e) {
    this.shadowRoot.querySelector("a").click();
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
        return this.t.noPreviousPage;
      } else {
        return items[activeRouterManifestIndex - 1].title;
      }
    } else if (type === "next" && items) {
      if (
        activeRouterManifestIndex >= items.length - 1 ||
        !items[activeRouterManifestIndex + 1]
      ) {
        return this.t.noNextPage;
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
customElements.define(SiteMenuButton.tag, SiteMenuButton);
export { SiteMenuButton };
