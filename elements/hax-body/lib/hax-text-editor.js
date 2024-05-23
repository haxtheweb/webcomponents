/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorBehaviors } from "@haxtheweb/rich-text-editor/rich-text-editor.js";
import "./hax-text-editor-toolbar.js";

/**
 * `hax-text-editor`
 * HAX-specific implementation of rich-text-editor
 *
 * @extends RichTextEditorBehaviors
 * @extends LitElement
 * @customElement
 * @demo demo/index.html
 */
class HaxTextEditor extends RichTextEditorBehaviors(LitElement) {
  //styles function
  static get styles() {
    return [...(super.styles || [])];
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hax-text-editor";
  }

  // life cycle
  constructor() {
    super();
    this.haxUIElement = true;
    this.tag = HaxTextEditor.tag;
    this.type = "hax-text-editor-toolbar";
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * allow HAX to toggle edit state when activated
   */
  haxactiveElementChanged(el, val) {
    // overwrite the HAX dom w/ what our editor is supplying
    if (!val && el) {
      el.innerHTML = this.getValue();
    }
    return el;
  }

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("hax-text-editor", HaxTextEditor);
export { HaxTextEditor };
