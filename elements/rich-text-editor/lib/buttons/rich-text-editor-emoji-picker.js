/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
/**
 * `rich-text-editor-emoji-picker`
 * an emoji button for the rich-text-editor that opens inline Merlin's
 * "Insert emoji" program at the cursor instead of rendering a full option
 * grid. Tag name is preserved so existing toolbar configs keep working.
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorButtonBehaviors
 * @extends LitElement
 * @element rich-text-editor-emoji-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorEmojiPicker extends RichTextEditorButtonBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-emoji-picker";
  }

  static get styles() {
    return [super.styles, css``];
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
    };
  }

  constructor() {
    super();
    this.icon = "editor:insert-emoticon";
    this.label = "Insert emoji";
    this.command = "insertHTML";
    this.tagsList = "";
  }

  /**
   * Override the click handler so the button opens inline Merlin's
   * "Insert emoji" program at the RTE cursor instead of running an
   * execCommand. HAXStore listens for the event and opens the program.
   */
  _handleClick(e) {
    if (this.disabled) {
      return;
    }
    this._openInlineProgram(
      "insert-emoji",
      "Insert emoji",
      "Search for an emoji",
    );
  }

  /**
   * Dispatch a bubbling event with the RTE's preserved range/selection/target
   * so HAXStore can open the inline Merlin program without rich-text-editor
   * depending on hax-body (which would be a circular import).
   */
  _openInlineProgram(machineName, name, placeholder) {
    const range = this.range;
    const target =
      this.target ||
      (this.__highlight && this.__highlight.parentNode);
    if (!range || !target) {
      return;
    }
    const selection = globalThis.getSelection();
    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (err) {
      console.warn(err);
      return;
    }
    this.dispatchEvent(
      new CustomEvent("rich-text-editor-open-inline-program", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          machineName: machineName,
          name: name,
          placeholder: placeholder,
          range: range,
          selection: selection,
          target: target,
        },
      }),
    );
  }
}
globalThis.customElements.define(
  RichTextEditorEmojiPicker.tag,
  RichTextEditorEmojiPicker,
);
export { RichTextEditorEmojiPicker };
