/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPromptButtonBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-code.js";
import "@lrnwebcomponents/code-editor/lib/monaco-element/monaco-element.js";
/**
 * `hax-text-editor-button`
 * @element hax-text-editor-button
 * `a custom-element button for hax text editor (custom buttons can extend this)`
 *
 */
class HaxTextEditorButton extends RichTextEditorPromptButtonBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hax-text-editor-button";
  }

  // properties available to the custom element for data binding

  static get properties() {
    return {
      ...super.properties,
      element: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.tag = HaxTextEditorButton.tag;
    this.toggles = true;
    this.value = {};
    this.command = "insertHTML";
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "element" && this.element) {
        let el = this.element || {},
          props = el.haxProperties || {},
          settings = props.settings || {},
          gizmo = props.gizmo || {};
        this.fields = [
          ...super.fields,
          ...(settings.configure || [])
            .map((f) => {
              if (f.inputMethod === "code-editor") f.inputMethod = "textfield";
              return f;
            })
            .filter((f) => f.slot !== ""),
        ];
        console.log(this.fields, props);
        this.tagsList = el.tag || "span";
        this.icon = gizmo.icon || "add";
        this.label = gizmo.title || `Add ${el.tag}`;
        this.registerTagClick();
      }
    });
  }

  /**
   * determines commandVal based on values passed from prompt
   */
  get promptCommandVal() {
    let attrs = this.fields
        .map((field) => {
          let attr = field.property;
          return attr &&
            attr !== "innerHTML" &&
            typeof this.value[attr] !== typeof undefined
            ? ` ${attr}=${this.value[attr]}`
            : "";
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
      : `<${this.element.tag}${attrs}>${slots}${this.value.innerHTML}</${this.element.tag}>`;
  }

  /**
   * updates prompt fields with selected range data
   */
  getValue(node) {
    let el = node || this.rangeElement(),
      val = super.getValue();
    console.log("get value", el, val, node);
    if (el) {
      this.fields.forEach((field) => {
        console.log(field);
        if (field.property && field.property !== "innerHTML")
          val[field.property] = el[field.property];
        if (field.slot && field.slot !== "") {
          let slot = el.querySelector(`[slot=${field.slot}]`);
          val[field.slot] = !slot ? undefined : slot.innerHTML;
        }
      });
    }
    console.log("get value", el, val);
    return !el ? undefined : val;
  }
}

window.customElements.define(HaxTextEditorButton.tag, HaxTextEditorButton);
export { HaxTextEditorButton };
