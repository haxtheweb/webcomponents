/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, LitElement, render, unsafeCSS, html } from "lit";
import { HAXCMSTheme } from "./HAXCMSThemeWiring.js";
import { ResponsiveUtilityBehaviors } from "@haxtheweb/responsive-utility/lib/responsive-utility-behaviors.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
import { editableTableDisplayStyles } from "@haxtheweb/editable-table/lib/editable-table-behaviors.js";
import { copyToClipboard } from "@haxtheweb/utils/utils.js";

/**
 * LitElement Version of HAXCMSTheme
 */
class HAXCMSLitElementTheme extends HAXCMSTheme(
  ResponsiveUtilityBehaviors(LitElement),
) {
  constructor() {
    super();
    this.isSafari = globalThis.safari !== undefined;
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
      if (
        this.HAXCMSThemeSettings.autoScroll &&
        this.shadowRoot &&
        this.HAXCMSThemeSettings.scrollTarget &&
        this.HAXCMSThemeSettings.scrollTarget.scrollIntoView
      ) {
        if (this.isSafari) {
          this.HAXCMSThemeSettings.scrollTarget.scrollIntoView();
        } else {
          setTimeout(() => {
            this.HAXCMSThemeSettings.scrollTarget.scrollIntoView({
              behavior: "instant",
              block: "start",
              inline: "nearest",
            });
          }, 0);
        }
      }
      // delay bc this shouldn't block page load in any way
      setTimeout(() => {
        // headings only
        let kidHeadings = this.querySelectorAll("h1,h2,h3,h4,h5,h6");
        if (kidHeadings.length > 0) {
          kidHeadings.forEach((node) => {
            node.addEventListener("click", this.copyLink.bind(this));
            node.addEventListener(
              "pointerenter",
              this.hoverIntentEnter.bind(this),
            );
            node.addEventListener(
              "pointerleave",
              this.hoverIntentLeave.bind(this),
            );
          });
        }
      }, 100);
      this.__disposer.push(reaction);
    });
  }

  hoverIntentEnter(e) {
    e.target.classList.add("haxcms-copyable");
  }
  hoverIntentLeave(e) {
    e.target.classList.remove("haxcms-copyable");
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      css`
        .haxcms-copyable {
          background-image: url("${unsafeCSS(
            SimpleIconsetStore.getIcon("icons:link"),
          )}");
          background-position: right;
          background-repeat: no-repeat;
          background-size: 36px;
        }
      `,
      editableTableDisplayStyles,
    ];
  }
  copyLink(e) {
    let target = e.target;
    if (!target) {
      target = e.path[0];
    }
    if (!target.id && target.parentNode && target.parentNode.id) {
      target = target.parentNode;
    }
    if (this.isSafari) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }
    // alter URL state
    let headingLink =
      globalThis.location.origin +
      globalThis.location.pathname +
      "#" +
      target.getAttribute("id");
    globalThis.history.pushState({}, null, headingLink);
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
    copyToClipboard(headingLink, "Anchor link copied!");
  }
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      // safari is terrible, fml
      isSafari: {
        type: Boolean,
        reflect: true,
        attribute: "is-safari",
      },
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
      styles,
      css`
        :host([edit-mode]) {
          opacity: 1;
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
      this.contentContainer =
        this.shadowRoot.querySelector("#contentcontainer");
    }
    // update the global managed CSS styles so we can "theme" the content
    // witout leaning on ::slotted which doesn't work always
    render(this.HAXCMSGlobalStyleSheetContent(), store.themeStyleElement);
    // delay bc this shouldn't block page load in any way
    setTimeout(() => {
      setTimeout(() => {
        if (this._location && this._location.hash) {
          let target = this.querySelector(this._location.hash);
          if (target) {
            if (this.isSafari) {
              target.scrollIntoView();
            } else {
              target.scrollIntoView({
                behavior: "instant",
                block: "start",
                inline: "nearest",
              });
            }
          }
        }
      }, 0);
      // headings only
      let kidHeadings = this.querySelectorAll("h1,h2,h3,h4,h5,h6");
      if (kidHeadings.length > 0) {
        kidHeadings.forEach((node) => {
          node.addEventListener("click", this.copyLink.bind(this));
          node.addEventListener(
            "pointerenter",
            this.hoverIntentEnter.bind(this),
          );
          node.addEventListener(
            "pointerleave",
            this.hoverIntentLeave.bind(this),
          );
        });
      }
    }, 1500);
  }
  // LitElement life cycle
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "_location") {
        this._locationChanged(this[propName], oldValue);
        setTimeout(() => {
          if (this._location && this._location.hash) {
            let target = this.querySelector(this._location.hash);
            if (target) {
              if (this.isSafari) {
                target.scrollIntoView();
              } else {
                target.scrollIntoView({
                  behavior: "instant",
                  block: "start",
                  inline: "nearest",
                });
              }
            }
          }
        }, 0);
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
          }),
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
          }),
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
          }),
        );
        this._editModeChanged(this[propName], oldValue);
      }
    });
  }
}

export { HAXCMSLitElementTheme, css, unsafeCSS, html, store, autorun, toJS };
