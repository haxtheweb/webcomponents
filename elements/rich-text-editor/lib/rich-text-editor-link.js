/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./rich-text-editor-styles.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "./rich-text-editor-prompt.js";
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
class RichTextEditorLink extends RichTextEditorButton {
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
            property: "text",
            title: "Text",
            description: "The link text",
            inputMethod: "textfield"
          },
          {
            property: "link",
            title: "Link",
            description: "The link URL",
            inputMethod: "textfield"
          }
        ]
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
    console.log(
      getComputedStyle(this).getPropertyValue(
        "--rich-text-editor-picker-border"
      )
    );
    let root = this;
    this.__popover = window.richTextEditorPrompt.requestAvailability();
  }
  /**
   * Handles button tap;
   */
  _buttonTap(e) {
    e.preventDefault();
    this.getSelectionData();
    this.__popover.setTarget(this);
  }
  /**
   * placeholder function for prompt action
   */
  getSelectionData() {
    let sel = this.selection.commonAncestorContainer,
      parent = sel.tagName === "A" ? sel : sel.parentNode;
    if (parent.tagName === "A") {
      this.value.link = parent.getAttribute("href");
      this.target = parent;
    } else {
      this.target = document.createElement("a");
      this.target.appendChild(this.selection.extractContents());
      this.selection.insertNode(this.target);
    }
    if (!this.target.getAttribute("id"))
      this.target.setAttribute("id", "prompt" + Date.now());
    this.__style = this.style;
    this.target.style.backgroundColor = getComputedStyle(this).getPropertyValue(
      "--rich-text-editor-selection-bg"
    );
    this.value.text = this.target.innerHTML;
  }
  doTextOperation() {
    if (this.value.link !== null && this.value.link.trim() !== "") {
      this.target.setAttribute("href", this.value.link.trim());
      this.target.innerHTML = this.value.text;
      this.target.style = this.__style;
    } else {
      let parent = this.target.parentNode;
      while (this.target.firstChild)
        parent.insertBefore(this.target.firstChild, this.target);
      parent.removeChild(this.target);
    }
    this.target = null;
    this.value = {};
    this.dispatchEvent(new CustomEvent("deselect", { detail: this }));
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
