/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPromptButton } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
import { LrnMath } from "@lrnwebcomponents/lrn-math/lrn-math.js";
/**
 * `hax-text-editor-math`
 * @element hax-text-editor-math
 * `a math button for hax text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 */
class HaxTextEditorMath extends RichTextEditorPromptButton {
  constructor() {
    super();
    this.inlineWidget = true;
    let element = LrnMath;
    this.fields = element.haxProperties.settings.configure;
    this.tag = element.tag;
    this.icon = element.haxProperties.gizmo.icon;
    this.label = element.haxProperties.gizmo.title;
    this.toggles = true;
    this.value = {
      "": null,
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "hax-text-editor-math";
  }

  /**
   * deselects the text
   */
  deselect() {
    super.deselect();
    let math =
      this.__selectionContents &&
      this.__selectionContents.tagName &&
      this.__selectionContents.tagName.toLowerCase() === this.tag
        ? this.__selectionContents
        : null;
    if (math) math.refresh();
  }
}
window.customElements.define(HaxTextEditorMath.tag, HaxTextEditorMath);
export { HaxTextEditorMath };
