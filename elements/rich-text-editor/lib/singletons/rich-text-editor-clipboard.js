/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `rich-text-editor-clipboard`
 * `A textarea that holds clipboard.`
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-clipboard
 */
class RichTextEditorClipboard extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: none !important;
        }
        textarea {
          position: absolute;
          left: -9999px;
          top: 0;
          width: 0px;
          height: 0px;
          overflow: hidden;
        }
      `,
    ];
  }

  static get properties() {
    return {
      __textarea: {
        type: Object,
      },
    };
  }

  render() {
    return html`<textarea aria-hidden="true"></textarea>`;
  }
  /**
   * gets clipboard data and pastes into an editor's range
   *
   * @param {obj} editor
   * @memberof RichTextEditorSelection
   */
  setClipboard(range) {
    setTimeout(async () => {
      let sel = window.getSelection();
      this.__textarea.value = await navigator.clipboard.readText();
      this.__textarea.focus();
      this.__textarea.select();
      document.execCommand("paste");
      sel.removeAllRanges();
      sel.addRange(range);
    }, 1);
  }
  get value() {
    return this.__textarea.value;
  }

  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-clipboard";
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.__textarea = this.shadowRoot.querySelector("textarea");
  }
}
window.customElements.define(
  RichTextEditorClipboard.tag,
  RichTextEditorClipboard
);
export { RichTextEditorClipboard };

// register globally so we can make sure there is only one
window.RichTextEditorClipboard = window.RichTextEditorClipboard || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
window.RichTextEditorClipboard.requestAvailability = () => {
  if (!window.RichTextEditorClipboard.instance) {
    window.RichTextEditorClipboard.instance = document.createElement(
      "rich-text-editor-clipboard"
    );
    document.body.appendChild(window.RichTextEditorClipboard.instance);
  }
  return window.RichTextEditorClipboard.instance;
};
