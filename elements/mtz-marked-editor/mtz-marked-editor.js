import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import "@polymer/iron-validatable-behavior/iron-validatable-behavior.js";
/**
`mtz-marked-editor`
Creates a textarea with common editor logic and can be controlled by UI elements

@demo demo/index.html
*/
let MtzMarkedEditor = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>

    <slot name="controls"></slot> <slot name="textarea"></slot>
    <slot name="footer"></slot>
  `,

  is: "mtz-marked-editor",

  properties: {
    autofocus: Boolean,
    readonly: Boolean,
    textareaSelector: {
      type: String,
      value: "textarea"
    },
    __textarea: Object
  },

  ready() {
    this.__bindControlToEditor = this.__bindControlToEditor.bind(this);
  },

  attached() {
    this.addEventListener("register-control", this.__bindControlToEditor);
    this.__textarea = dom(this).queryDistributedElements(
      '[slot="textarea"]'
    )[0];
  },

  detached() {
    this.removeEventListener("register-control", this.__bindControlToEditor);
  },

  /**
   * Returns the instance of textarea
   * @return {HTMLTextAreaElement}
   */
  getTextarea() {
    return this.__textarea;
  },

  /**
   * Returns the number of lines in the textarea
   * @return {Number}
   */
  getLines() {
    return this.getContent().split(/(?=\n|\r\n)$/gm);
  },

  /**
   * Gets the content of the textarea
   * @return {String}
   */
  getContent() {
    if (typeof this.getTextarea() !== typeof undefined) {
      return this.getTextarea().value;
    }
    return "";
  },

  /**
   * Sets the content of the textarea
   * @param {String} content
   */
  setContent(content) {
    this.getTextarea().value = content;
  },

  /**
   * Gets the selection information from the textarea and puts it into
   * a useful object.
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   * @return {Object} Containing selection information, start, end, text, and length.
   */
  getSelection(textarea = this.getTextarea()) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return {
      start,
      end,
      length: end - start,
      text: textarea.value.substring(start, end)
    };
  },

  /**
   * Updates the selection of the textarea
   * @param {Number} start - Starting index of selection
   * @param {Number} end - Ending index of selection
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   */
  setSelection(start, end, textarea = this.getTextarea()) {
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
  },

  /**
   * Replaces the current selection with the passed in text
   * @param {String} text
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   * @param {Object} [selection=this.getSelection()]
   */
  replaceSelection(
    text,
    textarea = this.getTextarea(),
    selection = this.getSelection()
  ) {
    const val = textarea.value;
    textarea.value = `${val.substr(0, selection.start)}${text}${val.substr(
      selection.end,
      val.length
    )}`;
  },

  /**
   * Adds a reference of editor to the control
   * @param {CustomEvent} event
   * @private
   */
  __bindControlToEditor(event) {
    event.stopPropagation();
    // TODO: Update this in 2.0 to use updated API.
    // dom(event).rootTarget => event.composedPath()[0]
    dom(event).rootTarget.__editor = this;
  }
});
export { MtzMarkedEditor };
