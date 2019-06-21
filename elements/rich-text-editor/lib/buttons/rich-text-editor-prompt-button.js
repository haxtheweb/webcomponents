/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "../singletons/rich-text-editor-selection.js";
import "../singletons/rich-text-editor-prompt.js";
import "./rich-text-editor-button-styles.js";
/**
 * `rich-text-editor-prompt-button`
 * `a button that prompts for more information for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorPromptButton extends RichTextEditorButton {
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
       * is the element a custom inline widget element?
       */
      inlineWidget: {
        name: "inlineWidget",
        type: Boolean,
        value: false
      },
      /**
       * the tag that will wrap the selected range
       */
      tag: {
        name: "tag",
        type: String,
        value: "span"
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
      },
      /**
       * the highlight surrounding the selected range
       */
      __selection: {
        name: "__selection",
        type: Object,
        value: null
      },
      /**
       * the contents node inside the selected range
       */
      __selectionContents: {
        name: "__selectionContents",
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
    return "rich-text-editor-prompt-button";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    this.__prompt = window.RichTextEditorPrompt.requestAvailability();
    this.__selection = window.RichTextEditorSelection.requestAvailability();
  }

  /**
   * Handles button tap
   * @param {event} e the button tap event
   */
  _buttonTap(e) {
    e.preventDefault();
    this.selectRange();
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
    this.confirm();
  }

  /**
   * updates the insertion based on fields
   */
  confirm() {
    this.updateSelection();
    this.deselect();
  }

  /**
   * deselects the text
   */
  deselect() {
    this.__prompt.clearTarget("");
    this.__selection.normalize();
    this.__selection.parentNode.insertBefore(
      this.__selectionContents,
      this.__selection
    );
    this.__selection.range.selectNode(this.__selectionContents);
    this.__selection.range.collapse();
    this.__selection.hidden = true;
  }

  /**
   * Handles editor change
   * @param {string} newVal the new editor's id
   * @param {string} oldVal the old editor's id
   * @returns {void}
   */
  _editorChanged(newVal, oldVal) {
    let root = this,
      newEditor = newVal ? document.getElementById(newVal) : null,
      oldEditor = oldVal ? document.getElementById(oldVal) : null;
    if (newEditor)
      newEditor.addEventListener(
        "click",
        e => {
          root._editInlineWidget(newEditor, e);
        },
        true
      );
    if (oldEditor)
      oldEditor.removeEventListener(
        "click",
        e => {
          root._editInlineWidget(oldEditor, e);
        },
        true
      );
    super._editorChanged(newVal, oldVal);
  }
  /**
   *
   * @param {object} editor the active editor
   * @param {event} e the edit event
   * @returns {boolean} whether to prevent the default behavior for an inline widget
   */
  _editInlineWidget(editor, e) {
    if (
      editor.getAttribute("contenteditable") &&
      this.inlineWidget &&
      e.target.tagName &&
      e.target.tagName.toLowerCase() === this.tag
    ) {
      e.stopPropagation();
      e.preventDefault();
      this.selectWidget(e.target);
      this.open();
      return false;
    } else {
      return true;
    }
  }

  selectWidget(widget) {
    this.__selection.selectNode(widget);
    this.__selectionContents = widget;
  }

  selectRange() {
    this.__selectionContents = this.__selection.expandSelection(this.tag);
  }

  /**
   * Handles selecting text and opening prompt
   */
  open() {
    this.__selection.addHighlight();
    this.updatePrompt();
    this.__prompt.setTarget(this);
    this.dispatchEvent(new CustomEvent("select", { detail: this }));
  }

  /**
   * updates prompt fields with selected range data
   */
  updatePrompt() {
    this.__oldValue = this.value;
    let el = this.__selectionContents,
      promptWidth = "200px";
    el.normalize();
    el.innerHTML.trim();
    this.fields.forEach(field => {
      if (field.inputMethod && field.inputMethod === "code-editor")
        promptWidth = "400px";
      if (field.property && field.property !== "") {
        this.value[field.property] = el
          ? el.getAttribute(field.property)
          : null;
      } else if (field.slot && field.slot !== "") {
        this.value[field.slot] =
          el & el.querySelector(field.slot)
            ? el
                .querySelector(field.slot)
                .innerHTML.replace(/[\s\n\t]+/g, " ")
                .trim()
            : null;
      } else {
        this.value[""] = el
          ? el.innerHTML.replace(/[\s\n\t]+/g, " ").trim()
          : "";
      }
    });
    this.__prompt.width = promptWidth;
  }

  /**
   * updates the insertion based on fields
   */
  updateSelection() {
    this.__selection.innerHTML = "";
    let selection = document.createTextNode(this.getCleanValue(""));
    if (this._getTagNeeded(this.value)) {
      selection = document.createElement(this.tag);
      this.fields.forEach(field => {
        if (field.property) {
          selection.setAttribute(
            field.property,
            this.getCleanValue(field.property)
          );
        } else if (field.slot && field.slot !== "") {
          let slot = this.getCleanValue(field.slot);
          selection.innerHTML += `<span slot="${field.slot}">${slot}</slot>`;
        } else {
          selection.innerHTML += `${this.getCleanValue("")}`;
        }
      });
    } else {
      selection.innerHTML += `${this.getCleanValue("")}`;
    }
    this.__selectionContents = selection;
    if (selection) this.__selection.appendChild(selection);
  }

  /**
   * determines if the tag is needed for the element
   * @param {object} value the prompt values
   * @returns {boolean} if the tag is needed for the element
   */
  _getTagNeeded(value) {
    return value && this.getCleanValue("") && this.getCleanValue("") !== "";
  }
}
window.customElements.define(
  RichTextEditorPromptButton.tag,
  RichTextEditorPromptButton
);
export { RichTextEditorPromptButton };
