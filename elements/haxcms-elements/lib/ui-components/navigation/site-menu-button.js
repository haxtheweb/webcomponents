/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
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
            outline 0.3s ease-in-out;
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
          transition: 0.3s color ease;
          --simple-icon-width: var(--site-menu-button-icon-width, 32px);
          --simple-icon-height: var(--site-menu-button-icon-height, 32px);
          color: var(--site-menu-button-icon-fill-color, light-dark(
            black,
            var(--ddd-theme-default-linkLight)
          ));
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
      noPreviousPage: "No previous page",
      noNextPage: "No next page",
    };
    this.hideLabel = false;
    this.__slottedText = "";
    this.__disposer = this.__disposer ? this.__disposer : [];
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.activeRouterManifestIndex);
        Promise.resolve().then(() => {
          this.activeRouterManifestIndex = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.routerManifest);
        Promise.resolve().then(() => {
          this.routerManifest = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.editMode);
        Promise.resolve().then(() => {
          this.editMode = _mobx_val_0;
        });
      }),
    );
    import("@haxtheweb/simple-tooltip/simple-tooltip.js");
  }
  // compute a label that always has an accessible name; when the store has
  // no data this.label is undefined, so fall back to a type-based string so
  // axe button-name / aria-tooltip-name rules are satisfied without changing
  // behavior in the normal case where a label IS present
  get __accessibleLabel() {
    // when the theme slots visible text into prefix/suffix, the accessible
    // name must come from that content; an explicit aria-label here would
    // have to duplicate the slotted text or risk a label-content-name-mismatch
    // (the visible text is not required to be part of the label), so omit it
    // and let the content name the element. Return undefined so ifDefined in
    // render() removes the attribute entirely (an empty aria-label would
    // wrongly override the content name).
    if (this.__slottedText) {
      return undefined;
    }
    if (this.label) {
      return this.label;
    }
    return this.type === "next" ? this.t.noNextPage : this.t.noPreviousPage;
  }
  // recompute the text slotted into prefix/suffix; slotchange only fires when
  // the assigned node list changes, so a MutationObserver also watches for
  // text mutated in place inside already-assigned nodes (e.g. a theme updating
  // its slotted page-title binding)
  __syncSlottedText() {
    let text = "";
    if (this.renderRoot) {
      this.renderRoot.querySelectorAll("slot").forEach((slot) => {
        slot.assignedNodes({ flatten: true }).forEach((node) => {
          if (node.textContent) {
            text += " " + node.textContent;
          }
        });
      });
    }
    this.__slottedText = text.replace(/\s+/g, " ").trim();
  }
  connectedCallback() {
    super.connectedCallback();
    this.__slotObserver = new MutationObserver(
      this.__syncSlottedText.bind(this),
    );
    this.__slotObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  // render function
  render() {
    return html`
      <a
        tabindex="-1"
        ?disabled="${this.disabled}"
        aria-disabled="${this.disabled}"
        aria-label="${ifDefined(this.__accessibleLabel)}"
        .part="${this.editMode ? `edit-mode-active link` : `link`}"
      >
        <button
          id="menulink"
          noink
          ?disabled="${this.disabled}"
          ?raised="${this.raised}"
          aria-label="${ifDefined(this.__accessibleLabel)}"
          .part="${this.editMode ? `edit-mode-active button` : `button`}"
        >
          <slot
            name="prefix"
            @slotchange="${this.__syncSlottedText}"
          ></slot>
          <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
          <slot
            name="suffix"
            @slotchange="${this.__syncSlottedText}"
          ></slot>
        </button>
      </a>
      ${!this.hideLabel && this.label
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
      /**
       * text currently slotted into prefix/suffix, tracked so the accessible
       * name can defer to the visible content (see __accessibleLabel)
       */
      __slottedText: {
        state: true,
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
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Derive reactive state in willUpdate so it batches into the current
    // update cycle. Setting these in updated() triggered Lit's
    // change-in-update warning because it scheduled a new update after the
    // previous one completed.
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
    // icon/position/direction derive from type
    if (changedProperties.has("type")) {
      if (this.type === "prev") {
        if (!this.icon) {
          this.icon = "icons:chevron-left";
        }
        if (!this.position) {
          this.position = "right";
        }
      } else if (this.type === "next") {
        if (!this.icon) {
          this.icon = "icons:chevron-right";
        }
        if (!this.position) {
          this.position = "left";
        }
      } else {
        this.icon = "";
        this.direction = "";
      }
    }
    // link/label derive from type/activeRouterManifestIndex/routerManifest
    if (
      (changedProperties.has("type") ||
        changedProperties.has("activeRouterManifestIndex") ||
        changedProperties.has("routerManifest")) &&
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
    // disabled derives from type/activeRouterManifestIndex/routerManifest/editMode/link
    if (
      (changedProperties.has("type") ||
        changedProperties.has("activeRouterManifestIndex") ||
        changedProperties.has("routerManifest") ||
        changedProperties.has("editMode") ||
        changedProperties.has("link")) &&
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
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // type changed -> re-broadcast the super-daemon option (icon/position
      // are derived in willUpdate above)
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
    // icon/position/direction are derived in willUpdate; this only
    // re-broadcasts the super-daemon navigation option for the new type.
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
    if (this.__slotObserver) {
      this.__slotObserver.disconnect();
      this.__slotObserver = null;
    }
    for (var i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }
}
globalThis.customElements.define(SiteMenuButton.tag, SiteMenuButton);
export { SiteMenuButton };
