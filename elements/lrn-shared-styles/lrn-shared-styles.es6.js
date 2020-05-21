/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `lrn-shared-styles`
 * @element lrn-shared-styles
 * `a shared set of styles for @lrnwebcomponents`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @pseudoElement
 * @polymer
 * @demo demo/index.html
 * @see lib/lrn-shared-styles-demo.js
 */
import { html } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-module.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style include="iron-flex iron-flex-alignment">
    /**
     * Normalizes iron-icon and lrn-icon.
     */
    lrn-icon,
    iron-icon {
      --layout-inline: {
        display: inline-flex;
      }
    }
    /**
     * Visible to screenreaders only.
     */
    .sr-only {
      position: absolute;
      left: -9999999px;
      top: 0;
      height: 0;
      width: 0;
      overflow: hidden;
    }
    /**
    * Hide elements from all users.
    *
    * Used for elements which should not be immediately displayed to any user. An
    * example would be a collapsible fieldset that will be expanded with a click
    * from a user. The effect of this class can be toggled with the jQuery show()
    * and hide() functions.
    */
    .element-hidden {
      display: none;
    }

    /**
    * Hide elements visually, but keep them available for screen-readers.
    *
    * Used for information required for screen-reader users to understand and use
    * the site where visual display is undesirable. Information provided in this
    * manner should be kept concise, to avoid unnecessary burden on the user.
    * "!important" is used to prevent unintentional overrides.
    */
    .element-invisible {
      position: absolute !important;
      clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
      clip: rect(1px, 1px, 1px, 1px);
      overflow: hidden;
      height: 1px;
    }

    /**
    * The .element-focusable class extends the .element-invisible class to allow
    * the element to be focusable when navigated to via the keyboard.
    */
    .element-invisible.element-focusable:active,
    .element-invisible.element-focusable:focus {
      position: static !important;
      clip: auto;
      overflow: visible;
      height: auto;
    }
    @media screen {
      /**
       * Visible only when printed. Invisible on screen.
       */
      .print-only {
        display: none;
      }
    }
    @media print {
      /**
       * Visible only on screen. Invisible when printed.
       */
      .screen-only {
        display: none;
      }
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("lrn-shared-styles");
