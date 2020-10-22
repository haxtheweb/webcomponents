/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, LitElement } from "lit-element/lit-element.js";
import { HAXCMSTheme } from "./HAXCMSThemeWiring.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
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
  }
  static get properties() {
    return {
      ...super.properties,
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
