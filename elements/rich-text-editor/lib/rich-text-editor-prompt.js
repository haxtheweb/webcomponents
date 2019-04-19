/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "./rich-text-prompt-state-manager.js";
import "@polymer/paper-input/paper-input.js";

/**
 * `rich-text-editor-prompt`
 * `a picker for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorPrompt extends RichTextEditorButton {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * fields for the prompt popover.
       */
      fields: {
        type: Array,
        value: []
      },
      /**
       * the text of the prompt, as in "Link href" or "Image src"
       */
      prompt: {
        name: "prompt",
        type: String,
        value: "Value"
      },
      /**
       * Optional text field for current selection
       */
      selectionField: {
        type: Object,
        value: null
      },
      /**
       * the target of the prompt
       */
      target: {
        name: "target",
        type: Object,
        value: null
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object,
        value: {}
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-prompt";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    this.__popover = window.RichTextPromptStateManager.requestAvailability();
  }
  /**
   * Handles button tap;
   */
  _buttonTap(e) {
    e.preventDefault();
    this.__targetId = "prompt" + Date.now();
    console.log("selection", this.selection);
    this.target = document.createElement("span");
    this.target.setAttribute("id", this.__targetId);
    this.target.style.outline = "1px dotted #888";
    this.target.appendChild(this.selection.extractContents());
    this.selection.insertNode(this.target);
    if (this.selectionField !== null)
      this.value[this.selectionField.property] = this.target.innerHTML;
    console.log("target", this.target);
    this.__popover.setTarget(this);
  }
  /**
   * placeholder function for prompt action
   */
  doPrompt() {}
}
window.customElements.define(RichTextEditorPrompt.tag, RichTextEditorPrompt);
export { RichTextEditorPrompt };
