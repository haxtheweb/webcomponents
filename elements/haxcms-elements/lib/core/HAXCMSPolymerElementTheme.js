/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "./HAXCMSThemeWiring.js";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
setPassiveTouchGestures(true);
/**
 * PolymerElement Version of HAXCMSTheme
 */
class HAXCMSPolymerElementTheme extends HAXCMSTheme(PolymerElement) {
  static get properties() {
    return {
      ...super.properties,

      /**
       * Class for the color
       */
      hexColor: {
        type: String,
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String,
        reflectToAttribute: true,
        observer: "_colorChanged",
      },
      /**
       * editting state for the page
       */
      editMode: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false,
        observer: "_editModeChanged",
      },
      /**
       * editting state for the page
       */
      isLoggedIn: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false,
      },
      /**
       * DOM node that wraps the slot
       */
      contentContainer: {
        type: Object,
        notify: true,
        observer: "_contentContainerChanged",
      },
      /**
       * location as object
       */
      _location: {
        type: Object,
        observer: "_locationChanged",
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    // we don't have a content container, establish one
    if (typeof this.contentContainer === typeof undefined) {
      this.contentContainer =
        this.shadowRoot.querySelector("#contentcontainer");
    }
  }
}
export { HAXCMSPolymerElementTheme };
