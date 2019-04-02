/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";

// register globally so we can make sure there is only one
window.RichTextPromptStateManager = window.RichTextPromptStateManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.RichTextPromptStateManager.requestAvailability = () => {
  if (!window.RichTextPromptStateManager.instance) {
    window.RichTextPromptStateManager.instance = document.createElement(
      "rich-text-prompt-state-manager"
    );
    document.body.appendChild(window.RichTextPromptStateManager.instance);
  }
  return window.RichTextPromptStateManager.instance;
};
/**
 * `rich-text-prompt-state-manager`
 * `A utility that manages the state of multiple rich-text-prompts on one page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextPromptStateManager extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */ // render function
  static get template() {
    return html`
      <simple-popover id="prompt" hidden$="[[!target]]" for$="[[for]]" auto>
        I'm a popover!
      </simple-popover>
    `;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-prompt-state-manager";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Is the  target id.
       */
      for: {
        type: String,
        value: null
      },
      /**
       * The selected text.
       */
      selection: {
        type: Object,
        value: null
      },
      /**
       * Is the  target selection for the prompt.
       */
      target: {
        type: Object,
        value: null
      }
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    let root = this;

    // sets the instance to the current instance
    if (!window.RichTextPromptStateManager.instance) {
      window.RichTextPromptStateManager.instance = this;
      return this;
    }
  }

  /**
   * life cycle, element is afixed to the DOM
   * Makes sure there is a utility ready and listening for elements.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Loads element into array
   */
  setTarget(el) {
    let sel = el.selection,
      id = "prompt" + Date.now();
    this.clearTarget();
    this.target = document.createElement("span");
    this.target.setAttribute("id", id);
    this.target.appendChild(sel.extractContents());
    el.selection.insertNode(this.target);
    this.for = id;
  }

  /**
   * Unloads element from array
   */
  clearTarget() {
    if (!this.target) return;
    this.for = null;
    let parent = this.target.parentNode;
    parent.insertBefore(this.target.firstChild, this.target);
    parent.removeChild(this.target);
    this.target = null;
  }
}
window.customElements.define(
  RichTextPromptStateManager.tag,
  RichTextPromptStateManager
);
export { RichTextPromptStateManager };
