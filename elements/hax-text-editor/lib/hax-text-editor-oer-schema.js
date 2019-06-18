/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPromptButton } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
import "@lrnwebcomponents/oer-schema/oer-schema.js";
/**
 * `hax-text-editor-oer-schema`
 * `a oer-schema button for hax text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class HaxTextEditorOerSchema extends RichTextEditorPromptButton {
  constructor() {
    super();
    this.fields = [
      {
        property: "",
        title: "Math",
        description: "Math",
        inputMethod: "textfield"
      }
    ];
    this.tag = "oer-schema";
    this.icon = "hax:oerschema";
    this.label = "OER Schema";
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
    return "hax-text-editor-oer-schema";
  }
}
window.customElements.define(
  HaxTextEditorOerSchema.tag,
  HaxTextEditorOerSchema
);
export { HaxTextEditorOerSchema };
