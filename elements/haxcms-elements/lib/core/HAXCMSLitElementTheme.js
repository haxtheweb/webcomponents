/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, LitElement, render, unsafeCSS } from "lit";
import { HAXCMSTheme } from "./HAXCMSThemeWiring.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
/**
 * LitElement Version of HAXCMSTheme
 */
class HAXCMSLitElementTheme extends HAXCMSTheme(
  ResponsiveUtilityBehaviors(LitElement)
) {
  constructor() {
    super();
    this.editMode = false;
    this.isLoggedIn = false;
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    // when this changes, query our light dom children and apply a click hanlder to copy a link to the item
    autorun((reaction) => {
      let tmp = toJS(store.activeItemContent);
      // delay bc this shouldn't block page load in any way
      setTimeout(() => {
        // headings only
        let kidHeadings = this.querySelectorAll("h1,h2,h3,h4,h5,h6");
        if (kidHeadings.length > 0) {
          kidHeadings.forEach((node) => {
            node.addEventListener("click", this.copyLink.bind(this));
            node.addEventListener(
              "pointerenter",
              this.hoverIntentEnter.bind(this)
            );
            node.addEventListener(
              "pointerout",
              this.hoverIntentLeave.bind(this)
            );
          });
        }
      }, 100);
      this.__disposer.push(reaction);
    });
  }
  hoverIntentEnter(e) {
    this.__styleTag = document.createElement("style");
    let iconPath = SimpleIconsetStore.getIcon("icons:link");
    this.__styleTag.innerHTML = `
    #${e.target.getAttribute(
      "id"
    )} { cursor: copy; text-decoration: dotted underline}
    #${e.target.getAttribute("id")} {
      background-image: url("${iconPath}");
      background-position: right;
      background-repeat: no-repeat;
      background-size: 36px;
    }`;
    e.target.appendChild(this.__styleTag);
  }
  hoverIntentLeave(e) {
    this.__styleTag.remove();
  }
  HAXCMSGlobalStyleSheetContent() {
    let styles = ["red", "blue", "green", "orange", "purple"].map(
      (item) =>
        css`
          .haxcms-theme-element [data-style-decoration~="highlight"] {
            color: var(--haxcms-style-element-color, white);
            background-color: var(
              --haxcms-style-element-background-color,
              black
            );
            font-weight: 400;
            word-wrap: break-word;
            padding: 4px 8px;
            text-transform: uppercase;
            text-decoration: none;
          }
          .haxcms-theme-element [data-style-decoration~="${unsafeCSS(item)}"] {
            --haxcms-style-element-background-color: var(
              --simple-colors-default-theme-${unsafeCSS(item)}-7,
              ${unsafeCSS(item)}
            );
          }
        `
    );
    return styles;
  }
  copyLink(e) {
    let target = e.target;
    if (!target) {
      target = e.path[0];
    }
    let el = document.createElement("textarea");
    el.value =
      window.location.origin +
      window.location.pathname +
      "#" +
      target.getAttribute("id");
    // alter URL state
    window.history.pushState({}, null, el.value);
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    window.dispatchEvent(
      new CustomEvent("simple-toast-show", {
        cancelable: true,
        detail: {
          text: `Link copied to clipboard`,
          duration: 3000,
        },
      })
    );
  }
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      /**
       * Class for the color
       */
      hexColor: {
        type: String,
        attribute: "hex-color",
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String,
        reflect: true,
      },
      /**
       * editting state for the page
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * editting state for the page
       */
      isLoggedIn: {
        type: Boolean,
        reflect: true,
        attribute: "is-logged-in",
      },
      /**
       * DOM node that wraps the slot
       */
      contentContainer: {
        type: Object,
      },
      /**
       * location as object
       */
      _location: {
        type: Object,
      },
    };
  }
  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host([edit-mode]) {
          opacity: 1;
          --hax-base-styles-p-min-height: 38px;
        }
        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
        /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
        :host([edit-mode]) #slot {
          display: none;
        }
        #slot {
          min-height: 50vh;
        }
      `,
    ];
  }
  // LitElement life cycle
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.contentContainer == null) {
      this.contentContainer = this.shadowRoot.querySelector(
        "#contentcontainer"
      );
    }
    // update the global managed CSS styles so we can "theme" the content
    // witout leaning on ::slotted which doesn't work always
    render(this.HAXCMSGlobalStyleSheetContent(), store.themeStyleElement);
  }
  // LitElement life cycle
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "_location") {
        this._locationChanged(this[propName], oldValue);
      }
      if (propName == "color") {
        this._colorChanged(this[propName], oldValue);
      }
      if (propName == "contentContainer") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("content-container-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          })
        );
        this._contentContainerChanged(this[propName], oldValue);
      }
      if (propName == "isLoggedIn") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("is-logged-in-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          })
        );
      }
      if (propName == "editMode") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("edit-mode-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          })
        );
        this._editModeChanged(this[propName], oldValue);
      }
    });
  }
}

export { HAXCMSLitElementTheme };
