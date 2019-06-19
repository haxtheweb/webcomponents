/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPromptButton } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
import "@lrnwebcomponents/lrn-vocab/lrn-vocab.js";
/**
 * `hax-text-editor-vocab`
 * `a lrn-vocab button for hax text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class HaxTextEditorVocab extends RichTextEditorPromptButton {
  constructor() {
    super();
    this.inlineWidget = true;
    this.fields = [
      {
        property: "term",
        title: "Term",
        inputMethod: "textfield"
      },
      {
        property: "",
        title: "Definition",
        inputMethod: "textfield"
      }
    ];
    this.tag = "lrn-vocab";
    this.icon = "hax:vocab";
    this.label = "Term/Definition";
    this.toggles = true;
    this.value = {
      "": null
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hax-text-editor-vocab";
  }
}
window.customElements.define(HaxTextEditorVocab.tag, HaxTextEditorVocab);
export { HaxTextEditorVocab };
