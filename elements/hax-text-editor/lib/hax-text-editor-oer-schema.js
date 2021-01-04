/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPromptButtonBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
import { OerSchemaElement } from "@lrnwebcomponents/oer-schema/oer-schema.js";
/**
 * `hax-text-editor-oer-schema`
 * @element hax-text-editor-oer-schema
 * `a oer-schema button for hax text editor (custom buttons can extend this)`
 *
 */
class RichTextEditorImage extends RichTextEditorPromptButtonBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-image";
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return { ...super.properties };
  }

  constructor() {
    super();
    let element = OerSchemaElement;
    this.fields = element.haxProperties.settings.configure;
    this.tagsList = element.tag;
    this.icon = element.haxProperties.gizmo.icon;
    this.label = element.haxProperties.gizmo.title;
    this.toggles = true;
    this.value = {};
    this.command = "insertHTML";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "hax-text-editor-oer-schema";
  }

  /**
   * determaines commandVal based on values passed from prompt
   */
  get promptCommandVal() {
    let attrs = this.fields
        .map((field) => {
          let attr = field.property;
          return attr ? ` ${attr}=${this.value[attr]}` : "";
        })
        .join(""),
      slots = this.fields
        .map((field) => {
          let slot = field.slot;
          return slot && slot !== ""
            ? `<div slot=${slot}></div>${this.value[slot]}</slot>`
            : "";
        })
        .join("");
    return !this.value.innerHTML
      ? ""
      : `<${element.tag}${attr}>${this.value.innerHTML}</${element.tag}>`;
  }

  /**
   * updates prompt fields with selected range data
   */
  getValue(node) {
    let el = node || this.rangeQuery(),
      val = {};
    if (el) {
      this.fields.forEach((field) => {
        if (field.property) val[field.property] = el[ield.property];
        if (field.slot && field.slot !== "") {
          let slot = el.querySelector(`[slot=${field.slot}]`);
          val[field.slot] = !slot ? undefined : slot.innerHTML;
        }
      });
    }
    return !el ? undefined : val;
  }
}
window.customElements.define(
  HaxTextEditorOerSchema.tag,
  HaxTextEditorOerSchema
);
export { HaxTextEditorOerSchema };
