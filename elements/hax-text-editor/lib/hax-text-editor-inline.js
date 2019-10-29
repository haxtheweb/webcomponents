/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPromptButton } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
/**
 * `hax-text-editor-inline`
 * `a button for inline HAX widgets in hax-text-editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class HaxTextEditorInline extends RichTextEditorPromptButton {
  constructor() {
    super();
    this.inlineWidget = true;
    this.toggles = true;
    this.value = {
      "": null
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      element: {
        type: Object,
        value: null
      },
      tag: {
        type: String,
        computed: "_getTag(element)"
      },
      icon: {
        type: String,
        computed: "_getIcon(element)"
      },
      label: {
        type: String,
        computed: "_getLabel(element)"
      },
      fields: {
        type: String,
        computed: "_getFields(element)"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "hax-text-editor-inline";
  }
  _getTag(element) {
    return element && element.tag ? element.tag : null;
  }
  _getIcon(element) {
    return element && element.haxProperties && element.haxProperties.gizmo
      ? element.haxProperties.gizmo.icon
      : null;
  }
  _getLabel(element) {
    return element && element.haxProperties && element.haxProperties.gizmo
      ? element.haxProperties.gizmo.title
      : null;
  }
  _getFields(element) {
    return element && element.haxProperties && element.haxProperties.settings
      ? element.haxProperties.settings.configure
      : null;
  }
}
window.customElements.define(HaxTextEditorInline.tag, HaxTextEditorInline);
export { HaxTextEditorInline };
