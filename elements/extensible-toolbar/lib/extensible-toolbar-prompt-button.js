/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { ExtensibleToolbarButton } from "./extensible-toolbar-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./extensible-toolbar-prompt.js";
import "./extensible-toolbar-button-styles.js";
/**
 * `extensible-toolbar-prompt-button`
 * `a button that prompts for more information for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class ExtensibleToolbarPromptButton extends ExtensibleToolbarButton {
  constructor() {
    super();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * fields for the prompt popover.
       */
      fields: {
        type: Array,
        value: [
          {
            property: "",
            title: "Text",
            description: "The inner text",
            inputMethod: "textfield"
          }
        ]
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object,
        value: {
          "": null,
          id: null
        }
      },
      /**
       * fields for the prompt popover.
       */
      __fields: {
        type: Array,
        value: []
      },
      /**
       * the contents node inside the selected range
       */
      __oldValue: {
        name: "__oldValue",
        type: Object,
        value: null
      },
      /**
       * the prompt that pops up when button is pressed
       */
      __prompt: {
        name: "__prompt",
        type: Object,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "extensible-toolbar-prompt-button";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    this.__prompt = window.ExtensibleToolbarPrompt.requestAvailability();
  }

  /**
   * Handles button tap
   * @param {event} e the button tap event
   */
  _handleButton(e) {
    e.preventDefault();
    this.open();
  }

  /**
   * cleans a field value if needed
   * @param {string} prop field property name
   * @returns {object} val the cleaned property value
   */
  getCleanValue(prop) {
    let val = this.value[prop];
    if (val && typeof val === "string")
      val = val.replace(/[\s\n\t]+/g, " ").trim();
    return val;
  }
  /**
   * updates the insertion based on fields
   */
  cancel() {
    this.value = this.__oldValue;
    this.dispatchEvent(new CustomEvent("cancel", { detail: this }));
    this.deselect();
  }

  /**
   * updates the insertion based on fields
   */
  confirm() {
    this.dispatchEvent(new CustomEvent("confirm", { detail: this }));
    this.deselect();
  }

  /**
   * Handles selecting text and opening prompt
   */
  open() {
    this.updatePrompt();
    this.__prompt.setTarget(this);
    this.dispatchEvent(new CustomEvent("open-prompt", { detail: this }));
  }

  /**
   * updates prompt fields
   */
  updatePrompt(fields) {
    this.__oldValue = this.value;
    this.set("__fields", fields);
  }
}
window.customElements.define(
  ExtensibleToolbarPromptButton.tag,
  ExtensibleToolbarPromptButton
);
export { ExtensibleToolbarPromptButton };
