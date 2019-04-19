/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./rich-text-editor-styles.js";
import { RichTextEditorPrompt } from "./rich-text-editor-prompt.js";
/**
 * `rich-text-editor-link`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorLink extends RichTextEditorPrompt {
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
            property: "link",
            title: "Link",
            description: "The link URL",
            inputMethod: "textfield"
          }
        ]
      },
      /**
       * Optional text field for current selection
       */
      selectionField: {
        type: Object,
        value: {
          property: "text",
          title: "Text",
          description: "The link text",
          inputMethod: "textfield"
        }
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object,
        value: {
          link: null
        }
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-link";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
  }
  doPrompt() {
    if (this.value.link !== null && this.value.link.trim() !== "") {
      let link = document.createElement("a");
      link.setAttribute("href", this.value.link);
      link.innerHTML = this.value.text;
      let parent = this.target.parentNode;
      parent.insertBefore(link, this.target);
      parent.removeChild(this.target);
    } else {
      console.log("TODO: Remove link", this.selection);
    }
    this.target = null;
    this.value = {};
    this.dispatchEvent(new CustomEvent("deselect", { detail: this }));
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
