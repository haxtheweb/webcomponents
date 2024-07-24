/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
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
  setClipboard() {
    this.__textarea =
      this.__textarea || this.shadowRoot.querySelector("textarea");
    setTimeout(async () => {
      this.__textarea.value = await globalThis.navigator.clipboard.readText();
      this.__textarea.focus();
      this.__textarea.select();
      globalThis.document.execCommand("paste");
    }, 1);
  }
  get value() {
    this.__textarea =
      this.__textarea || this.shadowRoot.querySelector("textarea");
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
    this.haxUIElement = true;
  }
}
customElements.define(RichTextEditorClipboard.tag, RichTextEditorClipboard);
export { RichTextEditorClipboard };

// register globally so we can make sure there is only one
globalThis.RichTextEditorClipboard = globalThis.RichTextEditorClipboard || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
globalThis.RichTextEditorClipboard.requestAvailability = () => {
  if (!globalThis.RichTextEditorClipboard.instance) {
    globalThis.RichTextEditorClipboard.instance =
      globalThis.document.createElement("rich-text-editor-clipboard");
    globalThis.document.body.appendChild(
      globalThis.RichTextEditorClipboard.instance,
    );
  }
  return globalThis.RichTextEditorClipboard.instance;
};
